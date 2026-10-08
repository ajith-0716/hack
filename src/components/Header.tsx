import React from 'react';
import {
  Building2,
  ShieldCheck,
  FileCheck,
  CalendarClock,
  BarChart3,
  BookOpen,
  Sparkles,
  Layers,
  AlertTriangle,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { StartupProfile, UserProfile } from '../types';
import { SAMPLE_STARTUPS } from '../data/sampleStartups';

export type ActiveTab = 'flow' | 'founder' | 'officer' | 'inspection' | 'analytics' | 'library' | 'anomalies';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentStartup: StartupProfile;
  setCurrentStartup: (startup: StartupProfile) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  activeAnomaliesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentStartup,
  setCurrentStartup,
  currentUser,
  setCurrentUser,
  activeAnomaliesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Tricolor Subtle Government Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Top Notification / Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">National Single Window System (NSWS)</span>
          <span className="text-slate-500">·</span>
          <span>Government of India Regulatory Compliance Engine</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>
            Jurisdiction: <strong className="text-slate-200">{currentStartup.state}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              activeAnomaliesCount > 0
                ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>
              {activeAnomaliesCount > 0
                ? `${activeAnomaliesCount} Anomaly Active`
                : 'Resilience: All Nominal'}
            </span>
          </button>
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
                onClick={() => setActiveTab('flow')}
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
              onClick={() => setActiveTab('flow')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'flow'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 font-semibold'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>9-Step Approval Flow</span>
            </button>

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
              onClick={() => setActiveTab('anomalies')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'anomalies'
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Error Simulator</span>
            </button>
          </nav>

          {/* Zone 3: Actions, Startup Selector & User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:block">
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

            {/* User Session Pill */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 pr-2 border border-slate-200">
                <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize leading-tight">
                    {currentUser.role}
                  </div>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  title="Sign Out"
                  className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('flow')}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1.5 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'flow' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            9-Step Flow
          </button>
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
            onClick={() => setActiveTab('anomalies')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'anomalies' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Error Lab (5 Scenarios)
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};

