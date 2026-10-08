import React, { useState } from 'react';
import {
  StartupProfile,
  UploadedDocRecord,
  ApplicationTask,
  RequiredDocument,
  StatutoryApproval,
  UserProfile,
  FlowStep,
  IndustrySector,
  EnterpriseScale,
  BusinessStage,
} from '../types';
import { evaluateRegulatoryChecklist } from '../data/regulatoryRules';
import { DEMO_USERS } from '../data/authUsers';
import { SAMPLE_STARTUPS } from '../data/sampleStartups';
import {
  LogIn,
  Building2,
  FileText,
  UploadCloud,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Calendar,
  AlertCircle,
  FileCheck,
  Download,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  Check,
  UserCheck,
  Sliders,
  Send,
  Zap,
} from 'lucide-react';
import { CertificateModal } from './CertificateModal';
import { OCRScannerModal } from './OCRScannerModal';

interface ComplianceFlowWizardProps {
  currentStep: FlowStep;
  setCurrentStep: (step: FlowStep) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  startup: StartupProfile;
  setStartup: React.Dispatch<React.SetStateAction<StartupProfile>>;
  uploadedDocs: UploadedDocRecord[];
  setUploadedDocs: React.Dispatch<React.SetStateAction<UploadedDocRecord[]>>;
  applicationTasks: ApplicationTask[];
  setApplicationTasks: React.Dispatch<React.SetStateAction<ApplicationTask[]>>;
  onOpenAnomalyLab: () => void;
}

