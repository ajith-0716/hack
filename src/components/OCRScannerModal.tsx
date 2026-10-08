import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { RequiredDocument, UploadedDocRecord } from '../types';

interface OCRScannerModalProps {
  document: RequiredDocument;
  existingUpload?: UploadedDocRecord;
  onSave: (record: UploadedDocRecord) => void;
  onClose: () => void;
}

export const OCRScannerModal: React.FC<OCRScannerModalProps> = ({
  document,
  existingUpload,
  onSave,
  onClose,
}) => {
  const [isScanning, setIsScanning] = useState(!existingUpload);
  const [scanProgress, setScanProgress] = useState(existingUpload ? 100 : 0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Default simulated extracted data based on document type
  const [extractedData, setExtractedData] = useState<Record<string, string>>(() => {
    if (existingUpload) return existingUpload.extractedData;

    switch (document.code) {
      case 'DOC_COI':
        return {
          cin: 'U15400MH2025PTC392811',
          companyName: 'AeroSprout AgriFoods Pvt Ltd',
          incDate: '2025-04-18',
          state: 'Maharashtra',
        };
      case 'DOC_PAN':
        return {
          pan: 'AAACA9921E',
          entityName: 'AeroSprout AgriFoods Private Limited',
          dateOfAllotment: '2025-04-22',
        };
      case 'DOC_LAND_LEASE':
        return {
          surveyNo: 'Plot No. C-44, Chakan MIDC Phase II',
          lessor: 'Maharashtra Industrial Development Corporation (MIDC)',
          area: '18500',
          tenure: '95',
        };
      case 'DOC_FACTORY_LAYOUT':
        return {
          builtUpArea: '8400',
          architectRegNo: 'COA/2014/61922',
          exitWidth: '2.4',
        };
      case 'DOC_PROJECT_REPORT':
        return {
          productDesc: 'Ready-to-eat Extruded Millet Snacks & Nutrition Bars',
          capitalOutlay: '480',
          powerLoad: '65',
        };
      case 'DOC_PCB_SCHEME':
        return {
          dischargeVolume: '12',
          emissionSource: 'Biomass Steam Boiler (600 kg/hr) + 125 kVA DG Set',
          wasteCat: 'Organic solid residue & Hazardous Sludge (Cat 35.3)',
        };
      case 'DOC_FSMS_PLAN':
        return {
          nablCertNo: 'TC-8941-2026-NABL',
          potabilityResult: 'Conforms to IS 10500:2012 Drinking Water Standards',
        };
      case 'DOC_FIRE_SPECS':
        return {
          tankCapacity: '150',
          hazardClass: 'Ordinary Hazard Group 2 (Industrial Processing)',
        };
      case 'DOC_POWER_ESTIMATE':
        return {
          connectedLoad: '65',
          contractDemand: '75',
        };
      default:
        return {
          documentTitle: document.name,
          verifiedDate: new Date().toISOString().split('T')[0],
          issuingAuthority: document.issuingAuthority,
        };
    }
  });

  const [confidenceScore, setConfidenceScore] = useState(
    existingUpload ? existingUpload.ocrConfidence : 98.4
  );
  const [digiLockerVerified, setDigiLockerVerified] = useState(
    existingUpload ? existingUpload.digiLockerVerified : true
  );

  useEffect(() => {
    if (!existingUpload && isScanning) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            return 100;
          }
          return prev + 25;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [existingUpload, isScanning]);

  const handleFieldChange = (key: string, value: string) => {
    setExtractedData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleSaveAndConfirm = () => {
    const record: UploadedDocRecord = {
      docId: existingUpload?.docId || `up-${Date.now()}`,
      docCode: document.code,
      fileName: document.sampleFileName || `${document.code}_Verified.pdf`,
      fileSize: '3.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'verified',
      ocrConfidence: confidenceScore,
      extractedData,
      digiLockerVerified,
      mismatchWarnings: [],
    };
    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{document.name}</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                  {document.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                OCR Optical Extraction &amp; Regulatory Pre-Validation Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  Running Neural OCR Document Scrutiny &amp; Text Alignment...
                </span>
                <span className="font-mono tabular-nums">{scanProgress}%</span>
              </div>
              <div className="w-full bg-indigo-200/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Validation Metrics Banner */}
          {!isScanning && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-emerald-800">OCR Extraction Confidence</div>
                  <div className="text-base font-bold text-emerald-950 font-mono tabular-nums">
                    {confidenceScore}%
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-blue-800">DigiLocker Verification</div>
                  <div className="text-xs font-semibold text-blue-950">
                    {digiLockerVerified ? 'Tamper-Proof MCA/Govt Seal' : 'Manual Upload'}
                  </div>
                </div>
              </div>

              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-purple-800">Inter-Dept Sharing</div>
                  <div className="text-xs font-semibold text-purple-950">
                    Upload Once, Reuse in 5 Depts
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Fields Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span>Extracted Document Entities</span>
                <span className="text-[11px] font-normal lowercase text-slate-500">
                  (Editable if OCR misread)
                </span>
              </h4>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Cross-Matching
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {document.extractedFields && document.extractedFields.length > 0 ? (
                document.extractedFields.map((field) => (
                  <div
                    key={field.key}
                    className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="sm:w-1/3">
                      <label className="text-xs font-semibold text-slate-700">
                        {field.label}
                      </label>
                      <p className="text-[11px] text-slate-400 font-mono">{field.key}</p>
                    </div>

                    <div className="sm:w-2/3 flex items-center gap-2">
                      <input
                        type="text"
                        value={extractedData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full text-xs font-medium font-mono text-slate-900 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(extractedData[field.key] || '', field.key)}
                        title="Copy text"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        {copiedKey === field.key ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-slate-600">
                  Document scanned successfully. Cryptographic signature and layout verified against state repository.
                </div>
              )}
            </div>
          </div>

          {/* Compliance Guarantee Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">DPDP Act 2023 &amp; Zero Re-Submission Guarantee:</strong>{' '}
              By confirming this verified document, it is encrypted and shared in parallel with{' '}
              <span className="font-semibold text-slate-700">
                District Industries Centre, Pollution Control Board, Fire &amp; Safety, and DISH
              </span>
              . You will not be asked to re-upload this file in any departmental window.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAndConfirm}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Confirm &amp; Link to Unified Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};
