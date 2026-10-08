import React, { useState } from 'react';
import {
  StartupProfile,
  UploadedDocRecord,
  ApplicationTask,
  RequiredDocument,
  StatutoryApproval,
} from '../types';
import { evaluateRegulatoryChecklist } from '../data/regulatoryRules';
import {
  Building2,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  Info,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { OCRScannerModal } from './OCRScannerModal';
import { CertificateModal } from './CertificateModal';

interface EntrepreneurPortalProps {
  startup: StartupProfile;
  setStartup: React.Dispatch<React.SetStateAction<StartupProfile>>;
  uploadedDocs: UploadedDocRecord[];
  setUploadedDocs: React.Dispatch<React.SetStateAction<UploadedDocRecord[]>>;
  applicationTasks: ApplicationTask[];
  setApplicationTasks: React.Dispatch<React.SetStateAction<ApplicationTask[]>>;
}

export const EntrepreneurPortal: React.FC<EntrepreneurPortalProps> = ({
  startup,
  setStartup,
  uploadedDocs,
  setUploadedDocs,
  applicationTasks,
  setApplicationTasks,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'checklist' | 'vault' | 'workflow' | 'renewals'>(
    'checklist'
  );
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [selectedDocForScan, setSelectedDocForScan] = useState<RequiredDocument | null>(null);
  const [selectedCertTask, setSelectedCertTask] = useState<ApplicationTask | null>(null);
  const [queryReplyTask, setQueryReplyTask] = useState<ApplicationTask | null>(null);
  const [queryReplyText, setQueryReplyText] = useState('');

  // Evaluate dynamic regulatory rules
  const evaluation = evaluateRegulatoryChecklist(startup);
  const applicableApprovals = evaluation.approvals.filter((a) => a.isApplicable);

  const getDocRecord = (code: string) => uploadedDocs.find((d) => d.docCode === code);

  const [docStatusFilter, setDocStatusFilter] = useState<
    'all' | 'verified' | 'validating' | 'query_raised' | 'not_uploaded'
  >('all');

  // Overall readiness
  const totalRequiredDocs = evaluation.requiredDocs.length;
  const verifiedDocsCount = evaluation.requiredDocs.filter((doc) => {
    const record = getDocRecord(doc.code);
    return record && record.status === 'verified';
  }).length;
  const validatingDocsCount = evaluation.requiredDocs.filter((doc) => {
    const record = getDocRecord(doc.code);
    return record && record.status === 'validating';
  }).length;
  const queryDocsCount = evaluation.requiredDocs.filter((doc) => {
    const record = getDocRecord(doc.code);
    return record && record.status === 'query_raised';
  }).length;
  const pendingDocsCount = totalRequiredDocs - (verifiedDocsCount + validatingDocsCount + queryDocsCount);
  const readinessPercent = Math.round((verifiedDocsCount / totalRequiredDocs) * 100);

  const handleUpdateDocStatus = (
    docCode: string,
    newStatus: 'verified' | 'validating' | 'query_raised' | 'not_uploaded'
  ) => {
    if (newStatus === 'not_uploaded') {
      setUploadedDocs((prev) => prev.filter((d) => d.docCode !== docCode));
      return;
    }

    setUploadedDocs((prev) => {
      const existing = prev.find((d) => d.docCode === docCode);
      const targetDoc = evaluation.requiredDocs.find((d) => d.code === docCode);
      if (existing) {
        return prev.map((d) =>
          d.docCode === docCode
            ? {
                ...d,
                status: newStatus,
                documentStatusNote:
                  newStatus === 'verified'
                    ? 'Verified by Single Window Officer'
                    : newStatus === 'query_raised'
                    ? 'Defect notice: Additional clarification requested'
                    : 'Ingestion in progress',
              }
            : d
        );
      } else {
        // Create new record
        const newRecord: UploadedDocRecord = {
          docId: `doc-${Date.now()}`,
          docCode,
          fileName: targetDoc?.sampleFileName || `${docCode}_scanned.pdf`,
          fileSize: '2.4 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          status: newStatus,
          ocrConfidence: 96.5,
          extractedData: {
            entityName: startup.businessName,
            cin: startup.cinOrRegistration,
          },
          digiLockerVerified: true,
          mismatchWarnings: [],
          documentStatusNote:
            newStatus === 'verified' ? 'Verified by Officer' : 'Status updated',
        };
        return [...prev, newRecord];
      }
    });
  };

  const handleSaveDocRecord = (newRecord: UploadedDocRecord) => {
    setUploadedDocs((prev) => {
      const filtered = prev.filter((d) => d.docCode !== newRecord.docCode);
      return [...filtered, newRecord];
    });
  };

  const handleSimulateAllUploads = () => {
    const simulatedRecords: UploadedDocRecord[] = evaluation.requiredDocs.map((doc, idx) => ({
      docId: `up-auto-${idx}`,
      docCode: doc.code,
      fileName: doc.sampleFileName || `${doc.code}_scanned.pdf`,
      fileSize: `${(2.2 + idx * 0.8).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'verified',
      ocrConfidence: +(94 + Math.random() * 5).toFixed(1),
      extractedData: {
        documentName: doc.name,
        companyName: startup.businessName,
        cin: startup.cinOrRegistration,
        issuingAuthority: doc.issuingAuthority,
      },
      digiLockerVerified: idx % 2 === 0,
      mismatchWarnings: [],
    }));
    setUploadedDocs(simulatedRecords);
  };

  const handleParallelSubmission = () => {
    setApplicationTasks((prev) =>
      prev.map((t) => {
        if (t.status === 'pending_docs') {
          return {
            ...t,
            status: t.isFastTrack ? 'approved' : 'under_scrutiny',
            submittedAt: new Date().toISOString().split('T')[0],
            slaDaysRemaining: t.slaDaysTotal,
            officerAssigned: 'Assigned via Auto-Routing Gateway',
          };
        }
        return t;
      })
    );
    setActiveSubTab('workflow');
  };

  const handleResolveQuery = () => {
    if (!queryReplyTask) return;
    setApplicationTasks((prev) =>
      prev.map((t) =>
        t.approvalId === queryReplyTask.approvalId
          ? { ...t, status: 'under_scrutiny', queryMessage: undefined }
          : t
      )
    );
    setQueryReplyTask(null);
    setQueryReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Overview Banner for the Startup */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                {startup.cinOrRegistration}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                {startup.sector.replace('_', ' ')} · {startup.scale.toUpperCase()} MSME
              </span>
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${
                  startup.pollutionCategory === 'red'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : startup.pollutionCategory === 'orange'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {startup.pollutionCategory} Category Unit
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                {startup.businessName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Industrial setup at Plot 44, MIDC Chakan, {startup.district}, {startup.state}.
                AI Regulatory Knowledge Engine has synthesized all central and state clearances into a single unified track.
              </p>
            </div>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-3.5 min-w-[130px]">
              <div className="text-[11px] font-medium text-slate-400">Statutory Approvals</div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {applicableApprovals.length} <span className="text-xs font-normal text-slate-400">required</span>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-3.5 min-w-[130px]">
              <div className="text-[11px] font-medium text-slate-400">Verified Documents</div>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {verifiedDocsCount} / {totalRequiredDocs}
              </div>
            </div>

            <button
              onClick={() => setShowProfileDrawer(!showProfileDrawer)}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Modify Startup Parameters</span>
            </button>
          </div>
        </div>

        {/* Real-time Document Readiness Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Smart Document Pre-Validation:</span>
            <div className="w-40 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
            <span className="font-mono font-bold text-white tabular-nums">
              {verifiedDocsCount} / {totalRequiredDocs} Verified ({readinessPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Upload Once, Shared Across 5 Departments Automatically</span>
          </div>
        </div>
      </div>

      {/* Profile Parameters Editor Drawer (Collapsible) */}
      {showProfileDrawer && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">
                Interactive Startup Parameter Engine
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Rules update instantly as you change inputs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={startup.businessName}
                onChange={(e) => setStartup({ ...startup, businessName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sector</label>
              <select
                value={startup.sector}
                onChange={(e) =>
                  setStartup({ ...startup, sector: e.target.value as any })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
              >
                <option value="food_processing">Food Processing &amp; Beverages</option>
                <option value="pharmaceuticals">Pharmaceuticals &amp; Biotech</option>
                <option value="heavy_engineering">Heavy &amp; Precision Engineering</option>
                <option value="textiles">Textiles &amp; Garments</option>
                <option value="chemical_plastics">Chemicals &amp; Petro-Plastics</option>
                <option value="electronics">Electronics &amp; Hardware Assembly</option>
                <option value="software_it">Software / IT Services</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Enterprise Scale</label>
              <select
                value={startup.scale}
                onChange={(e) =>
                  setStartup({ ...startup, scale: e.target.value as any })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
              >
                <option value="micro">Micro (&lt; ₹1 Cr Investment)</option>
                <option value="small">Small (₹1 Cr - ₹10 Cr)</option>
                <option value="medium">Medium (₹10 Cr - ₹50 Cr)</option>
                <option value="large">Large (&gt; ₹50 Cr)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lifecycle Stage</label>
              <select
                value={startup.stage}
                onChange={(e) =>
                  setStartup({ ...startup, stage: e.target.value as any })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
              >
                <option value="ideation">Ideation &amp; Incorporation</option>
                <option value="pre_construction">Pre-Construction (CTE Phase)</option>
                <option value="pre_operation">Pre-Operation (Factory Ready)</option>
                <option value="operating">Commercial Operations</option>
                <option value="expansion">Capacity Expansion</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Connected Power (HP)
              </label>
              <input
                type="number"
                value={startup.powerLoadHP}
                onChange={(e) =>
                  setStartup({ ...startup, powerLoadHP: Number(e.target.value) })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Shopfloor Workforce
              </label>
              <input
                type="number"
                value={startup.workforceCount}
                onChange={(e) =>
                  setStartup({ ...startup, workforceCount: Number(e.target.value) })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Built-Up Area (Sq.Ft)
              </label>
              <input
                type="number"
                value={startup.builtUpAreaSqFt}
                onChange={(e) =>
                  setStartup({ ...startup, builtUpAreaSqFt: Number(e.target.value) })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pollution Classification
              </label>
              <select
                value={startup.pollutionCategory}
                onChange={(e) =>
                  setStartup({ ...startup, pollutionCategory: e.target.value as any })
                }
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium capitalize"
              >
                <option value="white">White (Exempt / Clean)</option>
                <option value="green">Green (Low Pollution)</option>
                <option value="orange">Orange (Medium Pollution)</option>
                <option value="red">Red (High Scrutiny / Hazardous)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              *Changing values triggers rule re-computation across DISH, PCB, Fire, and FSSAI rules.
            </span>
            <button
              onClick={() => setShowProfileDrawer(false)}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              Apply &amp; Close Parameters
            </button>
          </div>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-xl max-w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'checklist'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Tailored Approvals ({applicableApprovals.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vault')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'vault'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Document Vault &amp; OCR Pre-Check</span>
        </button>

        <button
          onClick={() => setActiveSubTab('workflow')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'workflow'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Parallel Routing &amp; Live SLAs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('renewals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeSubTab === 'renewals'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Renewal Calendar</span>
        </button>
      </div>

      {/* Sub-Tab 1: Tailored Approvals Checklist */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <strong className="text-indigo-950 font-bold block text-sm">
                  Personalized Statutory Approval Matrix
                </strong>
                <span className="text-indigo-800">
                  Calculated dynamically from {startup.businessName}&apos;s sector, scale, workforce ({startup.workforceCount}), power load ({startup.powerLoadHP} HP), and pollution category ({startup.pollutionCategory.toUpperCase()}).
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-mono text-xs">
                Clearances: <strong className="text-slate-900">{applicableApprovals.length} Applicable</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {evaluation.approvals.map((appr) => {
              const task = applicationTasks.find((t) => t.approvalCode === appr.approvalCode);
              const isApproved = task?.status === 'approved';

              return (
                <div
                  key={appr.approvalCode}
                  className={`p-5 rounded-xl border transition-all ${
                    !appr.isApplicable
                      ? 'bg-slate-50/60 border-slate-200 opacity-60'
                      : isApproved
                      ? 'bg-white border-emerald-200 ring-1 ring-emerald-500/10'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-950">{appr.title}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {appr.approvalCode}
                        </span>
                        <span className="text-[11px] text-slate-500">· {appr.department}</span>
                        {!appr.isApplicable && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                            Exempt / Not Applicable
                          </span>
                        )}
                        {appr.isApplicable && isApproved && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-700">Legal Rationale:</strong>{' '}
                        {appr.specificRationale}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                        <span>Department: <strong className="text-slate-800">{appr.department}</strong></span>
                        <span>·</span>
                        <span>Act: <strong className="text-slate-800">{appr.statuteAct}</strong></span>
                        <span>·</span>
                        <span>Risk Tier: <strong className="text-slate-800 capitalize">{appr.riskCategory}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                      {isApproved && task ? (
                        <button
                          onClick={() => setSelectedCertTask(task)}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>View Certificate</span>
                        </button>
                      ) : appr.isApplicable ? (
                        <button
                          onClick={() => setActiveSubTab('vault')}
                          className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Review Docs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Document Vault & OCR Pre-Validation */}
      {activeSubTab === 'vault' && (
        <div className="space-y-5">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-xl text-xs">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Centralized Digital Document Vault &amp; Lifecycle Status Tracker</span>
              </h3>
              <p className="text-slate-400 mt-0.5">
                Upload once, verified across MCA, State Labour, Pollution Control Board, Fire Services, and Central Tax. Live status tracking prevents rejection delays.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSimulateAllUploads}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Load Sample Documents &amp; Run OCR</span>
              </button>
            </div>
          </div>

          {/* Interactive Document Status Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <span className="text-slate-500 mr-1 text-[11px]">Filter by Status:</span>
              <button
                onClick={() => setDocStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  docStatusFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Documents ({totalRequiredDocs})
              </button>
              <button
                onClick={() => setDocStatusFilter('verified')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  docStatusFilter === 'verified'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified ({verifiedDocsCount})</span>
              </button>
              <button
                onClick={() => setDocStatusFilter('validating')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  docStatusFilter === 'validating'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>In Review ({validatingDocsCount})</span>
              </button>
              <button
                onClick={() => setDocStatusFilter('query_raised')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  docStatusFilter === 'query_raised'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Query Raised ({queryDocsCount})</span>
              </button>
              <button
                onClick={() => setDocStatusFilter('not_uploaded')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  docStatusFilter === 'not_uploaded'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Pending Upload ({pendingDocsCount})</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Compliance Readiness: <strong className="text-slate-900">{readinessPercent}%</strong>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluation.requiredDocs
              .filter((doc) => {
                const record = getDocRecord(doc.code);
                const currentStatus = record ? record.status : 'not_uploaded';
                if (docStatusFilter === 'all') return true;
                if (docStatusFilter === 'verified') return currentStatus === 'verified';
                if (docStatusFilter === 'validating') return currentStatus === 'validating';
                if (docStatusFilter === 'query_raised') return currentStatus === 'query_raised';
                if (docStatusFilter === 'not_uploaded') return currentStatus === 'not_uploaded';
                return true;
              })
              .map((doc) => {
                const record = getDocRecord(doc.code);
                const isVerified = record && record.status === 'verified';
                const hasQuery = record && record.status === 'query_raised';
                const isValidating = record && record.status === 'validating';

                return (
                  <div
                    key={doc.code}
                    className={`p-5 rounded-xl border transition-all ${
                      isVerified
                        ? 'bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-500/10'
                        : hasQuery
                        ? 'bg-white border-rose-300 shadow-sm ring-1 ring-rose-500/10'
                        : isValidating
                        ? 'bg-white border-indigo-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{doc.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {doc.code}
                          </span>
                          {doc.isMandatory && (
                            <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {doc.description}
                        </p>
                        <div className="text-[10px] text-slate-500 font-mono flex flex-wrap items-center gap-3 pt-1">
                          <span>Authority: <strong className="text-slate-800">{doc.issuingAuthority}</strong></span>
                          {doc.processingTimeEstimate && (
                            <>
                              <span>·</span>
                              <span>Timeline: <strong className="text-slate-800">{doc.processingTimeEstimate}</strong></span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Prominent Lifecycle Status Pill */}
                      <div className="shrink-0 text-right">
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified &amp; Cleared
                          </span>
                        )}
                        {hasQuery && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" /> Query Raised
                          </span>
                        )}
                        {isValidating && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> In Review
                          </span>
                        )}
                        {!record && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Pending Upload
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Query Banner if Action Required */}
                    {hasQuery && (
                      <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Department Defect Notice:</strong>
                          <span>{record.documentStatusNote || 'Defect flagged. Please re-upload verified document copy.'}</span>
                        </div>
                      </div>
                    )}

                    {/* OCR Details if Uploaded */}
                    {record && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span className="font-mono text-slate-800 truncate max-w-[240px]">{record.fileName}</span>
                          <span className="font-mono text-emerald-700 font-semibold">
                            OCR Confidence: {record.ocrConfidence}% · DigiLocker: {record.digiLockerVerified ? 'Valid' : 'Manual'}
                          </span>
                        </div>

                        {/* Sample extracted tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(record.extractedData).slice(0, 3).map(([k, v]) => (
                            <span
                              key={k}
                              className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono truncate max-w-[200px]"
                            >
                              {k}: <strong>{v}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Change Document Status Control */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 mr-1">Change Status:</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateDocStatus(doc.code, 'not_uploaded')}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-all ${
                            !record || record.status === 'not_uploaded'
                              ? 'bg-slate-800 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateDocStatus(doc.code, 'validating')}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-all ${
                            record?.status === 'validating'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                          }`}
                        >
                          In Review
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateDocStatus(doc.code, 'query_raised')}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-all ${
                            record?.status === 'query_raised'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          Query Raised
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateDocStatus(doc.code, 'verified')}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-all ${
                            record?.status === 'verified'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          Verified
                        </button>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => setSelectedDocForScan(doc)}
                          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors text-xs ${
                            isVerified
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              : hasQuery
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          {isVerified ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Re-Scan / Edit</span>
                            </>
                          ) : hasQuery ? (
                            <>
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Resolve Query</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Upload &amp; Scan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Submission Action Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Ready to Initiate Parallel Department Routing?
              </div>
              <p className="text-xs text-slate-500">
                All uploaded documents will be transmitted simultaneously to District Industries Centre, State Pollution Board, Fire Services, and DISH.
              </p>
            </div>

            <button
              onClick={handleParallelSubmission}
              disabled={verifiedDocsCount === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${
                verifiedDocsCount > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:scale-[1.02]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Submit for Simultaneous Department Scrutiny</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Parallel Department Routing & Live SLAs */}
      {activeSubTab === 'workflow' && (
        <div className="space-y-5">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="font-bold text-sm text-emerald-900 block">
                  Simultaneous Multi-Department Routing Active
                </strong>
                <span>
                  Applications are being processed concurrently under the Single-Window Public Services Framework.
                </span>
              </div>
            </div>
            <span className="font-mono text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold">
              Parallel Desk Routing
            </span>
          </div>

          {/* Parallel Tasks Pipeline */}
          <div className="space-y-3">
            {applicationTasks.map((task) => {
              const isApproved = task.status === 'approved';
              const isScheduled = task.status === 'inspection_scheduled';
              const isUnderScrutiny = task.status === 'under_scrutiny';
              const hasQuery = task.status === 'query_raised';

              return (
                <div
                  key={task.approvalCode}
                  className="p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm space-y-3 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{task.title}</h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {task.approvalCode}
                        </span>
                        {task.isFastTrack && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            Fast Track Lane
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {task.department} · Officer: <strong>{task.officerAssigned || 'Queued for Assignment'}</strong>
                      </p>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-3">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" /> Approval Granted
                        </span>
                      )}
                      {isScheduled && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                          <Calendar className="w-4 h-4" /> Joint Site Visit Scheduled
                        </span>
                      )}
                      {isUnderScrutiny && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                          <Clock className="w-4 h-4 animate-spin" /> In Scrutiny
                        </span>
                      )}
                      {hasQuery && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                          <AlertTriangle className="w-4 h-4" /> Defect Query Raised
                        </span>
                      )}

                      {/* Action buttons */}
                      {isApproved && (
                        <button
                          onClick={() => setSelectedCertTask(task)}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>View Certificate</span>
                        </button>
                      )}
                      {hasQuery && (
                        <button
                          onClick={() => {
                            setQueryReplyTask(task);
                            setQueryReplyText('');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>Respond to Query</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Query banner if present */}
                  {hasQuery && task.queryMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
                      <strong className="block font-semibold">Department Defect Notice:</strong>
                      {task.queryMessage}
                    </div>
                  )}

                  {/* Status footer bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span>Filing Status: Active</span>
                      <span>·</span>
                      <span>Submitted: {task.submittedAt || 'Pending'}</span>
                    </div>

                    <div>
                      {isApproved ? (
                        <span className="text-emerald-600 font-bold">Clearance Granted</span>
                      ) : (
                        <span className="text-indigo-700 font-semibold">
                          Active Department Queue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Renewal Calendar & Compliance Radar */}
      {activeSubTab === 'renewals' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-1">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Statutory Compliance Lifecycle &amp; Renewal Radar</span>
            </h3>
            <p className="text-slate-400">
              OneGov AI monitors statutory expiry dates and triggers automatic alerts in advance. Never face sudden closure notices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-xl border border-amber-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Critical Renewal Required
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Form VI</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                Steam Boiler Fitness Certificate (Form VI)
              </h4>
              <p className="text-xs text-slate-500">
                Directorate of Steam Boilers, Maharashtra · Cert: BLR-MH-2025-4109
              </p>
              <div className="text-xs text-slate-600 flex justify-between pt-2 border-t border-slate-100">
                <span>Valid Until: <strong>2026-10-29</strong></span>
                <button
                  onClick={() => alert('Initiating streamlined renewal submission with pre-filled technical specs.')}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Renew Certificate
                </button>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Renewal Open
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Annual Review</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                State Fire Safety NOC (Occupancy Clearance)
              </h4>
              <p className="text-xs text-slate-500">
                MIDC Fire Services · Cert: MH-FIRE-PUN-2025-084
              </p>
              <div className="text-xs text-slate-600 flex justify-between pt-2 border-t border-slate-100">
                <span>Valid Until: <strong>2026-11-19</strong></span>
                <button
                  onClick={() => alert('Initiating streamlined renewal submission with pre-filled technical specs.')}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Prepare Renewal
                </button>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active &amp; Compliant
                </span>
                <span className="text-[11px] text-slate-500 font-mono">DISH Form 4</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                Factory Operating License (Factories Act 1948)
              </h4>
              <p className="text-xs text-slate-500">
                Directorate of Industrial Safety &amp; Health · Valid Until 2027-11-30
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active &amp; Compliant
                </span>
                <span className="text-[11px] text-slate-500 font-mono">5-Year Term</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                Consent to Operate (CTO) - Air &amp; Water Acts
              </h4>
              <p className="text-xs text-slate-500">
                Maharashtra Pollution Control Board · Valid Until 2030-05-09
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Query Reply Modal */}
      {queryReplyTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Submit Clarification for {queryReplyTask.title}
            </h3>
            <p className="text-xs text-slate-600">
              Department Query: <em>&ldquo;{queryReplyTask.queryMessage}&rdquo;</em>
            </p>
            <textarea
              rows={4}
              value={queryReplyText}
              onChange={(e) => setQueryReplyText(e.target.value)}
              placeholder="Provide clarifying remarks or details of the updated document..."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setQueryReplyTask(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveQuery}
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document OCR Modal */}
      {selectedDocForScan && (
        <OCRScannerModal
          document={selectedDocForScan}
          existingUpload={getDocRecord(selectedDocForScan.code)}
          onSave={handleSaveDocRecord}
          onClose={() => setSelectedDocForScan(null)}
        />
      )}

      {/* Certificate Viewer Modal */}
      {selectedCertTask && (
        <CertificateModal
          startup={startup}
          task={selectedCertTask}
          onClose={() => setSelectedCertTask(null)}
        />
      )}
    </div>
  );
};
