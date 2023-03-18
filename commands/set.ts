import { defineSlashCommand } from "chooksie";

async function db() {
  // Only expose the Tag model from our database
  const { Points } = await import("../db");
  return Points;
}

export default defineSlashCommand({
  name: "set",
  description: "set points of a user (Admin only)",
  setup: db,
  async execute(ctx) {
    //check if the user has the admin role

    //@ts-ignore
    if (!ctx.interaction.member?.roles.cache.has(process.env.ADMIN_ROLE!)) {
      return await ctx.interaction.reply({
        content: `You do not have permission to reward users...`,
        ephemeral: true,
      });
    }
    // Add user to database if they don't exist
    try {
      await this.create({
        user: ctx.interaction.options.getUser("to")?.id,
        points: 0,
      });
    } catch (e) {
      // User already exists
      //catch errors if the error is not related to the user already existing and handle it
      if ((e as Error).name !== "SequelizeUniqueConstraintError") {
        ctx.logger.error(e);
        return await ctx.interaction.reply({
          content: `There was an error rewarding the user`,
          ephemeral: true,
        });
      }
    }

    // Add points to user
    try {
      await this.update(
        {
          points: ctx.interaction.options.getInteger("points")!,
        },
        {
          where: {
            user: ctx.interaction.options.getUser("to")?.id,
          },
        }
      );
    } catch (e) {
      ctx.logger.error(e);
      return await ctx.interaction.reply({
        content: `There was an error rewarding the user`,
        ephemeral: true,
      });
    }

    await ctx.interaction.reply({
      content: `Set <@${
        ctx.interaction.options.getUser("to")!.id
      }> with ${ctx.interaction.options.getInteger("points")!} points`,
      ephemeral: true,
      allowedMentions: {
        users: [],
      },
    });
  },
  options: [
    {
      name: "to",
      description: "The user to set points for",
      type: "USER",
      required: true,
    },
    {
      name: "points",
      description: "The amount of points to set",
      type: "INTEGER",
      required: true,
    },
  ],
});
