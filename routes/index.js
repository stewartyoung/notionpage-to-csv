// routes/index.js

const fastify = require("fastify")({
    logger: true,
  });
  
  // Controllers
  const controller = require("../controllers/controller");
  
  // Routes
  fastify.get("/", async (req, reply) => {
    try {
      const res = await controller.getAllCourses();
      reply.type("application/json").code(200);
      return { data: res };
    } catch (error) {
      reply.type("application/json").code(400);
      return { error };
    }
  });
  
  fastify.post("/", async (req, reply) => {
    try {
      const { name, email } = req.body;
      reply.type("application/json").code(200);
      return { data: res };
    } catch (error) {
      reply.type("application/json").code(400);
      return { data: error };
    }
  });
  
  module.exports = fastify;