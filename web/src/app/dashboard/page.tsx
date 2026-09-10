'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, DollarSign, Users, ShieldAlert, Star, 
  CheckCircle2, RefreshCw, Plus, Terminal, ExternalLink, X, Key, Lock, Layers
} from 'lucide-react';

export default function Dashboard() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<{ name: string; provider: string; oauthUrl?: string } | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [submittingKey, setSubmittingKey] = useState(false);

  const [connectedApps, setConnectedApps] = useState<Record<string, boolean>>({
    stripe: true,
    github: true,
    posthog: false,
    sentry: false,
    vercel: true,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected')) {
      const provider = params.get('connected');
      setNotification(`🎉 Successfully connected ${provider?.toUpperCase()} via OAuth 2.0!`);
      if (provider) {
        setConnectedApps(prev => ({ ...prev, [provider]: true }));
      }
    }
  }, []);

  const metrics = [
    { label: 'Stripe MRR', value: '$1,240.00', change: '+12.5%', isPositive: true, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Daily Signups', value: '48 users', change: '+8 today', isPositive: true, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Sentry Errors', value: '0 critical', change: 'All healthy', isPositive: true, icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'GitHub Stars', value: '342 stars', change: '+14 this week', isPositive: true, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const integrations = [
    { name: 'Stripe Billing', provider: 'stripe', desc: 'MRR, ARR, Subscriptions & Net Revenue', oauthUrl: 'http://localhost:4000/api/v1/auth/stripe' },
    { name: 'GitHub Repositories', provider: 'github', desc: 'Stars, Open Issues, PRs & Activity', oauthUrl: 'http://localhost:4000/api/v1/auth/github' },
    { name: 'Vercel Deployments', provider: 'vercel', desc: 'Deployment Status, Function Invocations & Bandwidth' },
    { name: 'PostHog Analytics', provider: 'posthog', desc: 'Daily Signups, DAU & Pageviews' },
    { name: 'Sentry Error Tracking', provider: 'sentry', desc: 'Critical Exceptions & 5xx Spikes' },
  ];

  const triggerManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  const handleConnectApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !apiKeyInput) return;

    setSubmittingKey(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedApp.provider,
          apiKey: apiKeyInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConnectedApps(prev => ({ ...prev, [selectedApp.provider]: true }));
        setNotification(`✔ Successfully connected ${selectedApp.name}!`);
        setSelectedApp(null);
        setApiKeyInput('');
      }
    } catch (err) {
      alert('Failed to connect integration key.');
    } finally {
      setSubmittingKey(false);
    }
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

          <a href="/login" className="text-xs text-slate-400 hover:text-slate-200 transition">Log Out</a>
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
            <p className="text-sm text-slate-400 mt-1">Real-time status snapshot for today across all 5 core integrations.</p>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>5 Core Integrations Active & Healthy</span>
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
            <div>
              <h2 className="text-lg font-bold text-white">Core Apps & Integrations Suite (5 Total)</h2>
              <p className="text-xs text-slate-400">Stripe, GitHub, Vercel, PostHog, and Sentry.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item, idx) => {
              const isConnected = connectedApps[item.provider];

              return (
                <div key={idx} className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  
                  {isConnected ? (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Connected</span>
                    </span>
                  ) : (
                    <button 
                      onClick={() => setSelectedApp(item)}
                      className="flex items-center space-x-1 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Connect App</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Connect Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Connect {selectedApp.name}</h3>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Option 1: OAuth if available */}
            {selectedApp.oauthUrl && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Method 1: Fast 1-Click OAuth 2.0</label>
                <a 
                  href={selectedApp.oauthUrl}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 rounded-xl font-bold text-sm transition"
                >
                  <span>Authorize with {selectedApp.name}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {selectedApp.oauthUrl && (
              <div className="flex items-center space-x-2 my-2">
                <div className="flex-1 h-px bg-slate-800"></div>
                <span className="text-xs text-slate-500 font-medium">OR USE API KEY</span>
                <div className="flex-1 h-px bg-slate-800"></div>
              </div>
            )}

            {/* Option 2: API Key Input */}
            <form onSubmit={handleConnectApiKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Method 2: Paste API Secret Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input 
                    type="password"
                    required
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={`Enter ${selectedApp.provider} API key or token`}
                    className="w-full bg-slate-950 border border-slate-800 text-sm text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center">
                  <Lock className="h-3 w-3 mr-1 text-emerald-400" /> Keys are encrypted before saving.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submittingKey}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition"
                >
                  {submittingKey ? 'Connecting...' : 'Save & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
