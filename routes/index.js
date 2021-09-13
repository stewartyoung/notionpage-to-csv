// routes/index.js

const fastify = require("fastify")({
    logger: true,
  });
  
  // Controllers
  const controller = require("../controllers/controller");
  
  // Routes
  fastify.get("/", async (req, reply) => {
    try {
      const res = await controller.getDatabaseEntries();
      reply.type("application/json").code(200);
      return { data: res };
    } catch (error) {
      reply.type("application/json").code(400);
      return { error };
    }
  });

  fastify.get("/programming-monolith/", async(req, reply) => {
    try {
        const res = await controller.getProgrammingPage();
        reply.type("application/json").code(200);
        return {data : res};
    } catch (error) {
        reply.type("application/json").code(400);
        return { error };
    }
  });
  
  module.exports = fastify;