import { defineButtonHandler } from "chooksie";

export default defineButtonHandler({
  customId: "submit",
  async execute(ctx) {
    const payload: {
      User: string;
      Project: string;
    } = JSON.parse(ctx.payload!);
    //@ts-ignore
    if (ctx.interaction.member?.roles.cache.has(process.env.ADMIN_ROLE!)) {
      await ctx.interaction.reply({
        content: `Approved! points added to user <@${payload.User}> for project ${payload.Project}`,
        allowedMentions: {
          users: [],
        },
      });
      //@ts-expect-error
      await ctx.interaction.message.delete();
    } else {
      await ctx.interaction.reply({
        content: `You do not have permission to approve projects`,
        ephemeral: true,
      });
    }
  },
});
