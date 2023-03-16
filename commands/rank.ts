import { defineSlashCommand } from "chooksie";
import { Op } from "sequelize";
import { createCanvas, loadImage, registerFont } from "canvas";

async function db() {
  const { Points } = await import("../db");
  return Points;
}

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
    await ctx.interaction.deferReply();

    // Get the user's rank
    const rank = await this.count({
      where: {
        points: {
          [Op.gt]: points.points,
        },
      },
    });

    // Create the canvas
    const canvas = createCanvas(700, 250);
    const c = canvas.getContext("2d");

    // Register a font
    registerFont("assets/fonts/Poppins-Bold.ttf", {
      family: "Poppins",
    });

    // Draw the background
    loadImage("assets/bg.jpg").then((image) => {
      c.drawImage(image, 0, 0, canvas.width, canvas.height);
    });

    // Draw the user's avatar
    const avatar = await loadImage(
      ctx.interaction.user.displayAvatarURL({ format: "png" })
    );
    //put the avatar in a circle and make sure we save the state so we can undo the clip
    c.save();
    c.beginPath();
    c.arc(125, 125, 100, 0, Math.PI * 2, true);
    c.closePath();
    c.clip();
    c.drawImage(avatar, 25, 25, 200, 200);
    //remove the clip so the text can be drawn
    c.restore();
    // Draw the user's rank
    c.font = "bold 50px Poppins";
    c.fillStyle = "#FFFFFF";
    c.fillText(`Rank : #${rank + 1}`, 300, 100);

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
    c.fillText(`${points.points} points`, 300, 200);

    await ctx.interaction.editReply({
      files: [
        {
          attachment: canvas.toBuffer(),
          name: "rank.png",
        },
      ],
    });
  },
});
