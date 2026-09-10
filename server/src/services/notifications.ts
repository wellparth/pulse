export interface NotificationMetrics {
  mrrFormatted: string;
  signupsToday: number;
  errorsCount: number;
  githubStars: number;
  anomalies: Array<{ type: string; message: string }>;
}

export async function sendSlackDigest(webhookUrl: string, metrics: NotificationMetrics): Promise<boolean> {
  const payload = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '⚡ DailyPulse — Morning Metrics Digest',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Stripe MRR:*\n\`${metrics.mrrFormatted}\`` },
          { type: 'mrkdwn', text: `*PostHog Signups:*\n\`${metrics.signupsToday} new users\`` },
          { type: 'mrkdwn', text: `*Sentry Errors:*\n\`${metrics.errorsCount} critical\`` },
          { type: 'mrkdwn', text: `*GitHub Stars:*\n\`${metrics.githubStars} total\`` },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: metrics.anomalies.length > 0 
              ? `⚠️ *Anomalies Detected:* ${metrics.anomalies.map(a => a.message).join(', ')}`
              : '✅ *All systems operating normally.*',
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (error) {
    console.error('Slack webhook error:', error);
    return false;
  }
}

export async function sendDiscordDigest(webhookUrl: string, metrics: NotificationMetrics): Promise<boolean> {
  const payload = {
    username: 'DailyPulse Bot',
    avatar_url: 'https://raw.githubusercontent.com/wellparth/pulse/main/web/public/file.svg',
    embeds: [
      {
        title: '⚡ DailyPulse — Morning Metrics Digest',
        color: metrics.anomalies.length > 0 ? 15158332 : 3066993, // Red if anomalies, Green if healthy
        fields: [
          { name: '💰 Stripe MRR', value: metrics.mrrFormatted, inline: true },
          { name: '📈 PostHog Signups', value: `${metrics.signupsToday} new today`, inline: true },
          { name: '🛡️ Sentry Errors', value: `${metrics.errorsCount} critical`, inline: true },
          { name: '⭐ GitHub Stars', value: `${metrics.githubStars} stars`, inline: true },
        ],
        footer: {
          text: metrics.anomalies.length > 0 
            ? `⚠️ ${metrics.anomalies.length} active anomaly alert(s)`
            : '✔ All systems healthy',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (error) {
    console.error('Discord webhook error:', error);
    return false;
  }
}
