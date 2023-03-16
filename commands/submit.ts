import { defineSlashCommand } from "chooksie";
import { MessageButton, MessageActionRow } from "discord.js";

async function db() {
  // Only expose the Tag model from our database
  const { Points } = await import("../db");
  return Points;
}

export default defineSlashCommand({
  name: "submit",
  description: "Submit your project for review!",
  setup: db,
  async execute(ctx) {
    // Add user to database if they don't exist
    try {
      await this.create({
        user: ctx.interaction.user.id,
        points: 0,
      });
    } catch (e) {
      // User already exists
      //catch errors if the error is not related to the user already existing and handle it
      if ((e as Error).name !== "SequelizeUniqueConstraintError") {
        return await ctx.interaction.reply({
          content: `There was an error submitting your project`,
          ephemeral: true,
        });
      }
    }

    await ctx.interaction.reply({
      content: `Project Submitted! for ${ctx.interaction.options.getString(
        `project`
      )}`,
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId(
              `submit|${JSON.stringify({
                User: ctx.interaction.user.id,
                Project: ctx.interaction.options.getString(`project`),
              })}`
            )
            .setStyle("PRIMARY")
            .setEmoji("📝")
            .setLabel("Approve")
        ),
      ],
    });
  },
  options: [
    {
      name: "project",
      description: "The project you want to submit",
      type: "STRING",
      choices: [
        {
          name: "Project 1",
          value: "project1",
        },
        {
          name: "Project 2",
          value: "project2",
        },
        {
          name: "Project 3",
          value: "project3",
        },
        {
          name: "Project 4",
          value: "project4",
        },
      ],
      required: true,
    },
  ],
});
