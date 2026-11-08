import React from 'react';
import { ShieldCheck, Cpu, Database } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actionButton }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-xs">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI: Multimodal</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Cloudflare D1</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SSRF & Policy Guard</span>
          </span>
        </div>

        {actionButton}
      </div>
    </header>
  );
};
