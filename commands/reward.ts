import { defineSlashCommand } from "chooksie";

async function db() {
  // Only expose the Tag model from our database
  const { Points } = await import("../db");
  return Points;
}

export default defineSlashCommand({
  name: "reward",
  description: "Reward a user with points (Admin only)",
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
        user: ctx.interaction.options.getUser("user")!.id,
        points: 0,
      });
    } catch (e) {
      // User already exists
      //catch errors if the error is not related to the user already existing and handle it
      if ((e as Error).name !== "SequelizeUniqueConstraintError") {
        return await ctx.interaction.reply({
          content: `There was an error rewarding the user`,
          ephemeral: true,
        });
      }
    }

    // Add points to user
    try {
      await this.increment("points", {
        by: ctx.interaction.options.getInteger("points")!,
        where: {
          user: ctx.interaction.options.getUser("user")!.id,
        },
      });
    } catch (e) {
      return await ctx.interaction.reply({
        content: `There was an error rewarding the user`,
        ephemeral: true,
      });
    }

    await ctx.interaction.reply({
      content: `Rewarded <@${
        ctx.interaction.options.getUser("user")!.id
      }> with ${ctx.interaction.options.getInteger("points")!} points`,
      ephemeral: true,
      allowedMentions: {
        users: [],
      },
    });
  },
  options: [
    {
      name: "user",
      description: "The user to reward",
      type: "USER",
      required: true,
    },
    {
      name: "points",
      description: "The amount of points to reward",
      type: "INTEGER",
      required: true,
    },
  ],
});
