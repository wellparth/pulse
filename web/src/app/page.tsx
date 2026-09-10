import React from 'react';
import { Activity, Terminal, Zap, ShieldAlert, BarChart3, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-xl tracking-tight text-white">
            <Zap className="h-6 w-6 text-amber-400 fill-amber-400" />
            <span>Daily<span className="text-amber-400">Pulse</span></span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-slate-200 transition">Features</a>
            <a href="#cli" className="text-sm text-slate-400 hover:text-slate-200 transition">CLI Tool</a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-slate-200 transition">Pricing</a>
            <a href="/dashboard" className="text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-lg transition">
              Launch Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full text-xs font-semibold mb-6">
          <Activity className="h-3.5 w-3.5" />
          <span>Micro-Metrics Intelligence for Indie Hackers</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Stop checking 5 dashboards every morning.
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
          DailyPulse unifies Stripe revenue, PostHog signups, Sentry errors, and GitHub activity into a single daily digest delivered to your Terminal, Slack, or Email.
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <a href="/dashboard" className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-xl font-bold transition">
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#cli" className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-6 py-3 rounded-xl font-semibold text-slate-300 transition">
            <Terminal className="h-4 w-4 text-amber-400" />
            <span>Install CLI</span>
          </a>
        </div>
      </section>

      {/* Terminal Preview Section */}
      <section id="cli" className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-slate-500 ml-2">bash — pulse summary</span>
          </div>
          <div className="mt-4 space-y-2 text-slate-300">
            <p className="text-amber-400 font-bold">$ npx @dailypulse/cli summary</p>
            <p className="text-slate-500">--------------------------------------------</p>
            <p><span className="text-emerald-400">● Stripe MRR:</span>        $1,240.00 (+12% vs. last week)</p>
            <p><span className="text-sky-400">● PostHog Signups:</span>   48 new users today</p>
            <p><span className="text-rose-400">● Sentry Errors:</span>     0 active exceptions</p>
            <p><span className="text-purple-400">● GitHub Stars:</span>      +14 new stars (342 total)</p>
            <p className="text-slate-500">--------------------------------------------</p>
            <p className="text-emerald-400 font-semibold">✔ Status: All systems healthy. 0 anomalies detected.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Built for Developers & Indie Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <BarChart3 className="h-8 w-8 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Unified Dashboard</h3>
            <p className="text-slate-400 text-sm">Connect Stripe, PostHog, Vercel, Sentry, and GitHub in seconds with encrypted API token storage.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <Terminal className="h-8 w-8 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Terminal-First CLI</h3>
            <p className="text-slate-400 text-sm">Run <code className="text-amber-400">pulse summary</code> or <code className="text-amber-400">pulse health</code> directly from your terminal tab.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <ShieldAlert className="h-8 w-8 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Instant Anomaly Alerts</h3>
            <p className="text-slate-400 text-sm">Get notified immediately on Slack or Discord if signups drop to 0 or API error rates spike unexpectedly.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Simple, Transparent Pricing</h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">Start free and upgrade as your portfolio of SaaS projects grows.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-extrabold text-white mb-4">$0 <span className="text-sm font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> 1 SaaS Project</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> 2 Integrations</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> CLI Access (`pulse summary`)</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Weekly Email Digest</li>
              </ul>
            </div>
            <a href="/dashboard" className="mt-8 block text-center bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-semibold text-sm transition">Get Started</a>
          </div>

          {/* Pro */}
          <div className="bg-slate-900 border-2 border-amber-400/80 rounded-2xl p-8 flex flex-col justify-between shadow-xl relative">
            <span className="absolute -top-3 right-6 bg-amber-400 text-slate-950 text-xs font-bold px-3 py-0.5 rounded-full">POPULAR</span>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-extrabold text-white mb-4">$14 <span className="text-sm font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Up to 3 SaaS Projects</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> All Integrations</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Daily Digest (Slack & Email)</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Anomaly Detection Alerts</li>
              </ul>
            </div>
            <a href="/dashboard" className="mt-8 block text-center bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 rounded-xl font-bold text-sm transition">Start 14-Day Trial</a>
          </div>

          {/* Team */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Team</h3>
              <div className="text-4xl font-extrabold text-white mb-4">$29 <span className="text-sm font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Unlimited SaaS Projects</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> All Integrations</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Slack & Discord Team Bots</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2" /> Real-time Anomaly Alerting</li>
              </ul>
            </div>
            <a href="/dashboard" className="mt-8 block text-center bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-semibold text-sm transition">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} DailyPulse Inc. Built for indie hackers and developers.
      </footer>
    </div>
  );
}
