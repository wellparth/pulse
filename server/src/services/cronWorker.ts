import cron from 'node-cron';
import { fetchStripeMetrics } from './stripeConnector.js';
import { fetchGitHubMetrics } from './githubConnector.js';
import { fetchPostHogMetrics } from './posthogConnector.js';
import { fetchVercelMetrics } from './vercelConnector.js';
import { sendSlackDigest, sendDiscordDigest } from './notifications.js';

export function startCronWorker() {
  console.log('⏰ Initializing DailyPulse Morning Cron Scheduler (Target: 08:00 AM daily)...');

  // Schedule task to run at 08:00 AM every morning ('0 8 * * *')
  cron.schedule('0 8 * * *', async () => {
    console.log('⚡ Running DailyPulse Morning Metrics Ingestion Job...');

    try {
      const [stripe, github, posthog, vercel] = await Promise.all([
        fetchStripeMetrics(),
        fetchGitHubMetrics(),
        fetchPostHogMetrics(),
        fetchVercelMetrics(),
      ]);

      const anomalies = [];
      if (posthog.signups_today === 0) {
        anomalies.push({ type: 'zero_signups', message: 'Zero signups recorded today.' });
      }
      if (vercel.latest_deployment_status === 'ERROR') {
        anomalies.push({ type: 'deployment_error', message: 'Latest Vercel deployment failed.' });
      }

      const metricsData = {
        mrrFormatted: stripe.formatted_mrr,
        signupsToday: posthog.signups_today,
        errorsCount: 0,
        githubStars: github.stars_count,
        anomalies,
      };

      // Dispatch to Slack Webhook if configured
      if (process.env.SLACK_WEBHOOK_URL) {
        await sendSlackDigest(process.env.SLACK_WEBHOOK_URL, metricsData);
        console.log('✔ Daily Slack digest dispatched.');
      }

      // Dispatch to Discord Webhook if configured
      if (process.env.DISCORD_WEBHOOK_URL) {
        await sendDiscordDigest(process.env.DISCORD_WEBHOOK_URL, metricsData);
        console.log('✔ Daily Discord digest dispatched.');
      }
    } catch (err) {
      console.error('✖ Error executing DailyPulse morning cron job:', err);
    }
  });
}
