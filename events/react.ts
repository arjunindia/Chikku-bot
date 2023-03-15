import { defineEvent } from "chooksie";

export default defineEvent({
  name: "messageReactionAdd",
  once: false,
  execute(ctx, reaction, user) {
    ctx.logger.info(`Reaction added!`);
  },
});
