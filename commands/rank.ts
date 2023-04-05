import { defineSlashCommand } from "chooksie";
import { Op } from "sequelize";
import {
  CanvasRenderingContext2D,
  Image,
  createCanvas,
  loadImage,
  registerFont,
  Canvas,
} from "canvas";

async function db() {
  const { Points } = await import("../db");
  return Points;
}

const drawAvatar = async (
  ctx: any,
  c: CanvasRenderingContext2D,
  canvas: Canvas,
  avatar: Image,
  rank: number,
  points: number
) => {
  // Draw the background
  loadImage("assets/bg.jpg").then((image) => {
    c.drawImage(image, 0, 0, canvas.width, canvas.height);
  });

  // Draw the user's avatar
  //put the avatar in a circle and make sure we save the state so we can undo the clip
  c.save();
  c.beginPath();
  c.arc(125, 125, 100, 0, Math.PI * 2, true);
  c.closePath();
  c.clip();
  c.drawImage(avatar, 25, 25, 200, 200);
  //remove the clip so the text can be drawn
  c.restore();

  // Draw the user's name and discriminator in small text
  c.font = "20px sans-serif";
  c.fillStyle = "#FFFFFF";
  c.fillText(
    `${ctx.interaction.user.username}#${ctx.interaction.user.discriminator}`,
    300,
    50
  );

  // Draw the user's rank
  c.font = "bold 50px Poppins";
  c.fillStyle = "#FFFFFF";
  c.fillText(`Rank : #${rank + 1}`, 300, 120);

  //add a BORDER to the avatar
  c.beginPath();
  c.arc(125, 125, 100, 0, Math.PI * 2, true);
  c.closePath();
  c.lineWidth = 6;
  //discord green
  c.strokeStyle = "#43B581";
  c.stroke();

  // Draw the user's points
  c.fillStyle = "#FFFFFF";
  c.fillText(`${points} points`, 300, 200);

  return canvas;
};

export default defineSlashCommand({
  name: "rank",
  description: "View your rank and points on the points leaderboard",
  setup: db,
  async execute(ctx) {
    // Get the user's points
    const points = await this.findOne({
      where: {
        user: ctx.interaction.user.id,
      },
    });

    // If the user doesn't have any points, tell them
    if (!points) {
      await ctx.interaction.reply({
        content: "You don't have any points yet!",
        ephemeral: true,
      });
      return;
    }
    const avatar = await loadImage(
      ctx.interaction.user.displayAvatarURL({ format: "png" })
    );
    // Create the canvas
    const canvas = createCanvas(800, 250);
    const c = canvas.getContext("2d");

    await ctx.interaction.deferReply();

    // Get the user's rank, based on their points and date of modification (if they have the same amount of points) in the database (the lower the rank, the higher the points)
    const rank = await this.findAndCountAll({
      where: {
        points: {
          [Op.gt]: points.points,
        },
      },
      order: [
        ["points", "DESC"],
        ["updatedAt", "DESC"],
      ],
    });
    console.log(rank.count);
    // Draw the avatar
    const canvasWithAvatar = await drawAvatar(
      ctx,
      c,
      canvas,
      avatar,
      rank.count,
      points.points
    );

    // Send the image

    await ctx.interaction.editReply({
      files: [
        {
          attachment: canvasWithAvatar.toBuffer(),
          name: "rank.png",
        },
      ],
    });
  },
});
