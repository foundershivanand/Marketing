import React, { useState } from 'react';
import { Settings as SettingsIcon, Cloud, Cpu, Database, Shield, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';

export const Settings: React.FC = () => {
  const [provider, setProvider] = useState('mock');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [seeding, setSeeding] = useState(false);

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      // 1. Import Destinations from GitHub
      await api.importGitHub();

      // 2. Create Sample Product
      const prod = await api.createProduct({
        name: 'Supastack AI',
        website_url: 'https://supastack.example.com',
        tagline: 'Autonomous Database Infrastructure for Modern AI Applications',
        short_description: 'Supastack AI combines serverless vector databases with automated scaling and edge caching for agentic workflows.',
        full_description: 'Supastack AI is built for founders and engineers developing autonomous agents. It provides sub-millisecond vector search, durable queue persistence, and automated index replication across edge regions.',
        category: 'Developer Tools',
        target_audience: 'Engineers, AI Researchers, SaaS Builders',
        pricing_model: 'Free tier up to 10k vectors, then $25/month',
        founder_name: 'Alex Rivera',
        founder_email: 'alex@supastack.example.com',
        founder_bio: 'Former distributed systems engineer, building developer tools.',
        facts: [
          'Compatible with OpenAI, Anthropic and Gemini embedding formats',
          'Sub-millisecond query latency across 40+ global edge locations',
          'Open-source CLI and client SDKs available on GitHub',
        ],
        prohibited_claims: [
          'Do not claim SOC2 Type II certification (in progress)',
          'Do not state we have raised Series A funding',
          'Do not claim over 10,000 paying enterprise customers',
        ],
      });

      // 3. Create Sample Campaign
      const camp = await api.createCampaign({
        product_id: prod.id,
        name: 'Fall Launch Wave',
        settings: {
          categories: ['startup_directory', 'launch_platform'],
          include_paid: false,
          include_reddit: false,
          automation: 'maximum',
          tracking: true,
        },
      });

      // 4. Start Campaign
      await api.startCampaign(camp.id);

      alert('Complete demo ecosystem seeded successfully! Check Dashboard, Products, and Submissions.');
    } catch (err: any) {
      alert(`Seeding failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-600" />
          <span>LaunchPilot System Configuration</span>
        </h2>
        <p className="text-xs text-slate-500">
          Cloud-only infrastructure bindings, AI provider integration, and security guardrails.
        </p>
      </div>

      <div className="space-y-6 text-xs">
        {/* Cloudflare Infrastructure Bindings */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-600" />
            <span>Cloudflare Infrastructure Bindings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Cloudflare D1 Database', binding: 'env.DB', desc: 'SQLite relational storage (products, destinations, campaigns, submissions)' },
              { name: 'Cloudflare R2 Bucket', binding: 'env.ASSETS', desc: 'Encrypted browser session state, assets, and execution screenshots' },
              { name: 'Cloudflare Queues', binding: 'env.SUBMISSIONS', desc: 'launchpilot-submissions queue with dead-letter queue routing' },
              { name: 'Cloudflare Workflows', binding: 'env.CAMPAIGN_WORKFLOW', desc: 'Durable multi-step workflow execution engine' },
              { name: 'Cloudflare Browser Run', binding: 'env.BROWSER', desc: 'Remote Playwright browser execution without local Chrome' },
              { name: 'Cloudflare Access', binding: 'cf-access-authenticated-user-email', desc: 'Zero Trust authentication and private dashboard access' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span>{item.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500">{item.binding}</div>
                <div className="text-[11px] text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Provider Configuration */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>AI Provider Selection</span>
          </h3>
          <p className="text-slate-500">
            Switch AI intelligence models without modifying agents or workflows via provider abstraction.
          </p>

          <div className="space-y-3">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="provider"
                  value="mock"
                  checked={provider === 'mock'}
                  onChange={() => setProvider('mock')}
                  className="text-emerald-600"
                />
                <span>Mock Heuristic Provider (Instant local testing, zero API keys required)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="provider"
                  value="gemini"
                  checked={provider === 'gemini'}
                  onChange={() => setProvider('gemini')}
                  className="text-emerald-600"
                />
                <span>Google Gemini</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="provider"
                  value="openai"
                  checked={provider === 'openai'}
                  onChange={() => setProvider('openai')}
                  className="text-emerald-600"
                />
                <span>OpenAI</span>
              </label>
            </div>

            {provider === 'gemini' && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">GEMINI_API_KEY</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            )}

            {provider === 'openai' && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">OPENAI_API_KEY</label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Demo Data Seeder */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Demo Data & Sandbox Seeder</span>
          </h3>
          <p className="text-slate-500">
            One-click populate the database with the PlacesToPostYourStartup catalogue (100+ platforms), sample product profile, and initial campaign targets.
          </p>

          <button
            onClick={handleSeedDemo}
            disabled={seeding}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding Database...' : 'Seed Full Demo Ecosystem'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
