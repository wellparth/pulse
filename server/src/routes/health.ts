import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    return reply.send({
      status: 'ok',
      service: 'DailyPulse Fastify API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
}
