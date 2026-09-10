import { FastifyInstance } from 'fastify';

export async function metricsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/metrics/summary', async (request, reply) => {
    return reply.send({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        stripe: {
          mrr_cents: 124000,
          formatted_mrr: '$1,240.00',
          growth_percentage: 12.5,
          active_subscribers: 84,
        },
        posthog: {
          signups_today: 48,
          active_users_dau: 312,
        },
        sentry: {
          critical_errors: 0,
          total_exceptions_24h: 3,
          status: 'healthy',
        },
        github: {
          stars_count: 342,
          new_stars_this_week: 14,
          open_issues: 2,
        },
      },
      anomalies: [],
    });
  });
}
