import React, { useState } from 'react';
import { MASTER_DOCUMENTS } from '../data/regulatoryRules';
import {
  BookOpen,
  Search,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Laptop,
  CreditCard,
  ShoppingCart,
  HeartPulse,
  Zap,
  Factory,
  Layers,
  HelpCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { RequiredDocument, IndustrySector } from '../types';

export const DocumentExplorer: React.FC = () => {
  const [selectedStartupSector, setSelectedStartupSector] = useState<string>('software_it');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDoc, setActiveDoc] = useState<RequiredDocument | null>(
    MASTER_DOCUMENTS.find((d) => d.code === 'DOC_DPIIT_RECOGNITION') || MASTER_DOCUMENTS[0]
  );
  const [showStatusGuide, setShowStatusGuide] = useState(true);

  const startupSectors = [
    { id: 'software_it', label: 'IT Company & SaaS', icon: Laptop, tag: 'Tech & Cloud' },
    { id: 'fintech', label: 'FinTech & Lending', icon: CreditCard, tag: 'RBI & Banking' },
    { id: 'ecommerce_d2c', label: 'E-Commerce & D2C', icon: ShoppingCart, tag: 'Retail & Packaging' },
    { id: 'healthtech', label: 'HealthTech & Tele-Med', icon: HeartPulse, tag: 'Clinical & Privacy' },
    { id: 'cleantech_ev', label: 'CleanTech & EV', icon: Zap, tag: 'AIS & Battery' },
    { id: 'food_processing', label: 'Manufacturing / Food', icon: Factory, tag: 'FSSAI & Factories Act' },
    { id: 'all_sectors', label: 'All Businesses', icon: Layers, tag: 'Universal' },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'legal_entity', label: 'Legal & Corporate' },
    { id: 'identity', label: 'Identity & Tax' },
    { id: 'tax_labour', label: 'Labour & Employment' },
    { id: 'ip_legal', label: 'Intellectual Property (IP)' },
    { id: 'it_cybersecurity', label: 'Cybersecurity & Privacy' },
    { id: 'financial', label: 'Financial & Export' },
    { id: 'land_premises', label: 'Premises & Lease' },
    { id: 'technical_drawings', label: 'Technical Drawings' },
    { id: 'environmental', label: 'Pollution & EPR' },
    { id: 'safety', label: 'Safety & Hygiene' },
  ];

  const filteredDocs = MASTER_DOCUMENTS.filter((doc) => {
    // Sector filter
    let matchesSector = true;
    if (selectedStartupSector !== 'all_sectors') {
      if (selectedStartupSector === 'software_it') {
        matchesSector =
          doc.category === 'legal_entity' ||
          doc.category === 'identity' ||
          doc.category === 'tax_labour' ||
          doc.category === 'ip_legal' ||
          doc.category === 'it_cybersecurity' ||
          doc.category === 'financial' ||
          doc.code === 'DOC_COWORKING_AGREEMENT';
      } else if (selectedStartupSector === 'fintech') {
        matchesSector =
          doc.category === 'legal_entity' ||
          doc.category === 'identity' ||
          doc.category === 'tax_labour' ||
          doc.category === 'it_cybersecurity' ||
          doc.category === 'financial';
      } else if (selectedStartupSector === 'food_processing') {
        matchesSector =
          doc.category === 'legal_entity' ||
          doc.category === 'identity' ||
          doc.category === 'land_premises' ||
          doc.category === 'technical_drawings' ||
          doc.category === 'environmental' ||
          doc.category === 'safety';
      }
    }

    // Category filter
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    // Search filter
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSector && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Statutory Compliance Documentation &amp; Status Manual</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
          Startup Business Documents &amp; Lifecycle Status Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Statutory requirements vary fundamentally by startup model. An IT/SaaS company requires DPIIT Recognition, Shops &amp; Establishment Act, Professional Tax, and ISO 27001 data compliance, while manufacturing units require Factories Act DISH, Pollution Board CTE/CTO, and Fire Safety NOC.
        </p>

        {/* Sector Quick Switcher */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          {startupSectors.map((sec) => {
            const Icon = sec.icon;
            const isSelected = selectedStartupSector === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedStartupSector(sec.id);
                  const firstMatch = MASTER_DOCUMENTS.find((d) => {
                    if (sec.id === 'software_it') return d.code === 'DOC_DPIIT_RECOGNITION';
                    if (sec.id === 'food_processing') return d.code === 'DOC_FOOD_FSMS';
                    return true;
                  });
                  if (firstMatch) setActiveDoc(firstMatch);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Lifecycle Statuses Reference Box (Collapsible) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Document Lifecycle Status Reference Matrix
            </h3>
          </div>
          <button
            onClick={() => setShowStatusGuide(!showStatusGuide)}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            {showStatusGuide ? 'Collapse Guide' : 'Expand Guide'}
          </button>
        </div>

        {showStatusGuide && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>1. Pending Upload</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mandatory document not yet submitted. Prevents application submission to departments.
              </p>
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>2. In Review (OCR)</span>
              </div>
              <p className="text-[11px] text-indigo-800">
                Neural optical character recognition is extracting entities, validating signatures, and checking checksums.
              </p>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>3. Query Raised</span>
              </div>
              <p className="text-[11px] text-rose-800">
                Scrutinizing officer noted a discrepancy (e.g. name mismatch, missing seal, unnotarized lease). Immediate re-upload required.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>4. Verified &amp; Cleared</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Cryptographically approved. Ingested into the Single-Window Vault and shared across all parallel department desks.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name, code or authority..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none text-xs font-semibold">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-600">
            <span>Applicable Documents ({filteredDocs.length})</span>
            <span className="text-[11px] text-slate-400 capitalize font-normal">
              Sector: {selectedStartupSector.replace('_', ' ')}
            </span>
          </div>

          {filteredDocs.map((doc) => {
            const isSelected = activeDoc?.code === doc.code;
            return (
              <div
                key={doc.code}
                onClick={() => setActiveDoc(doc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-sm ring-1 ring-indigo-400/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">{doc.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{doc.description}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                    {doc.code}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                  <span>Authority: {doc.issuingAuthority}</span>
                  {doc.processingTimeEstimate && (
                    <span className="font-mono text-slate-600 font-semibold">{doc.processingTimeEstimate}</span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredDocs.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
              No documents matched the selected filters.
            </div>
          )}
        </div>

        {/* Document Specification Viewer */}
        <div className="lg:col-span-7">
          {activeDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 text-xs">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                      {activeDoc.code}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                      Category: {activeDoc.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-950 font-display">
                    {activeDoc.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {activeDoc.description}
                  </p>
                </div>
              </div>

              {/* Authority & Legal Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Issuing Body / Department</span>
                  <strong className="text-slate-900 block text-xs">{activeDoc.issuingAuthority}</strong>
                  {activeDoc.statuteAct && (
                    <span className="text-[10px] text-slate-500 block mt-0.5">Act: {activeDoc.statuteAct}</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Official Processing Timeline</span>
                  <strong className="text-slate-900 block text-xs">
                    {activeDoc.processingTimeEstimate || '3 - 7 Working Days'}
                  </strong>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Accepted Formats: {activeDoc.formatAccepted.join(', ')} (Max {activeDoc.maxSizeMB} MB)
                  </span>
                </div>
              </div>

              {/* Direct Government Application Link */}
              {activeDoc.portalUrl && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-indigo-950 font-medium">
                    <ExternalLink className="w-4 h-4 text-indigo-600" />
                    <span>Official Issuing Portal: <strong>{activeDoc.portalUrl}</strong></span>
                  </div>
                  <a
                    href={activeDoc.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-colors flex items-center gap-1"
                  >
                    <span>Open Govt Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Entities Extracted by Neural OCR */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Key Entities Extracted by Neural OCR &amp; Checked for Mismatches</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeDoc.extractedFields?.map((field) => (
                    <div
                      key={field.key}
                      className="p-3 bg-white border border-slate-200 rounded-lg space-y-0.5"
                    >
                      <span className="font-semibold text-slate-800 block text-xs">
                        {field.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Field Key: {field.key} ({field.expectedType})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Prevention Guidelines */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-amber-950">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4" />
                  <span>Common Scrutiny Rejection Triggers to Avoid:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900">
                  <li>Ensure company name matches character-for-character across MCA Certificate and PAN card.</li>
                  <li>Premises leases must be registered with sub-registrar or possess valid Landlord NOC and utility bill.</li>
                  <li>DPIIT Startup applications must submit pitch deck and clear note on innovative nature of product/service.</li>
                </ul>
              </div>

              {/* Download Sample Format */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">
                  Sample reference template available for inspection.
                </span>
                <button
                  onClick={() => alert(`Downloaded sample reference template for ${activeDoc.name}.`)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-colors text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sample Document Format</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a document to view statutory requirements and guidelines.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
