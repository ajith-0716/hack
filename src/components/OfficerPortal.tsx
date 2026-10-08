import React, { useState } from 'react';
import {
  StartupProfile,
  UploadedDocRecord,
  ApplicationTask,
} from '../types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  UserCheck,
  Send,
  Calendar,
  Building2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { CertificateModal } from './CertificateModal';

interface OfficerPortalProps {
  currentStartup: StartupProfile;
  applicationTasks: ApplicationTask[];
  setApplicationTasks: React.Dispatch<React.SetStateAction<ApplicationTask[]>>;
  uploadedDocs: UploadedDocRecord[];
  setUploadedDocs?: React.Dispatch<React.SetStateAction<UploadedDocRecord[]>>;
}

export const OfficerPortal: React.FC<OfficerPortalProps> = ({
  currentStartup,
  applicationTasks,
  setApplicationTasks,
  uploadedDocs,
  setUploadedDocs,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('MPCB');
  const [activeTaskId, setActiveTaskId] = useState<string>(
    applicationTasks.find((t) => t.department.includes('Pollution') || t.approvalCode === 'PCB_CTO')?.approvalId ||
      applicationTasks[0]?.approvalId ||
      ''
  );
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [selectedCertTask, setSelectedCertTask] = useState<ApplicationTask | null>(null);

  const departments = [
    { code: 'MPCB', name: 'State Pollution Control Board', officer: 'Dr. V. B. Shinde (Sub-Regional Officer)' },
    { code: 'DISH', name: 'Directorate of Industrial Safety & Health', officer: 'Er. Rajesh Kadam (Joint Director)' },
    { code: 'FIRE', name: 'State Fire & Emergency Services', officer: 'CFO N. R. Gaikwad' },
    { code: 'FSSAI', name: 'Food Safety Authority (FSSAI)', officer: 'Dr. Prachi Sawant (Designated Officer)' },
    { code: 'DIC', name: 'District Industries Centre (MSME)', officer: 'K. S. Patil (General Manager)' },
  ];

  const activeTask = applicationTasks.find((t) => t.approvalId === activeTaskId);

  const handleGrantApproval = () => {
    if (!activeTask) return;
    const certNum = `${selectedDept}/PUN-2026/${Math.floor(1000 + Math.random() * 9000)}`;
    setApplicationTasks((prev) =>
      prev.map((t) =>
        t.approvalId === activeTask.approvalId
          ? {
              ...t,
              status: 'approved',
              approvalCertificateNumber: certNum,
              approvalGrantedDate: new Date().toISOString().split('T')[0],
              slaDaysRemaining: 0,
            }
          : t
      )
    );
  };

  const handleRaiseQuery = () => {
    if (!activeTask || !queryText.trim()) return;
    setApplicationTasks((prev) =>
      prev.map((t) =>
        t.approvalId === activeTask.approvalId
          ? {
              ...t,
              status: 'query_raised',
              queryMessage: queryText,
            }
          : t
      )
    );
    setQueryModalOpen(false);
    setQueryText('');
  };

  const handleScheduleInspection = () => {
    if (!activeTask) return;
    setApplicationTasks((prev) =>
      prev.map((t) =>
        t.approvalId === activeTask.approvalId
          ? {
              ...t,
              status: 'inspection_scheduled',
              inspectionDate: '2026-10-14',
            }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Officer Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Statutory Scrutiny Console · Officer View</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Single-Window Scrutiny &amp; Risk-Based Triage
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Review pre-extracted OCR entities, verify DigiLocker authenticity seals, raise targeted clarification notices, or digitally sign final approvals.
          </p>
        </div>

        {/* Department Switcher */}
        <div className="flex flex-col gap-1.5 self-start md:self-auto min-w-[260px]">
          <label className="text-[11px] font-semibold text-slate-400">Select Reviewing Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-slate-800 text-white font-semibold py-2 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {departments.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400 italic">
            Active: {departments.find((d) => d.code === selectedDept)?.officer}
          </span>
        </div>
      </div>

      {/* Main Scrutiny Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Department Tasks Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span>Incoming Applications ({applicationTasks.length})</span>
            <span className="text-slate-500 font-normal">Ranked by SLA Urgency</span>
          </div>

          <div className="space-y-2.5">
            {applicationTasks.map((task) => {
              const isSelected = task.approvalId === activeTaskId;
              return (
                <button
                  key={task.approvalId}
                  onClick={() => setActiveTaskId(task.approvalId)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 shadow-sm ring-1 ring-indigo-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{task.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{task.department}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      {task.status === 'approved' && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Approved
                        </span>
                      )}
                      {task.status === 'inspection_scheduled' && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Visit 14-Oct
                        </span>
                      )}
                      {task.status === 'under_scrutiny' && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          In Scrutiny
                        </span>
                      )}
                      {task.status === 'query_raised' && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Query Open
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>Applicant: <strong>{currentStartup.businessName}</strong></span>
                    <span className="font-mono text-indigo-900 font-semibold">
                      Queue: Priority Review
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Scrutiny Workbench */}
        <div className="lg:col-span-7 space-y-4">
          {activeTask ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Task Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{activeTask.title}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {activeTask.approvalCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Single Window Desk · Department: <strong>{activeTask.department}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeTask.status === 'approved' ? (
                    <button
                      onClick={() => setSelectedCertTask(activeTask)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>View Generated Certificate</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      Status: {activeTask.status.replace('_', ' ').toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Applicant Enterprise Dossier */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Applicant Enterprise Dossier</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Identity &amp; PAN Verified via MCA
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Company Name</span>
                    <strong className="text-slate-900">{currentStartup.businessName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">CIN / Udyam</span>
                    <strong className="font-mono text-slate-900">{currentStartup.cinOrRegistration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Pollution Cat</span>
                    <strong className="capitalize text-slate-900">{currentStartup.pollutionCategory}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Enterprise Scale</span>
                    <strong className="text-slate-900 font-mono">{currentStartup.scale.toUpperCase()} MSME</strong>
                  </div>
                </div>
              </div>

              {/* Attached OCR Extracted Documents */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pre-Validated Scanned Documents &amp; Confidence Metrics
                </h4>

                <div className="space-y-2">
                  {uploadedDocs.slice(0, 5).map((doc) => (
                    <div
                      key={doc.docCode}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <strong className="text-slate-900 block">{doc.fileName}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">
                            OCR Confidence: {doc.ocrConfidence}% · DigiLocker:{' '}
                            {doc.digiLockerVerified ? 'Valid' : 'Manual'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            doc.status === 'verified'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : doc.status === 'query_raised'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {doc.status === 'verified'
                            ? 'Verified'
                            : doc.status === 'query_raised'
                            ? 'Query Open'
                            : 'In Review'}
                        </span>

                        {setUploadedDocs && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedDocs((prev) =>
                                  prev.map((d) =>
                                    d.docCode === doc.docCode ? { ...d, status: 'verified' } : d
                                  )
                                );
                              }}
                              title="Mark Verified"
                              className="px-2 py-0.5 text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-semibold transition-colors"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedDocs((prev) =>
                                  prev.map((d) =>
                                    d.docCode === doc.docCode
                                      ? {
                                          ...d,
                                          status: 'query_raised',
                                          documentStatusNote: 'Officer flagged discrepancy during scrutiny',
                                        }
                                      : d
                                  )
                                );
                              }}
                              title="Flag Query"
                              className="px-2 py-0.5 text-[10px] bg-rose-100 hover:bg-rose-200 text-rose-800 rounded font-semibold transition-colors"
                            >
                              Flag
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Decision Console */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setQueryModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Raise Clarification Query</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleScheduleInspection}
                    className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Sync with Joint Inspection</span>
                  </button>

                  <button
                    onClick={handleGrantApproval}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Grant Statutory Approval</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              Select an application from the queue to begin scrutiny.
            </div>
          )}
        </div>
      </div>

      {/* Query Raise Modal */}
      {queryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Raise Formal Defect Query to {currentStartup.businessName}</span>
            </h3>
            <p className="text-xs text-slate-600">
              Specify the exact statutory document or parameter requiring correction. The SLA clock will pause until the entrepreneur submits a revised filing.
            </p>
            <textarea
              rows={4}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="e.g. Please clarify effluent recycling capacity in ETP drawing, and upload hydraulic test certificate for boiler..."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setQueryModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRaiseQuery}
                className="px-4 py-1.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Dispatch Defect Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Viewer */}
      {selectedCertTask && (
        <CertificateModal
          startup={currentStartup}
          task={selectedCertTask}
          onClose={() => setSelectedCertTask(null)}
        />
      )}
    </div>
  );
};
