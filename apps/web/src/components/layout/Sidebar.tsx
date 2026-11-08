import React from 'react';
import {
  Rocket,
  LayoutDashboard,
  Package,
  Globe,
  Megaphone,
  Send,
  ChartNoAxesCombined,
  Bot,
  Settings,
  Cloud,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  destinationStats?: { total: number; verified: number };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, destinationStats }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'destinations', label: 'Directories', icon: Globe, badge: destinationStats?.total ? `${destinationStats.total}` : undefined },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'submissions', label: 'Submissions', icon: Send },
    { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined },
    { id: 'agents', label: 'Agents', icon: Bot, badge: '6 active' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              LaunchPilot
            </h1>
            <p className="text-xs text-slate-400 font-mono">v1.0 • Multi-Product</p>
          </div>
        </div>
      </div>

      {/* Cloud Status Pill */}
      <div className="px-5 py-3 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Cloud-Only System
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <Cloud className="w-3.5 h-3.5" />
          Workers D1 R2
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Safeguard Footnote */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
        <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Zero-Spam Safeguards
        </p>
        <p className="text-[11px] leading-relaxed">
          Deterministic policy gates protect domain reputation. Human review enforced for Reddit, CAPTCHAs, and paid listings.
        </p>
      </div>
    </aside>
  );
};
