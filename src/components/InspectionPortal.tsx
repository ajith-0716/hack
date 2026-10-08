import React, { useState } from 'react';
import {
  JointInspection,
  StartupProfile,
  ApplicationTask,
} from '../types';
import {
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Camera,
  Users,
  FileCheck,
  Send,
  Building2,
} from 'lucide-react';
import { SAMPLE_JOINT_INSPECTION } from '../data/sampleStartups';

interface InspectionPortalProps {
  currentStartup: StartupProfile;
  applicationTasks: ApplicationTask[];
  setApplicationTasks: React.Dispatch<React.SetStateAction<ApplicationTask[]>>;
}

export const InspectionPortal: React.FC<InspectionPortalProps> = ({
  currentStartup,
  applicationTasks,
  setApplicationTasks,
}) => {
  const [inspection, setInspection] = useState<JointInspection>(SAMPLE_JOINT_INSPECTION);
  const [isCompleted, setIsCompleted] = useState(inspection.status === 'completed');
  const [recommendation, setRecommendation] = useState<
    'grant_immediate' | 'grant_with_conditions' | 'resubmit'
  >(inspection.recommendation || 'grant_with_conditions');

  const handleToggleChecklist = (index: number) => {
    setInspection((prev) => {
      const updated = [...prev.jointChecklist];
      const current = updated[index].status;
      updated[index].status = current === 'verified' ? 'pending' : 'verified';
      return { ...prev, jointChecklist: updated };
    });
  };

  const handleFinalizeReport = () => {
    setIsCompleted(true);
    setInspection((prev) => ({
      ...prev,
      status: 'completed',
      recommendation,
    }));

    // Mark inspection tasks as ready for grant in parallel tasks
    setApplicationTasks((prev) =>
      prev.map((t) => {
        if (t.status === 'inspection_scheduled') {
          return {
            ...t,
            status: 'approved',
            approvalCertificateNumber: `JOINT-PASS-2026/${t.approvalCode}`,
            approvalGrantedDate: new Date().toISOString().split('T')[0],
          };
        }
        return t;
      })
    );
  };

  const verifiedCount = inspection.jointChecklist.filter((c) => c.status === 'verified').length;
  const totalCount = inspection.jointChecklist.length;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Harmonized Single-Window Inspection Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            Joint Multi-Department Site Inspection Planner
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Eliminates repeated factory visits. OneGov AI synchronizes State Pollution Board, Fire &amp; Emergency, DISH, and Boilers into a single unified inspection itinerary.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 min-w-[240px] text-xs space-y-1.5">
          <div className="text-slate-400">Scheduled Joint Slot:</div>
          <div className="font-bold text-white text-sm flex items-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{inspection.scheduledDate} · {inspection.timeSlot}</span>
          </div>
          <div className="text-emerald-400 flex items-center gap-1 pt-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 4 Departments Synchronized
          </div>
        </div>
      </div>

      {/* Main Inspection Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Site Itinerary & Participating Officers */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Inspection Location &amp; Unit Details</span>
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">{currentStartup.businessName}</div>
              <div className="text-slate-600 font-mono text-[11px]">{inspection.siteAddress}</div>
              <div className="text-slate-500 pt-1">
                Sector: <strong className="capitalize">{currentStartup.sector.replace('_', ' ')}</strong> · Scale: <strong className="uppercase">{currentStartup.scale}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Participating Department Inspectors:</span>
              <div className="space-y-1.5">
                {inspection.participatingDepartments.map((dept, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-slate-700"
                  >
                    <span>{dept}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-950 space-y-1">
              <span className="font-bold block">Lead Coordinating Officer:</span>
              <div className="font-medium">{inspection.leadOfficer}</div>
              <div className="text-slate-500 font-mono text-[11px]">Phone: {inspection.leadOfficerContact}</div>
            </div>
          </div>
        </div>

        {/* Right: Unified Joint Inspection Checklist & Decision */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Unified Multi-Department Inspection Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Tap to verify compliance on site during the joint walkthrough.
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 self-start sm:self-auto">
                {verifiedCount} / {totalCount} Items Cleared
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {inspection.jointChecklist.map((item, idx) => {
                const isItemVerified = item.status === 'verified';
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleChecklist(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isItemVerified
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                          isItemVerified
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isItemVerified && <CheckCircle2 className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1 flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{item.item}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.department}
                          </span>
                        </div>
                        {item.remarks && (
                          <p className="text-[11px] text-slate-500 italic">
                            Field Note: {item.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Geotagged Photo Simulation */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Geotagged Mobile Field Evidence (Lat: 18.7512° N, Long: 73.8541° E)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                5 Photos Uploaded
              </span>
            </div>

            {/* Inspector Recommendation & Submission */}
            <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Consolidated Multi-Department Joint Recommendation:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecommendation('grant_immediate')}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-colors ${
                      recommendation === 'grant_immediate'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Grant Immediate Clearance
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommendation('grant_with_conditions')}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-colors ${
                      recommendation === 'grant_with_conditions'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Grant with Standard Conditions
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommendation('resubmit')}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-colors ${
                      recommendation === 'resubmit'
                        ? 'bg-rose-50 border-rose-500 text-rose-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Rectification Required (15 Days)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">
                  {isCompleted
                    ? 'Report successfully submitted to all 4 department heads.'
                    : 'Submitting signs the report digitally on behalf of all 4 visiting officers.'}
                </span>

                <button
                  onClick={handleFinalizeReport}
                  disabled={isCompleted}
                  className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>
                    {isCompleted ? 'Joint Report Finalized' : 'Sign & Submit Unified Joint Report'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
