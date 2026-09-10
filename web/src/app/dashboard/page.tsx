'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, DollarSign, Users, ShieldAlert, Star, 
  CheckCircle2, RefreshCw, Plus, Terminal, ExternalLink
} from 'lucide-react';

export default function Dashboard() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected')) {
      const provider = params.get('connected');
      setNotification(`🎉 Successfully connected ${provider?.toUpperCase()} via OAuth 2.0!`);
    }
  }, []);

  const metrics = [
    { label: 'Stripe MRR', value: '$1,240.00', change: '+12.5%', isPositive: true, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Daily Signups', value: '48 users', change: '+8 today', isPositive: true, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Sentry Errors', value: '0 critical', change: 'All healthy', isPositive: true, icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'GitHub Stars', value: '342 stars', change: '+14 this week', isPositive: true, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const integrations = [
    { name: 'Stripe Billing', status: 'Connected', provider: 'stripe', oauthUrl: 'http://localhost:4000/api/v1/auth/stripe' },
    { name: 'GitHub Repositories', status: 'Connected', provider: 'github', oauthUrl: 'http://localhost:4000/api/v1/auth/github' },
    { name: 'PostHog Analytics', status: 'Connected', provider: 'posthog', oauthUrl: '#' },
    { name: 'Sentry Exception Tracker', status: 'Connected', provider: 'sentry', oauthUrl: '#' },
  ];

  const triggerManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-2 font-bold text-lg text-white">
            <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
            <span>Daily<span className="text-amber-400">Pulse</span></span>
          </a>
          <span className="text-xs text-slate-600">/</span>
          <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">Project: Pulse SaaS</span>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={triggerManualSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <a href="/" className="text-xs text-slate-400 hover:text-slate-200 transition">Exit Dashboard</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        
        {notification && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold flex justify-between items-center">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* Welcome & Status Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Metrics Digest Overview</h1>
            <p className="text-sm text-slate-400 mt-1">Real-time status snapshot for today across all connected integrations.</p>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>All 4 Systems Operating Normally</span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{item.label}</span>
                  <div className={`p-2 rounded-xl ${item.bg}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{item.value}</div>
                  <div className="text-xs font-semibold text-emerald-400 mt-1">{item.change}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLI Command Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Terminal className="h-6 w-6 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">CLI Summary Command</h3>
              <p className="text-xs text-slate-400">Run this anytime in your terminal for an instant status report.</p>
            </div>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs text-amber-400">
            $ npx @dailypulse/cli summary
          </div>
        </div>

        {/* Active Integrations & OAuth Connectors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">OAuth Integrations & Account Linking</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-slate-500">1-Click OAuth 2.0 Connection</div>
                  </div>
                </div>
                
                {item.oauthUrl !== '#' ? (
                  <a 
                    href={item.oauthUrl}
                    className="flex items-center space-x-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg transition"
                  >
                    <span>Connect OAuth</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    Connected
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
