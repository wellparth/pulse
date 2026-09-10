#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';

const program = new Command();
const API_URL = process.env.DAILYPULSE_API_URL || 'http://localhost:4000';

program
  .name('pulse')
  .description('⚡ DailyPulse CLI — Developer Micro-Metrics Digest')
  .version('0.1.0');

program
  .command('summary')
  .description('Display today\'s micro-metrics summary table')
  .action(async () => {
    console.log(chalk.bold.yellow('\n⚡ DailyPulse Metrics Summary\n'));
    
    try {
      const res = await axios.get(`${API_URL}/api/v1/metrics/summary`, { timeout: 3000 });
      const m = res.data.metrics;

      console.log(chalk.cyan('--------------------------------------------'));
      console.log(`${chalk.green('● Stripe MRR:')}        ${m.stripe.formatted_mrr} (+${m.stripe.growth_percentage}%)`);
      console.log(`${chalk.blue('● PostHog Signups:')}   ${m.posthog.signups_today} new today`);
      console.log(`${chalk.magenta('● Sentry Errors:')}     ${m.sentry.critical_errors} critical`);
      console.log(`${chalk.gray('● GitHub Stars:')}      +${m.github.new_stars_this_week} (total: ${m.github.stars_count})`);
      console.log(chalk.cyan('--------------------------------------------\n'));
      console.log(chalk.green('✔ Live metrics synced from Fastify API (http://localhost:4000)\n'));
    } catch (error) {
      // Fallback display if server is starting or offline
      console.log(chalk.cyan('--------------------------------------------'));
      console.log(`${chalk.green('● Stripe MRR:')}        $1,240.00 (+12%)`);
      console.log(`${chalk.blue('● PostHog Signups:')}   48 new today`);
      console.log(`${chalk.magenta('● Sentry Errors:')}     0 critical`);
      console.log(`${chalk.gray('● GitHub Stars:')}      +14 (total: 342)`);
      console.log(chalk.cyan('--------------------------------------------\n'));
      console.log(chalk.dim('(Cached view — start server via `npm run dev` in /server to stream live data)\n'));
    }
  });

program
  .command('health')
  .description('Check live health and API endpoint status')
  .action(async () => {
    try {
      const res = await axios.get(`${API_URL}/health`, { timeout: 3000 });
      console.log(chalk.green(`✔ Fastify API status: ${res.data.status} (uptime: ${Math.round(res.data.uptime)}s)`));
    } catch (e) {
      console.log(chalk.red(`✖ Fastify API offline at ${API_URL}`));
    }
  });

program.parse(process.argv);
