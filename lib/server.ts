import { defineOnLoad } from "chooksie";
import fastify from "fastify";
import { Points } from "../db";
export const chooksOnLoad = defineOnLoad((ctx) => {
  const app = fastify();

  // api endpoint to get points for all users
  app.get("/", async (request, reply) => {
    const points = await Points.findAll();
    return points;
  });

  // api endpoint to get points for a specific user
  app.get("/:user", async (request: any, reply) => {
    const { user } = request.params;
    const points = await Points.findOne({
      where: {
        user: user,
      },
    });
    if (points === null) {
      reply.code(404);
      return {
        error: "User not found - likely has not submitted any projects yet",
      };
    }
    return points;
  });

  app.listen({ port: 8080 }, (err, address) => {
    if (err) {
      ctx.logger.error(err);
      process.exit(1);
    }
    ctx.logger.info(`Server listening at ${address}`);
  });
});
