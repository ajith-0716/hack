import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { StartupProfile, ApplicationTask } from '../types';

interface CertificateModalProps {
  startup: StartupProfile;
  task: ApplicationTask;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  startup,
  task,
  onClose,
}) => {
  const certNumber = task.approvalCertificateNumber || `ONEGOV-${task.approvalCode}-2026-08941`;
  const issueDate = task.approvalGrantedDate || new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital Cryptographic Statutory Clearance Document</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="p-8 overflow-y-auto space-y-6 bg-[#fcfdfe] text-slate-900 font-sans print:p-0">
          {/* Official Seal and Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-xl ring-4 ring-slate-100 mb-1">
              GOV
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Government of {startup.state} · Single Window Facilitation Bureau
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 font-display">
              {task.title.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Issued in accordance with statutory powers under the Ease of Doing Business Act and Single Window Clearing Framework.
            </p>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Certificate Number</span>
              <strong className="font-mono text-slate-900">{certNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Issue Date</span>
              <strong className="text-slate-900">{issueDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Issuing Department</span>
              <strong className="text-slate-900">{task.department}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Verification Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Legally Valid
              </span>
            </div>
          </div>

          {/* Grantee Entity Details */}
          <div className="space-y-3 text-xs leading-relaxed border-t border-slate-100 pt-4">
            <p className="text-slate-700">
              This is to certify that an application for statutory approval made by{' '}
              <strong className="text-slate-950 font-bold">{startup.businessName}</strong> (Corporate Identity
              Number:{' '}
              <span className="font-mono font-semibold text-slate-900">{startup.cinOrRegistration}</span>),
              situated at industrial premises:
            </p>

            <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px]">
              Survey Plot: Industrial Unit No. 44, Phase II, MIDC Chakan, District {startup.district},{' '}
              {startup.state} - Sector: {startup.sector.replace('_', ' ').toUpperCase()} (
              {startup.scale.toUpperCase()} MSME)
            </div>

            <p className="text-slate-700">
              has been thoroughly scrutinized through the <strong>OneGov AI Unified Scrutiny Protocol</strong>.
              All mandatory technical drawings, effluent schemes, and site safety norms have been pre-validated
              and found compliant.
            </p>
          </div>

          {/* Conditions & Stipulations */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2 text-xs text-amber-950">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <span>Key Operating Conditions:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900">
              <li>Premises must strictly conform to approved connected power load of {startup.powerLoadHP} HP.</li>
              <li>Water consumption and zero liquid discharge parameters shall be maintained at 12 KLD max.</li>
              <li>Annual renewal or self-certification must be submitted 30 days prior to validity expiry.</li>
            </ul>
          </div>

          {/* Signatures & QR Section */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            {/* Visual QR Code Box */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-white border-2 border-slate-900 p-1 flex items-center justify-center rounded">
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-1">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          (i * 7) % 3 === 0 ? 'bg-white' : 'bg-transparent'
                        } rounded-[1px]`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 space-y-0.5">
                <div className="font-bold text-slate-800">Scan to Verify Authenticity</div>
                <div>Hash: SHA256-8e99b24...</div>
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Digital Public Infrastructure Verified
                </div>
              </div>
            </div>

            {/* Officer Signature */}
            <div className="text-right sm:text-right space-y-1">
              <div className="font-mono text-[11px] text-slate-400">
                [Digitally Signed via e-Sign NIC PKI]
              </div>
              <div className="font-bold text-slate-900">
                {task.officerAssigned || 'Authorized Competent Authority'}
              </div>
              <div className="text-slate-500 text-[11px]">{task.department}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                Timestamp: {issueDate} 14:32:10 UTC+05:30
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Form 4B · Consolidated Approval Notice
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
