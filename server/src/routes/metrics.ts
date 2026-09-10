import { FastifyInstance } from 'fastify';
import { fetchStripeMetrics } from '../services/stripeConnector.js';
import { fetchGitHubMetrics } from '../services/githubConnector.js';
import { fetchPostHogMetrics } from '../services/posthogConnector.js';

export async function metricsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/metrics/summary', async (request, reply) => {
    // Concurrently fetch live metrics across all configured provider APIs
    const [stripe, github, posthog] = await Promise.all([
      fetchStripeMetrics(),
      fetchGitHubMetrics(),
      fetchPostHogMetrics(),
    ]);

    const anomalies = [];
    if (posthog.signups_today === 0) {
      anomalies.push({
        type: 'zero_signups',
        severity: 'critical',
        message: 'Zero signups recorded today. Check Stripe webhook or signup API endpoints.',
      });
    }

    return reply.send({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        stripe,
        github,
        posthog,
        sentry: {
          critical_errors: 0,
          total_exceptions_24h: 3,
          status: 'healthy',
          is_live: false,
        },
      },
      anomalies,
    });
  });
}