export const ComplianceFlowWizard: React.FC<ComplianceFlowWizardProps> = ({
  currentStep,
  setCurrentStep,
  currentUser,
  setCurrentUser,
  startup,
  setStartup,
  uploadedDocs,
  setUploadedDocs,
  applicationTasks,
  setApplicationTasks,
  onOpenAnomalyLab,
}) => {
  // Step 1: Login Form State
  const [loginEmail, setLoginEmail] = useState('founder@onegov.gov.in');
  const [loginPassword, setLoginPassword] = useState('GovSecure@2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Step 5 & Modal States
  const [selectedDocForScan, setSelectedDocForScan] = useState<RequiredDocument | null>(null);
  const [selectedCertTask, setSelectedCertTask] = useState<ApplicationTask | null>(null);
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  // Step 6 & 7: Officer Verification & Correction States
  const [officerDefectRemark, setOfficerDefectRemark] = useState(
    'Discrepancy Detected: Board Resolution is missing the Director DIN number (Director Identification Number) and ROC corporate seal.'
  );
  const [defectTargetDocCode, setDefectTargetDocCode] = useState<string>('DOC_BOARD_RES');
  const [correctionUploaded, setCorrectionUploaded] = useState(false);

  // Evaluate dynamic regulatory rules
  const evaluation = evaluateRegulatoryChecklist(startup);
  const requiredDocs = evaluation.requiredDocs;
  const approvals = evaluation.approvals.filter((a) => a.isApplicable);

  const getDocRecord = (code: string) => uploadedDocs.find((d) => d.docCode === code);

  // Step Navigation Items
  const stepsList: { step: FlowStep; title: string; subtitle: string; icon: React.ReactNode }[] = [
    { step: 1, title: 'Login', subtitle: 'Authentication & Role', icon: <LogIn className="w-4 h-4" /> },
    { step: 2, title: 'Business Profile', subtitle: 'Sector, Size & Stage', icon: <Building2 className="w-4 h-4" /> },
    { step: 3, title: 'Required Documents', subtitle: 'AI Clearance Engine', icon: <FileText className="w-4 h-4" /> },
    { step: 4, title: 'Document Upload', subtitle: 'Digital Vault Ingestion', icon: <UploadCloud className="w-4 h-4" /> },
    { step: 5, title: 'AI Pre-Validation', subtitle: 'OCR & Anomaly Checks', icon: <Cpu className="w-4 h-4" /> },
    { step: 6, title: 'Officer Verification', subtitle: 'Scrutiny & Query Sign', icon: <ShieldCheck className="w-4 h-4" /> },
    { step: 7, title: 'Correction', subtitle: 'Defect Rectification', icon: <AlertTriangle className="w-4 h-4" /> },
    { step: 8, title: 'Approval Tracking', subtitle: 'Milestone Progress', icon: <CheckCircle2 className="w-4 h-4" /> },
    { step: 9, title: 'Dashboard', subtitle: 'Consolidated Compliance', icon: <Layers className="w-4 h-4" /> },
  ];

  // Helper to handle login submit
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const matched = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase().trim()
    );
    if (matched) {
      setCurrentUser(matched);
      setLoginError(null);
      setCurrentStep(2);
    } else {
      // Default to founder demo profile if arbitrary email entered
      setCurrentUser({
        id: 'user-custom',
        name: loginEmail.split('@')[0].toUpperCase(),
        email: loginEmail,
        role: 'founder',
        designation: 'Authorized Signatory',
      });
      setLoginError(null);
      setCurrentStep(2);
    }
  };

  // Quick Demo Login helper
  const handleQuickLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setLoginEmail(user.email);
    setLoginPassword('GovSecure@2026');
    setLoginError(null);
    setCurrentStep(2);
  };

  // Helper to auto-populate test files for all required documents in Step 4
  const handleAutoPopulateDocuments = () => {
    const updated: UploadedDocRecord[] = requiredDocs.map((doc, idx) => {
      const isDefective = doc.code === defectTargetDocCode;
      return {
        docId: `rec-${doc.code}`,
        docCode: doc.code,
        fileName: `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_signed.pdf`,
        fileSize: `${(1.2 + idx * 0.4).toFixed(1)} MB`,
        uploadDate: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: isDefective ? 'query_raised' : 'verified',
        ocrConfidence: isDefective ? 68.4 : 97.2,
        extractedData: {
          companyName: startup.businessName,
          cin: startup.cinOrRegistration,
          registeredState: startup.state,
          signatory: startup.contactPerson,
        },
        digiLockerVerified: true,
        mismatchWarnings: isDefective
          ? ['Missing Director Identification Number (DIN)', 'ROC corporate seal signature block unverified']
          : [],
        verifiedAt: isDefective ? undefined : 'Today, 11:20 AM',
      };
    });
    setUploadedDocs(updated);
  };

  // Helper to simulate OCR pre-validation run in Step 5
  const handleRunOCRPreValidation = () => {
    setIsScanningSimulated(true);
    setTimeout(() => {
      setIsScanningSimulated(false);
      // Ensure uploaded docs are updated with simulated OCR findings
      handleAutoPopulateDocuments();
    }, 1200);
  };

  // Helper for officer action in Step 6
  const handleOfficerApproveAll = () => {
    setApplicationTasks((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'approved',
        approvalCertificateNumber: `MH/ONEGOV/2026/${Math.floor(1000 + Math.random() * 9000)}`,
        approvalGrantedDate: 'Today',
      }))
    );
    setCurrentStep(8);
  };

  const handleOfficerRaiseDefect = () => {
    // Flag the defect target document
    setUploadedDocs((prev) =>
      prev.map((d) =>
        d.docCode === defectTargetDocCode
          ? {
              ...d,
              status: 'query_raised',
              mismatchWarnings: [officerDefectRemark],
            }
          : d
      )
    );
    setApplicationTasks((prev) =>
      prev.map((t) =>
        t.approvalCode.includes('CTO') || t.approvalCode.includes('SHOP')
          ? { ...t, status: 'query_raised', queryMessage: officerDefectRemark }
          : t
      )
    );
    setCurrentStep(7);
  };

  // Helper for Correction upload in Step 7
  const handleUploadCorrectedDocument = () => {
    setCorrectionUploaded(true);
    setUploadedDocs((prev) =>
      prev.map((d) =>
        d.docCode === defectTargetDocCode
          ? {
              ...d,
              status: 'verified',
              fileName: 'board_resolution_with_din_and_seal_corrected.pdf',
              ocrConfidence: 99.4,
              mismatchWarnings: [],
              documentStatusNote: 'Corrected document verified via OCR. DIN 08492014 authenticated.',
              verifiedAt: 'Just Now',
            }
          : d
      )
    );
    setApplicationTasks((prev) =>
      prev.map((t) =>
        t.queryMessage
          ? { ...t, status: 'under_scrutiny', queryMessage: undefined }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* 9-Step Stepper Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                National Single Window Regulatory System
              </span>
              <span className="text-xs text-slate-400">· Smart India Hackathon 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              OneGov AI · 9-Step Approval &amp; Compliance Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              From authentication to AI pre-validation, officer scrutiny, defect rectification, and consolidated dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAnomalyLab}
              className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate System Errors (5 Scenarios)</span>
            </button>
            <div className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold border border-slate-200">
              Step {currentStep} / 9
            </div>
          </div>
        </div>

        {/* Interactive Step Stepper Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {stepsList.map((item) => {
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;

            return (
              <button
                key={item.step}
                onClick={() => setCurrentStep(item.step)}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all border ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-200'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    isCurrent
                      ? 'bg-white text-indigo-700'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : item.step}
                </div>
                <div className="text-[11px] font-bold truncate max-w-full leading-tight">
                  {item.title}
                </div>
                <div
                  className={`text-[9px] truncate max-w-full hidden sm:block ${
                    isCurrent ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: LOGIN */}
      {currentStep === 1 && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl mx-auto flex items-center justify-center font-bold shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              OneGov AI Single-Window Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Access statutory licenses, document pre-validation, and parallel department approvals.
            </p>
          </div>

          {/* Quick Demo Logins */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Quick Demo Logins (Click to Auto-Sign In)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all text-xs"
                >
                  <div className="font-bold text-slate-900">{user.name}</div>
                  <div className="text-[11px] text-indigo-600 font-medium capitalize">
                    {user.role === 'founder'
                      ? '🚀 Startup Founder'
                      : user.role === 'officer'
                      ? '🏛️ MPCB Scrutiny Officer'
                      : user.role === 'inspector'
                      ? '🔍 Joint Field Inspector'
                      : '⚙️ Diagnostic Engineer'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Username / Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="founder@onegov.gov.in"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                placeholder="••••••••••••"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In &amp; Proceed to Business Profile (Step 2)</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: BUSINESS PROFILE */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Step 2 of 9 · Profile Ingestion
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Configure Business Profile &amp; Project Parameters
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your company sector, scale, location, power, and stage. The AI Engine will calculate statutory clearances.
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Load Preset:</span>
              <button
                type="button"
                onClick={() => {
                  const it = SAMPLE_STARTUPS.find((s) => s.sector === 'software_it') || SAMPLE_STARTUPS[0];
                  setStartup(it);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
              >
                IT / SaaS
              </button>
              <button
                type="button"
                onClick={() => {
                  const fintech = SAMPLE_STARTUPS.find((s) => s.sector === 'fintech') || SAMPLE_STARTUPS[1];
                  setStartup(fintech);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              >
                FinTech
              </button>
              <button
                type="button"
                onClick={() => {
                  const food = SAMPLE_STARTUPS.find((s) => s.sector === 'food_processing') || SAMPLE_STARTUPS[2];
                  setStartup(food);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              >
                Food Processing
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Business Name
              </label>
              <input
                type="text"
                value={startup.businessName}
                onChange={(e) => setStartup({ ...startup, businessName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Industry Sector
              </label>
              <select
                value={startup.sector}
                onChange={(e) => setStartup({ ...startup, sector: e.target.value as IndustrySector })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
              >
                <option value="software_it">Software &amp; IT / SaaS</option>
                <option value="fintech">FinTech &amp; Digital Lending</option>
                <option value="ecommerce_d2c">E-Commerce &amp; D2C</option>
                <option value="healthtech">HealthTech &amp; Telemedicine</option>
                <option value="cleantech_ev">CleanTech &amp; EV Mobility</option>
                <option value="food_processing">Food Processing &amp; Agro</option>
                <option value="pharmaceuticals">Pharmaceuticals &amp; Biotech</option>
                <option value="heavy_engineering">Heavy Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enterprise Scale
              </label>
              <select
                value={startup.scale}
                onChange={(e) => setStartup({ ...startup, scale: e.target.value as EnterpriseScale })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
              >
                <option value="micro">Micro (&lt; ₹1 Cr)</option>
                <option value="small">Small (₹1 Cr - ₹10 Cr)</option>
                <option value="medium">Medium (₹10 Cr - ₹50 Cr)</option>
                <option value="large">Large (&gt; ₹50 Cr)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Lifecycle Stage
              </label>
              <select
                value={startup.stage}
                onChange={(e) => setStartup({ ...startup, stage: e.target.value as BusinessStage })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
              >
                <option value="ideation">Ideation / Incorporation</option>
                <option value="pre_construction">Pre-Construction (Site Clearance)</option>
                <option value="pre_operation">Pre-Operation (Consent to Operate)</option>
                <option value="operating">Active Operations &amp; Renewals</option>
                <option value="expansion">Industrial Expansion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location (State &amp; District)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={startup.state}
                  onChange={(e) => setStartup({ ...startup, state: e.target.value })}
                  placeholder="State"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={startup.district}
                  onChange={(e) => setStartup({ ...startup, district: e.target.value })}
                  placeholder="District"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Capital Investment (₹ Lakhs)
              </label>
              <input
                type="number"
                value={startup.capitalInvestmentLakhs}
                onChange={(e) =>
                  setStartup({ ...startup, capitalInvestmentLakhs: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Built-Up Premises Area (sq. ft.)
              </label>
              <input
                type="number"
                value={startup.builtUpAreaSqFt}
                onChange={(e) =>
                  setStartup({ ...startup, builtUpAreaSqFt: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Connected Power Load (HP / kVA)
              </label>
              <input
                type="number"
                value={startup.powerLoadHP}
                onChange={(e) => setStartup({ ...startup, powerLoadHP: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workforce Headcount
              </label>
              <input
                type="number"
                value={startup.workforceCount}
                onChange={(e) => setStartup({ ...startup, workforceCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* AI Pre-Calculation Summary Card */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  AI Regulatory Knowledge Engine Ready
                </div>
                <div className="text-xs text-slate-600">
                  Detected <strong>{approvals.length} Statutory Clearances</strong> and{' '}
                  <strong>{requiredDocs.length} Mandatory Document Artifacts</strong> for {startup.businessName}.
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <span>Generate Required Documents (Step 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REQUIRED DOCUMENTS */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Step 3 of 9 · AI Requirement Discovery
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                AI-Generated Approvals, Licenses &amp; Documents
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Customized for <strong>{startup.businessName}</strong> ({startup.sector.replace('_', ' ').toUpperCase()})
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <span>Proceed to Document Upload (Step 4)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Statutory Clearances Badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Statutory Approvals &amp; Clearances Mapped ({approvals.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {approvals.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{app.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold shrink-0">
                      SLA: {app.slaDays}d
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">{app.department}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{app.rationale}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents List */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Required Document Checklist ({requiredDocs.length})
              </h3>
              <span className="text-xs text-slate-500">
                {requiredDocs.filter((d) => d.isMandatory).length} Mandatory ·{' '}
                {requiredDocs.filter((d) => !d.isMandatory).length} Optional
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requiredDocs.map((doc) => {
                const record = getDocRecord(doc.code);
                return (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                        {doc.isMandatory && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                            MANDATORY
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{doc.description}</p>
                      <div className="text-[10px] text-slate-400">
                        Issuing Authority: <strong className="text-slate-600">{doc.issuingAuthority}</strong>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {record ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Uploaded
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: DOCUMENT UPLOAD */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Step 4 of 9 · Document Ingestion
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Upload Required Documents &amp; Certificates
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Drag and drop PDF/JPG documents into the secure regulatory repository.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoPopulateDocuments}
                className="px-3.5 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>One-Click Populate Test Documents</span>
              </button>

              <button
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Run AI Pre-Validation (Step 5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requiredDocs.map((doc) => {
              const record = getDocRecord(doc.code);

              return (
                <div
                  key={doc.id}
                  className={`p-4 rounded-xl border transition-all ${
                    record
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-tight">{doc.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        record
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {record ? 'UPLOADED' : 'PENDING'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{doc.description}</p>

                  {record ? (
                    <div className="mt-3 pt-3 border-t border-emerald-200/60 text-xs space-y-1">
                      <div className="font-mono text-[11px] text-slate-700 truncate font-semibold">
                        📄 {record.fileName}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{record.fileSize}</span>
                        <span>Uploaded: {record.uploadDate}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <label className="w-full py-2 px-3 border border-dashed border-indigo-300 bg-white hover:bg-indigo-50/50 rounded-lg text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Select File (.pdf, .jpg)</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={() => {
                            const newRec: UploadedDocRecord = {
                              docId: `doc-${doc.code}`,
                              docCode: doc.code,
                              fileName: `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
                              fileSize: '1.8 MB',
                              uploadDate: 'Just Now',
                              status: 'validating',
                              ocrConfidence: 94.2,
                              extractedData: { companyName: startup.businessName },
                              digiLockerVerified: true,
                              mismatchWarnings: [],
                            };
                            setUploadedDocs((prev) => [...prev.filter((d) => d.docCode !== doc.code), newRec]);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: AI PRE-VALIDATION */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Step 5 of 9 · Optical Recognition &amp; Quality Audit
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                AI Pre-Validation &amp; Discrepancy Detection
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                OCR checks for missing signatures, incomplete document pages, and corporate profile mismatches.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunOCRPreValidation}
                disabled={isScanningSimulated}
                className="px-3.5 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanningSimulated ? 'animate-spin' : ''}`} />
                <span>{isScanningSimulated ? 'Scanning Documents...' : 'Re-Run AI OCR Audit'}</span>
              </button>

              <button
                onClick={() => setCurrentStep(6)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Forward to Officer Verification (Step 6)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Pre-Validation Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-bold text-slate-600 uppercase">1. Missing Information</span>
              <div className="text-lg font-bold text-rose-600">1 Item Flagged</div>
              <p className="text-xs text-slate-500">
                Director DIN number missing in Board Resolution draft.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-bold text-slate-600 uppercase">2. Page Completeness</span>
              <div className="text-lg font-bold text-emerald-600">100% Passed</div>
              <p className="text-xs text-slate-500">
                All document pages and boundary survey maps present.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-bold text-slate-600 uppercase">3. Profile Match Rate</span>
              <div className="text-lg font-bold text-indigo-600">98.4% Match</div>
              <p className="text-xs text-slate-500">
                Company name, CIN, and address align across PAN &amp; Lease Deed.
              </p>
            </div>
          </div>

          {/* Document Audit Cards */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Document Audit &amp; Extraction Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedDocs.slice(0, 4).map((rec) => {
                const isFlagged = rec.mismatchWarnings.length > 0;

                return (
                  <div
                    key={rec.docId}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isFlagged
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{rec.fileName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Code: {rec.docCode}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isFlagged
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isFlagged ? 'DEFECT DETECTED' : `OCR ${rec.ocrConfidence}% PASS`}
                      </span>
                    </div>

                    {isFlagged ? (
                      <div className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold">AI Flag:</strong> {rec.mismatchWarnings.join('; ')}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold">Pre-Validated:</strong> Matches applicant name &quot;{startup.businessName}&quot;. DigiLocker hash verified.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: OFFICER VERIFICATION */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Step 6 of 9 · Statutory Scrutiny
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Government Officer Review &amp; Clearance Sign-off
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Logged in as <strong>{currentUser?.name || 'Dr. V. B. Shinde'}</strong> ({currentUser?.department || 'Pollution Control Board'})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOfficerRaiseDefect}
                className="px-3.5 py-2 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl border border-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Request Correction (Step 7)</span>
              </button>

              <button
                onClick={handleOfficerApproveAll}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve &amp; Sign Clearances</span>
              </button>
            </div>
          </div>

          {/* Officer Scrutiny Console */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Application Dossier Review
              </h3>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {startup.businessName} · Statutory Consent Application
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    CIN: {startup.cinOrRegistration}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sector:</span>
                    <strong className="text-slate-700 capitalize">{startup.sector.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Capital:</span>
                    <strong className="text-slate-700">₹{startup.capitalInvestmentLakhs} Lakhs</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Power:</span>
                    <strong className="text-slate-700">{startup.powerLoadHP} HP</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Workforce:</span>
                    <strong className="text-slate-700">{startup.workforceCount} Staff</strong>
                  </div>
                </div>
              </div>

              {/* Defect Remark Editor */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Officer Query / Defect Notice Composer
                  </span>
                  <span className="text-[10px] text-rose-600 font-mono">Target: {defectTargetDocCode}</span>
                </div>
                <textarea
                  rows={2}
                  value={officerDefectRemark}
                  onChange={(e) => setOfficerDefectRemark(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-rose-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Describe the defect or missing clause..."
                />
                <div className="flex justify-between items-center text-[11px] text-rose-700">
                  <span>If submitted, the entrepreneur will see this in Step 7 (Correction).</span>
                  <button
                    onClick={handleOfficerRaiseDefect}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Issue Defect Notice
                  </button>
                </div>
              </div>
            </div>

            {/* Officer Quick Actions */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Department Scrutiny Actions
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  onClick={handleOfficerApproveAll}
                  className="w-full p-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Grant Statutory Consent (Approve)</span>
                </button>
                <button
                  onClick={handleOfficerRaiseDefect}
                  className="w-full p-2.5 rounded-lg bg-rose-100 text-rose-800 font-semibold hover:bg-rose-200 transition-colors flex items-center justify-center gap-2 border border-rose-200"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Request Document Correction</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-200">
                Government officers can grant direct approval if all AI checks pass, or raise a defect notice to give the applicant an opportunity to upload a rectified document.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: CORRECTION */}
      {currentStep === 7 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Step 7 of 9 · Defect Rectification
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Review Defect &amp; Upload Corrected Document
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                The government officer has highlighted a mistake. Clearly review the discrepancy and upload the corrected version.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(8)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <span>Track Approval Status (Step 8)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Highlighted Mistake Banner */}
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-300 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Mistake Identified in Document: Board Resolution (DOC_BOARD_RES)</span>
              </div>
              <span className="text-xs font-mono font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                STATUS: CORRECTION REQUIRED
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-xs text-rose-900 leading-relaxed font-medium">
              <strong>Official Officer Remark:</strong> {officerDefectRemark}
            </div>

            <div className="text-[11px] text-rose-700">
              Notice Issued: Today, 11:35 AM · Officer: Dr. V. B. Shinde (MPCB Scrutiny Cell)
            </div>
          </div>

          {/* Side-by-Side Comparison & Correction Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Previous Defective File */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Current Flawed Upload
                </span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  Contains Discrepancy
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">📄 board_resolution_v1.pdf</div>
                <div className="text-slate-500 text-[11px]">Size: 1.2 MB · Uploaded: Earlier Today</div>
                <div className="text-rose-600 font-semibold text-[11px] mt-1">
                  ❌ Missing Director DIN (Director Identification Number)
                </div>
              </div>
            </div>

            {/* Right: Upload Corrected Version */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase">
                  Upload Corrected Version
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  AI Instant Audit Ready
                </span>
              </div>

              {correctionUploaded ? (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Corrected Document Uploaded &amp; Pre-Validated!</span>
                  </div>
                  <div className="text-slate-700 font-mono text-[11px]">
                    📄 board_resolution_with_din_and_seal_corrected.pdf
                  </div>
                  <div className="text-emerald-700 text-[11px]">
                    ✓ OCR Scan: DIN 08492014 authenticated · ROC Corporate Seal 100% matched.
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleUploadCorrectedDocument}
                    className="w-full py-3 px-4 border border-dashed border-indigo-400 bg-white hover:bg-indigo-50 rounded-xl text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Corrected Board Resolution (With DIN)</span>
                  </button>
                  <div className="text-[10px] text-slate-500 text-center">
                    Accepts signed PDF or scan with Director DIN and official seal.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: APPROVAL TRACKING */}
      {currentStep === 8 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Step 8 of 9 · Approval Lifecycle
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Real-Time Statutory Approval Tracking
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Submission &rarr; AI Pre-Validation &rarr; Officer Verification &rarr; Correction &rarr; Final Approval
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(9)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors shrink-0"
            >
              <span>View Consolidated Dashboard (Step 9)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Timeline Bar */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="space-y-1">
                <div className="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs font-bold text-slate-900">1. Submission</div>
                <div className="text-[10px] text-slate-400">100% Completed</div>
              </div>

              <div className="space-y-1">
                <div className="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs font-bold text-slate-900">2. AI Pre-Validation</div>
                <div className="text-[10px] text-slate-400">OCR Passed</div>
              </div>

              <div className="space-y-1">
                <div className="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs font-bold text-slate-900">3. Verification &amp; Correction</div>
                <div className="text-[10px] text-slate-400">Rectified</div>
              </div>

              <div className="space-y-1">
                <div className="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs font-bold text-slate-900">4. Final Approval</div>
                <div className="text-[10px] text-emerald-600 font-bold">Certificate Issued</div>
              </div>
            </div>
          </div>

          {/* Department Approvals Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Department Clearances &amp; Digital Certificates
            </h3>

            <div className="space-y-3">
              {applicationTasks.slice(0, 4).map((task) => (
                <div
                  key={task.approvalId}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{task.title}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        APPROVED
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{task.department}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Certificate No: {task.approvalCertificateNumber || 'MH/ONEGOV/2026/8421'}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCertTask(task)}
                    className="px-3.5 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-200 flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Official Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 9: DASHBOARD */}
      {currentStep === 9 && (
        <div className="space-y-6">
          {/* Dashboard Summary Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Step 9 of 9 · Unified Governance Console
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  Consolidated Compliance &amp; Approval Dashboard
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Comprehensive overview of pending documents, corrections, approvals, inspections, and renewal reminders.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                >
                  Restart Flow (Step 1)
                </button>
                <button
                  onClick={onOpenAnomalyLab}
                  className="px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Test 5 Error Scenarios</span>
                </button>
              </div>
            </div>

            {/* 5 Core Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
              {/* Metric 1 */}
              <div
                onClick={() => setCurrentStep(4)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Pending Documents
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {requiredDocs.length - uploadedDocs.length > 0
                    ? requiredDocs.length - uploadedDocs.length
                    : 0}
                </div>
                <div className="text-[11px] text-indigo-600 font-medium mt-0.5">Upload remaining &rarr;</div>
              </div>

              {/* Metric 2 */}
              <div
                onClick={() => setCurrentStep(7)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Corrections Needed
                </div>
                <div className="text-2xl font-bold text-rose-600 mt-1">
                  {uploadedDocs.filter((d) => d.status === 'query_raised').length}
                </div>
                <div className="text-[11px] text-rose-600 font-medium mt-0.5">Review mistakes &rarr;</div>
              </div>

              {/* Metric 3 */}
              <div
                onClick={() => setCurrentStep(8)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Approvals Granted
                </div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">
                  {applicationTasks.filter((t) => t.status === 'approved').length || 4}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Certificates active &rarr;</div>
              </div>

              {/* Metric 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Joint Inspections
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">1 Scheduled</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Next visit: 15 Oct 2026</div>
              </div>

              {/* Metric 5 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Renewal Reminders
                </div>
                <div className="text-2xl font-bold text-amber-600 mt-1">2 Upcoming</div>
                <div className="text-[11px] text-amber-600 font-medium mt-0.5">Expiry in 45 &amp; 90 days</div>
              </div>
            </div>
          </div>

          {/* Activity Feed & Renewal Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Official Notifications Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Live Regulatory Activity Feed &amp; Notifications
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-900">Consent to Operate (CTO) Granted</div>
                    <div className="text-slate-600 mt-0.5">
                      Maharashtra Pollution Control Board approved clearance under Air &amp; Water Acts.
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">10 mins ago · Digital Certificate #MH/ONEGOV/2026/8421</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Joint Field Inspection Itinerary Dispatched</div>
                    <div className="text-slate-600 mt-0.5">
                      Participating departments: Pollution Control Board &amp; Factory Safety Inspectorate.
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">1 hour ago · Lead: Er. Rajesh Kadam</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-indigo-900">AI Pre-Validation Completed</div>
                    <div className="text-slate-600 mt-0.5">
                      High optical confidence (97.4%). Digilocker corporate hash authenticated.
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Today, 10:15 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Upcoming Statutory Renewals */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Statutory Renewal Calendar &amp; Reminders
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">State Fire NOC Annual Renewal</div>
                    <div className="text-slate-500 text-[11px]">Department of Fire &amp; Emergency Services</div>
                    <div className="text-amber-800 font-semibold text-[11px] mt-1">
                      Expires in 45 Days (30 Nov 2026)
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] shrink-0">
                    Renew NOC
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Shops &amp; Commercial Establishment License</div>
                    <div className="text-slate-500 text-[11px]">Municipal Corporation Labor Department</div>
                    <div className="text-slate-600 font-semibold text-[11px] mt-1">
                      Expires in 90 Days (31 Dec 2026)
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-[11px] shrink-0">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate Modal */}
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
