import React, { useEffect, useState } from 'react';
import { Plus, Globe, AlertTriangle, ShieldCheck, Tag, ExternalLink, X } from 'lucide-react';
import { api } from '../lib/api';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [category, setCategory] = useState('Developer Tools');
  const [targetAudience, setTargetAudience] = useState('Founders, Developers, Growth Marketers');
  const [pricingModel, setPricingModel] = useState('Freemium / Free tier available');
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [founderBio, setFounderBio] = useState('');

  // Prohibited Claims & Verified Facts
  const [factsInput, setFactsInput] = useState('');
  const [factsList, setFactsList] = useState<string[]>([]);
  const [prohibitedInput, setProhibitedInput] = useState('');
  const [prohibitedList, setProhibitedList] = useState<string[]>([]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddFact = () => {
    if (factsInput.trim()) {
      setFactsList([...factsList, factsInput.trim()]);
      setFactsInput('');
    }
  };

  const handleRemoveFact = (index: number) => {
    setFactsList(factsList.filter((_, i) => i !== index));
  };

  const handleAddProhibited = () => {
    if (prohibitedInput.trim()) {
      setProhibitedList([...prohibitedList, prohibitedInput.trim()]);
      setProhibitedInput('');
    }
  };

  const handleRemoveProhibited = (index: number) => {
    setProhibitedList(prohibitedList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProduct({
        name,
        website_url: websiteUrl,
        tagline,
        short_description: shortDesc,
        full_description: fullDesc,
        category,
        target_audience: targetAudience,
        pricing_model: pricingModel,
        founder_name: founderName,
        founder_email: founderEmail,
        founder_bio: founderBio,
        facts: factsList,
        prohibited_claims: prohibitedList,
      });

      setIsModalOpen(false);
      resetForm();
      loadProducts();
    } catch (err: any) {
      alert(`Failed to save product: ${err.message}`);
    }
  };

  const resetForm = () => {
    setName('');
    setWebsiteUrl('');
    setTagline('');
    setShortDesc('');
    setFullDesc('');
    setCategory('Developer Tools');
    setTargetAudience('Founders, Developers, Growth Marketers');
    setPricingModel('Freemium / Free tier available');
    setFounderName('');
    setFounderEmail('');
    setFounderBio('');
    setFactsList([]);
    setProhibitedList([]);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Startup Product Profiles</h2>
          <p className="text-sm text-slate-500">
            Define your product facts once. Reusable across multiple distribution campaigns with zero hallucination.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No startup profiles yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Add your startup details, verified facts, and strict negative constraints so our AI agents generate 100% accurate directory listings.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm inline-flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Startup Profile</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((p) => {
            const prohibited: string[] = JSON.parse(p.prohibited_claims_json || '[]');
            const facts: string[] = JSON.parse(p.facts_json || '[]');

            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                    <a
                      href={p.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-mono"
                    >
                      {p.website_url} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {p.category || 'General'}
                  </span>
                </div>

                {p.tagline && (
                  <p className="text-sm font-medium text-slate-800 italic">
                    "{p.tagline}"
                  </p>
                )}

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {p.short_description || p.full_description || 'No description provided.'}
                </p>

                {/* Facts badge list */}
                {facts.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Facts ({facts.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {facts.map((fact, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {fact}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Things AI must never claim badge list */}
                {prohibited.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Things AI Must Never Claim ({prohibited.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {prohibited.map((claim, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200/60 font-medium">
                          {claim}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Founder: {p.founder_name || 'Anonymous'}</span>
                  <span>Pricing: {p.pricing_model || 'Standard'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create Startup Master Profile</h3>
                <p className="text-xs text-slate-500">Used as the source of truth for all 6 distribution agents.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Product Name *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Supabase, LaunchPilot"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Website URL *</label>
                  <input
                    required
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tagline (under 60 chars)</label>
                <input
                  maxLength={60}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. The Open Source Firebase Alternative"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Short Description (for directories)</label>
                <textarea
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Concise 1-2 sentence pitch..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Description & Key Features</label>
                <textarea
                  rows={4}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Detailed explanation of the problem, solution, and core features..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="SaaS, Developer Tools, AI"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Audience</label>
                  <input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Founders, Creators, SMBs"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pricing Model</label>
                  <input
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value)}
                    placeholder="Free, Freemium, $29/mo"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Founder Name</label>
                  <input
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Founder Email</label>
                  <input
                    type="email"
                    value={founderEmail}
                    onChange={(e) => setFounderEmail(e.target.value)}
                    placeholder="founder@example.com"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Founder Bio</label>
                  <input
                    value={founderBio}
                    onChange={(e) => setFounderBio(e.target.value)}
                    placeholder="Ex-engineer at Stripe, indie hacker"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* Verified Claims */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <label className="block font-semibold text-emerald-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Product Facts
                </label>
                <div className="flex gap-2">
                  <input
                    value={factsInput}
                    onChange={(e) => setFactsInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFact())}
                    placeholder="e.g. Open-source under MIT license, Over 2,000 GitHub stars..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-emerald-300 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFact}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
                  >
                    Add Fact
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {factsList.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {f}
                      <button type="button" onClick={() => handleRemoveFact(i)}>
                        <X className="w-3 h-3 hover:text-emerald-950" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* THINGS AI MUST NEVER CLAIM (Core blueprint requirement) */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                <label className="block font-semibold text-rose-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Things AI Must Never Claim (Negative Constraints)
                </label>
                <p className="text-[11px] text-rose-700 leading-tight">
                  For example: "Never claim we have paying customers", "Never state we have SOC2 compliance", "Never mention revenue".
                </p>
                <div className="flex gap-2">
                  <input
                    value={prohibitedInput}
                    onChange={(e) => setProhibitedInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProhibited())}
                    placeholder="e.g. Do not claim we have raised venture capital..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-rose-300 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddProhibited}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700"
                  >
                    Add Prohibition
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {prohibitedList.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-medium">
                      {c}
                      <button type="button" onClick={() => handleRemoveProhibited(i)}>
                        <X className="w-3 h-3 hover:text-rose-950" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm"
                >
                  Save Product Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
