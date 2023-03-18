import { defineSlashCommand } from "chooksie";

async function db() {
  const { Points } = await import("../db");
  return Points;
}

export default defineSlashCommand({
  name: "leaderboard",
  description: "View the points leaderboard",
  setup: db,
  async execute(ctx) {
    const points = await this.findAll({
      order: [["points", "DESC"]],
      limit: 10,
    });
    //remove any id equal to the string null
    points.filter((p: { user: string }) => p.user !== "null");

    const embed = {
      title: "Points Leaderboard",
      description: points
        .map(
          (p: { user: string; points: number }) => `<@${p.user}>: ${p.points}`
        )
        .join("\n"),
    };

    await ctx.interaction.reply({
      embeds: [embed],
    });
  },
});
