import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { healthRoutes } from './routes/health.js';
import { metricsRoutes } from './routes/metrics.js';
import { integrationsRoutes } from './routes/integrations.js';
import { oauthRoutes } from './routes/oauth.js';
import { notificationRoutes } from './routes/notifications.js';
import { authRoutes } from './routes/auth.js';
import { pulseOauthRoutes } from './routes/pulseOauth.js';
import { startCronWorker } from './services/cronWorker.js';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
});

async function main() {
  await fastify.register(cors, {
    origin: '*',
  });

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'dailypulse-super-secret-key-change-in-production',
  });

  await fastify.register(healthRoutes);
  await fastify.register(metricsRoutes);
  await fastify.register(integrationsRoutes);
  await fastify.register(oauthRoutes);
  await fastify.register(notificationRoutes);
  await fastify.register(authRoutes);
  await fastify.register(pulseOauthRoutes);

  // Start background daily metrics cron worker
  startCronWorker();

  const PORT = Number(process.env.PORT) || 4000;
  const HOST = process.env.HOST || '0.0.0.0';

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`⚡ DailyPulse Fastify Server running at http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
