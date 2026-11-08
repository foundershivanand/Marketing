import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Destinations } from './pages/Destinations';
import { Campaigns } from './pages/Campaigns';
import { Submissions } from './pages/Submissions';
import { Analytics } from './pages/Analytics';
import { Agents } from './pages/Agents';
import { Settings } from './pages/Settings';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { api } from './lib/api';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [destinationStats, setDestinationStats] = useState({ total: 0, verified: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await api.getDestinationStats();
        setDestinationStats(stats);
      } catch (e) {
        console.error('Failed to load destination stats:', e);
      }
    };
    fetchStats();
  }, [currentTab]);

  const pageHeaders: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Mission Control',
      subtitle: 'Multi-Product AI Startup Distribution Platform Overview',
    },
    products: {
      title: 'Startup Products',
      subtitle: 'Manage verified startup profiles, facts, and negative constraints',
    },
    destinations: {
      title: 'Startup Submission Directories',
      subtitle: 'Classified directories from PlacesToPostYourStartup with verification status',
    },
    campaigns: {
      title: 'Distribution Campaigns',
      subtitle: 'Configure automated submission runs with adapter selection and policy gates',
    },
    submissions: {
      title: 'Submission Audit Queue',
      subtitle: 'Inspect automated attempts, live evidence screenshots, and review tasks',
    },
    analytics: {
      title: 'Referral & Conversion Analytics',
      subtitle: 'Measure which directories generate genuine signups via UTM tracking links',
    },
    agents: {
      title: 'Agent Intelligence Network',
      subtitle: 'Inspect the six specialized agents, system prompts, and strict guardrails',
    },
    settings: {
      title: 'System Settings',
      subtitle: 'Cloudflare infrastructure bindings, AI provider options, and seed tools',
    },
  };

  const headerInfo = pageHeaders[currentTab] || {
    title: 'LaunchPilot',
    subtitle: 'AI Startup Distribution Engine',
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        destinationStats={destinationStats}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
        />

        <main className="flex-1">
          <ErrorBoundary>
            {currentTab === 'dashboard' && <Dashboard onNavigate={setCurrentTab} />}
            {currentTab === 'products' && <Products />}
            {currentTab === 'destinations' && <Destinations />}
            {currentTab === 'campaigns' && <Campaigns />}
            {currentTab === 'submissions' && <Submissions />}
            {currentTab === 'analytics' && <Analytics />}
            {currentTab === 'agents' && <Agents />}
            {currentTab === 'settings' && <Settings />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default App;
