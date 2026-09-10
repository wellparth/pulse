import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { sendSlackDigest, sendDiscordDigest } from '../services/notifications.js';
import { fetchStripeMetrics } from '../services/stripeConnector.js';
import { fetchGitHubMetrics } from '../services/githubConnector.js';
import { fetchPostHogMetrics } from '../services/posthogConnector.js';

const NotificationTriggerSchema = z.object({
  channel: z.enum(['slack', 'discord']),
  webhookUrl: z.string().url(),
});

export async function notificationRoutes(fastify: FastifyInstance) {
  fastify.post('/api/v1/notifications/trigger', async (request, reply) => {
    const parseResult = NotificationTriggerSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid notification parameters',
        details: parseResult.error.issues,
      });
    }

    const { channel, webhookUrl } = parseResult.data;

    // Fetch live current metrics
    const [stripe, github, posthog] = await Promise.all([
      fetchStripeMetrics(),
      fetchGitHubMetrics(),
      fetchPostHogMetrics(),
    ]);

    const metricsData = {
      mrrFormatted: stripe.formatted_mrr,
      signupsToday: posthog.signups_today,
      errorsCount: 0,
      githubStars: github.stars_count,
      anomalies: posthog.signups_today === 0 ? [{ type: 'zero_signups', message: 'Zero signups today' }] : [],
    };

    let sent = false;
    if (channel === 'slack') {
      sent = await sendSlackDigest(webhookUrl, metricsData);
    } else if (channel === 'discord') {
      sent = await sendDiscordDigest(webhookUrl, metricsData);
    }

    if (sent) {
      return reply.send({
        success: true,
        message: `Successfully sent daily digest to ${channel.toUpperCase()} webhook.`,
      });
    } else {
      return reply.status(500).send({
        success: false,
        error: `Failed to deliver webhook to ${channel}. Check webhook URL status.`,
      });
    }
  });
}
