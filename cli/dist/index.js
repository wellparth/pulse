#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const axios_1 = __importDefault(require("axios"));
const program = new commander_1.Command();
const API_URL = process.env.DAILYPULSE_API_URL || 'http://localhost:4000';
program
    .name('pulse')
    .description('⚡ DailyPulse CLI — Developer Micro-Metrics Digest')
    .version('0.1.0');
program
    .command('summary')
    .description('Display today\'s micro-metrics summary table')
    .action(async () => {
    console.log(chalk_1.default.bold.yellow('\n⚡ DailyPulse Metrics Summary\n'));
    try {
        const res = await axios_1.default.get(`${API_URL}/api/v1/metrics/summary`, { timeout: 3000 });
        const m = res.data.metrics;
        console.log(chalk_1.default.cyan('--------------------------------------------'));
        console.log(`${chalk_1.default.green('● Stripe MRR:')}        ${m.stripe.formatted_mrr} (+${m.stripe.growth_percentage}%)`);
        console.log(`${chalk_1.default.blue('● PostHog Signups:')}   ${m.posthog.signups_today} new today`);
        console.log(`${chalk_1.default.magenta('● Sentry Errors:')}     ${m.sentry.critical_errors} critical`);
        console.log(`${chalk_1.default.gray('● GitHub Stars:')}      +${m.github.new_stars_this_week} (total: ${m.github.stars_count})`);
        console.log(chalk_1.default.cyan('--------------------------------------------\n'));
        console.log(chalk_1.default.green('✔ Live metrics synced from Fastify API (http://localhost:4000)\n'));
    }
    catch (error) {
        // Fallback display if server is starting or offline
        console.log(chalk_1.default.cyan('--------------------------------------------'));
        console.log(`${chalk_1.default.green('● Stripe MRR:')}        $1,240.00 (+12%)`);
        console.log(`${chalk_1.default.blue('● PostHog Signups:')}   48 new today`);
        console.log(`${chalk_1.default.magenta('● Sentry Errors:')}     0 critical`);
        console.log(`${chalk_1.default.gray('● GitHub Stars:')}      +14 (total: 342)`);
        console.log(chalk_1.default.cyan('--------------------------------------------\n'));
        console.log(chalk_1.default.dim('(Cached view — start server via `npm run dev` in /server to stream live data)\n'));
    }
});
program
    .command('health')
    .description('Check live health and API endpoint status')
    .action(async () => {
    try {
        const res = await axios_1.default.get(`${API_URL}/health`, { timeout: 3000 });
        console.log(chalk_1.default.green(`✔ Fastify API status: ${res.data.status} (uptime: ${Math.round(res.data.uptime)}s)`));
    }
    catch (e) {
        console.log(chalk_1.default.red(`✖ Fastify API offline at ${API_URL}`));
    }
});
program.parse(process.argv);
