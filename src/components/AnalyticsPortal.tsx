import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sliders,
  Database,
  Building,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AnalyticsPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bottlenecks' | 'rules'>('bottlenecks');

  // Interactive rule simulator states
  const [fireAreaThreshold, setFireAreaThreshold] = useState(2500);
  const [workforceFactoryActThreshold, setWorkforceFactoryActThreshold] = useState(10);
  const [pcbSlaDays, setPcbSlaDays] = useState(30);

  const deptMetrics = [
    {
      dept: 'District Industries Centre (DIC)',
      approval: 'Udyam & MSME Incentives',
      avgDays: 1.8,
      statutorySLA: 2,
      onTimeRate: '99.4%',
      queryRate: '3.1%',
      status: 'nominal',
    },
    {
      dept: 'Directorate of Industrial Safety (DISH)',
      approval: 'Factory Building Plan & License',
      avgDays: 16.2,
      statutorySLA: 21,
      onTimeRate: '94.8%',
      queryRate: '12.4%',
      status: 'nominal',
    },
    {
      dept: 'Maharashtra Pollution Control Board (MPCB)',
      approval: 'Consent to Establish (CTE / CTO)',
      avgDays: 24.5,
      statutorySLA: 30,
      onTimeRate: '91.2%',
      queryRate: '18.7%',
      status: 'moderate_delay',
    },
    {
      dept: 'State Fire & Emergency Services',
      approval: 'Fire Safety NOC & Plan Scrutiny',
      avgDays: 11.4,
      statutorySLA: 15,
      onTimeRate: '95.6%',
      queryRate: '8.2%',
      status: 'nominal',
    },
    {
      dept: 'Food Safety Authority (FSSAI)',
      approval: 'Central Food Manufacturing License',
      avgDays: 19.8,
      statutorySLA: 25,
      onTimeRate: '93.1%',
      queryRate: '14.0%',
      status: 'nominal',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>State Single Window Facilitation Bureau · Macro Governance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            Bottleneck Analytics &amp; Regulatory Rules Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time inter-departmental SLA compliance monitoring, query frequency hotspots, and zero-code regulatory knowledge engine configuration.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveTab('bottlenecks')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'bottlenecks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SLA Performance
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'rules'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rules as Data Editor
          </button>
        </div>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Median State Turnaround</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-950 tabular-nums">
            18.4 Days
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-1">
            <TrendingUp className="w-3.5 h-3.5" /> 84% reduction vs manual legacy
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Overall SLA Compliance</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-950 tabular-nums">
            96.2%
          </div>
          <div className="text-[11px] text-slate-500 pt-1">Under Right to Public Services</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Fast Track Auto-Lane</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-950 tabular-nums">
            44.1%
          </div>
          <div className="text-[11px] text-blue-700 font-medium pt-1">Low-Risk Green/White units</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Joint Inspection Visits</span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            412 Visits
          </div>
          <div className="text-[11px] text-emerald-700 font-medium pt-1">Saved 1,236 individual visits</div>
        </div>
      </div>

      {/* Tab 1: Department Bottlenecks Table */}
      {activeTab === 'bottlenecks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Department-Wise Clearance Cycle Times &amp; Query Rates
            </h3>
            <span className="text-xs text-slate-500">Updated hourly from State API Gateway</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-100 text-[11px]">
                <tr>
                  <th className="py-3 px-6">Department &amp; Clearance</th>
                  <th className="py-3 px-4 font-mono text-right">Avg Cycle</th>
                  <th className="py-3 px-4 font-mono text-right">Statutory SLA</th>
                  <th className="py-3 px-4 font-mono text-right">On-Time %</th>
                  <th className="py-3 px-4 font-mono text-right">Query Rate</th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptMetrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{row.dept}</div>
                      <div className="text-slate-500 text-[11px]">{row.approval}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-right text-slate-900 tabular-nums">
                      {row.avgDays} Days
                    </td>
                    <td className="py-3.5 px-4 font-mono text-right text-slate-500 tabular-nums">
                      {row.statutorySLA} Days
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-right text-emerald-700 tabular-nums">
                      {row.onTimeRate}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-right text-slate-700 tabular-nums">
                      {row.queryRate}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {row.status === 'nominal' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5" /> Reviewing
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Rules as Data Editor */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Zero-Code Regulatory Knowledge Engine (Rules as Data)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory criteria are stored as structured configuration rather than hardcoded rules. Updates apply instantaneously across all applicants.
              </p>
            </div>
            <span className="text-xs text-emerald-700 font-mono font-bold bg-emerald-50 px-3 py-1 rounded border border-emerald-200 self-start sm:self-auto">
              Rule Schema: v2026.4.1 Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rule 1: Fire NOC Threshold */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Fire NOC Area Exemption</span>
                <span className="font-mono text-indigo-600 font-bold">{fireAreaThreshold} Sq.Ft</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Industrial premises with built-up area beneath this threshold are exempt from provisional fire NOC if classified low-hazard.
              </p>
              <input
                type="range"
                min="1000"
                max="5000"
                step="500"
                value={fireAreaThreshold}
                onChange={(e) => setFireAreaThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>1,000 sq.ft (Strict)</span>
                <span>5,000 sq.ft (Relaxed)</span>
              </div>
            </div>

            {/* Rule 2: Factory Act Workforce Limit */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Factories Act Worker Limit</span>
                <span className="font-mono text-indigo-600 font-bold">{workforceFactoryActThreshold} Workers</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Workforce threshold with electric power triggering mandatory DISH Factory License under Section 2(m)(i).
              </p>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={workforceFactoryActThreshold}
                onChange={(e) => setWorkforceFactoryActThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>5 Workers</span>
                <span>25 Workers</span>
              </div>
            </div>

            {/* Rule 3: Pollution Control Board SLA */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Pollution Board SLA Window</span>
                <span className="font-mono text-indigo-600 font-bold">{pcbSlaDays} Days</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Statutory maximum days allowed for Consent to Establish (CTE) before deemed approval trigger.
              </p>
              <input
                type="range"
                min="15"
                max="45"
                step="5"
                value={pcbSlaDays}
                onChange={(e) => setPcbSlaDays(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>15 Days</span>
                <span>45 Days</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-indigo-900">
              Live updates propagate across entrepreneur checklists in real time without recompilation.
            </span>
            <button
              onClick={() => alert('Regulatory parameters updated and broadcast to all 36 District Industries Centres.')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors"
            >
              Publish Updated Regulatory Rules
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
