import React from 'react';
import { Building2, ShieldCheck, FileCheck, CalendarClock, BarChart3, BookOpen, Sparkles } from 'lucide-react';
import { StartupProfile } from '../types';
import { SAMPLE_STARTUPS } from '../data/sampleStartups';

export type ActiveTab = 'founder' | 'officer' | 'inspection' | 'analytics' | 'library';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentStartup: StartupProfile;
  setCurrentStartup: (startup: StartupProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentStartup,
  setCurrentStartup,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Notification / Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-white">Smart India Hackathon 2026 Prototype</span>
          <span className="text-slate-500">·</span>
          <span>Single-Window Regulatory Compliance &amp; Parallel Scrutiny System</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Active Jurisdiction: <strong className="text-slate-200">{currentStartup.state}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker &amp; DPDP 2023 Compliant
          </span>
        </div>
      </div>

      {/* Main 3-Zone Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <button
                onClick={() => setActiveTab('founder')}
                className="text-xl font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
              >
                <span>OneGov</span>
                <span className="text-indigo-600">AI</span>
              </button>
              <p className="text-[11px] text-slate-500 -mt-0.5 font-medium hidden sm:block">
                Intelligent Approval &amp; Compliance Management
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('founder')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'founder'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Founder Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('officer')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'officer'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Department Scrutiny</span>
            </button>

            <button
              onClick={() => setActiveTab('inspection')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'inspection'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              <span>Joint Inspection</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>SLA &amp; Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'library'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Document Guide</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Startup Preset Switcher */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <label htmlFor="startup-select" className="sr-only">Switch Startup</label>
              <select
                id="startup-select"
                value={currentStartup.id}
                onChange={(e) => {
                  const found = SAMPLE_STARTUPS.find((s) => s.id === e.target.value);
                  if (found) setCurrentStartup(found);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-medium py-1.5 px-2.5 pr-7 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                {SAMPLE_STARTUPS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.businessName.length > 20 ? `${s.businessName.substring(0, 18)}…` : s.businessName} · {s.sector === 'software_it' ? 'IT / SaaS' : s.sector === 'fintech' ? 'FinTech' : s.sector.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveTab('founder')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap hidden sm:flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Rule Engine</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1.5 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('founder')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'founder' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Founder Portal
          </button>
          <button
            onClick={() => setActiveTab('officer')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'officer' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Department Scrutiny
          </button>
          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'inspection' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Joint Inspection
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            SLA &amp; Analytics
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'library' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Document Guide
          </button>
        </div>
      </div>
    </header>
  );
};
