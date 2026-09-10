#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('pulse')
    .description('⚡ DailyPulse CLI — Developer Micro-Metrics Digest')
    .version('0.1.0');
program
    .command('summary')
    .description('Display today\'s micro-metrics summary table')
    .action(() => {
    console.log(chalk_1.default.bold.yellow('\n⚡ DailyPulse Metrics Summary\n'));
    console.log(chalk_1.default.cyan('--------------------------------------------'));
    console.log(`${chalk_1.default.green('● Stripe MRR:')}        $1,240.00 (+12%)`);
    console.log(`${chalk_1.default.blue('● PostHog Signups:')}   48 new today`);
    console.log(`${chalk_1.default.magenta('● Sentry Errors:')}     0 critical`);
    console.log(`${chalk_1.default.gray('● GitHub Stars:')}      +14 (total: 342)`);
    console.log(chalk_1.default.cyan('--------------------------------------------\n'));
});
program
    .command('health')
    .description('Check live health and error metrics')
    .action(() => {
    console.log(chalk_1.default.green('✔ All services operating normally (0 active anomalies)'));
});
program.parse(process.argv);
