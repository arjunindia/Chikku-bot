import { defineSlashCommand } from "chooksie";
import { MessageButton, MessageActionRow } from "discord.js";

export default defineSlashCommand({
  name: "submit",
  description: "Submit your project for review!",
  async execute(ctx) {
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
