import { defineButtonHandler } from "chooksie";
async function db() {
  // Only expose the Tag model from our database
  const { Points } = await import("../db");
  return Points;
}

export default defineButtonHandler({
  customId: "submit",
  setup: db,
  async execute(ctx) {
    const payload: {
      User: string;
      Project: string;
    } = JSON.parse(ctx.payload!);

    //@ts-ignore
    if (ctx.interaction.member?.roles.cache.has(process.env.ADMIN_ROLE!)) {
      // Add points to user
      try {
        await this.increment("points", {
          by: 200,
          where: {
            user: payload.User,
          },
        });
      } catch (e) {
        return await ctx.interaction.reply({
          content: `There was an error approving your project`,
          ephemeral: true,
        });
      }
      await ctx.interaction.reply({
        content: `Approved! points added to user <@${payload.User}> for project ${payload.Project}!`,
        allowedMentions: {
          users: [],
        },
      });
      //@ts-expect-error
      await ctx.interaction.message.delete();
    } else {
      await ctx.interaction.reply({
        content: `You do not have permission to approve projects...`,
        ephemeral: true,
      });
    }
  },
});
