import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const ConnectSchema = z.object({
  provider: z.enum(['stripe', 'github', 'posthog', 'sentry']),
  apiKey: z.string().min(1),
  meta: z.record(z.any()).optional(),
});

export async function integrationsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/integrations', async (request, reply) => {
    return reply.send({
      success: true,
      integrations: [
        { id: '1', provider: 'stripe', name: 'Stripe Billing', connected: Boolean(process.env.STRIPE_SECRET_KEY), lastSynced: new Date().toISOString() },
        { id: '2', provider: 'posthog', name: 'PostHog Analytics', connected: Boolean(process.env.POSTHOG_API_KEY), lastSynced: new Date().toISOString() },
        { id: '3', provider: 'sentry', name: 'Sentry Error Tracking', connected: Boolean(process.env.SENTRY_AUTH_TOKEN), lastSynced: new Date().toISOString() },
        { id: '4', provider: 'github', name: 'GitHub Repositories', connected: Boolean(process.env.GITHUB_TOKEN), lastSynced: new Date().toISOString() },
      ],
    });
  });

  fastify.post('/api/v1/integrations/connect', async (request, reply) => {
    const parseResult = ConnectSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid parameters',
        details: parseResult.error.issues,
      });
    }

    const { provider, apiKey } = parseResult.data;

    // Set process environment key dynamically for runtime usage
    if (provider === 'stripe') process.env.STRIPE_SECRET_KEY = apiKey;
    if (provider === 'github') process.env.GITHUB_TOKEN = apiKey;
    if (provider === 'posthog') process.env.POSTHOG_API_KEY = apiKey;
    if (provider === 'sentry') process.env.SENTRY_AUTH_TOKEN = apiKey;

    return reply.send({
      success: true,
      message: `Successfully connected ${provider} integration. Live metrics are now active.`,
      provider,
      connected: true,
    });
  });
}
