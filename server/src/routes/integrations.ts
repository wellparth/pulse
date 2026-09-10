import { FastifyInstance } from 'fastify';

export async function integrationsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/integrations', async (request, reply) => {
    return reply.send({
      success: true,
      integrations: [
        { id: '1', provider: 'stripe', name: 'Stripe Billing', connected: true, lastSynced: new Date().toISOString() },
        { id: '2', provider: 'posthog', name: 'PostHog Analytics', connected: true, lastSynced: new Date().toISOString() },
        { id: '3', provider: 'sentry', name: 'Sentry Error Tracking', connected: true, lastSynced: new Date().toISOString() },
        { id: '4', provider: 'github', name: 'GitHub Repositories', connected: true, lastSynced: new Date().toISOString() },
      ],
    });
  });
}
