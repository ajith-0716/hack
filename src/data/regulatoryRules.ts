import {
  IndustrySector,
  EnterpriseScale,
  BusinessStage,
  PollutionCategory,
  StartupProfile,
  RequiredDocument,
  StatutoryApproval,
} from '../types';

export const MASTER_DOCUMENTS: RequiredDocument[] = [
  // --- Legal Entity & Corporate Documents ---
  {
    id: 'doc-coi',
    code: 'DOC_COI',
    name: 'Certificate of Incorporation / RoC Registration (SPICe+)',
    category: 'legal_entity',
    description: 'Ministry of Corporate Affairs (MCA) certificate confirming legal corporate entity creation and CIN.',
    formatAccepted: ['PDF'],
    maxSizeMB: 5,
    isMandatory: true,
    issuingAuthority: 'Registrar of Companies (MCA)',
    statuteAct: 'Companies Act, 2013 / LLP Act, 2008',
    portalUrl: 'https://www.mca.gov.in',
    processingTimeEstimate: '3 - 5 Working Days',
    sampleFileName: 'Certificate_of_Incorporation_CIN.pdf',
    extractedFields: [
      { label: 'Corporate Identity No (CIN)', key: 'cin', expectedType: 'string' },
      { label: 'Company Name', key: 'companyName', expectedType: 'string' },
      { label: 'Incorporation Date', key: 'incDate', expectedType: 'date' },
      { label: 'Registered State', key: 'state', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-pan',
    code: 'DOC_PAN',
    name: 'Company Permanent Account Number (PAN) & TAN',
    category: 'identity',
    description: 'Income Tax Department PAN & TAN issued in corporate legal entity name.',
    formatAccepted: ['PDF', 'JPG', 'PNG'],
    maxSizeMB: 2,
    isMandatory: true,
    issuingAuthority: 'Income Tax Department (CBDT)',
    statuteAct: 'Income Tax Act, 1961',
    portalUrl: 'https://incometax.gov.in',
    processingTimeEstimate: '1 - 2 Working Days (Auto-issued with SPICe+)',
    sampleFileName: 'Company_PAN_Card.pdf',
    extractedFields: [
      { label: 'PAN Number', key: 'pan', expectedType: 'string' },
      { label: 'Entity Name', key: 'entityName', expectedType: 'string' },
      { label: 'Date of Allotment', key: 'dateOfAllotment', expectedType: 'date' },
    ],
  },

  // --- Startup & IT Specific Statutory Documents ---
  {
    id: 'doc-dpiit',
    code: 'DOC_DPIIT_RECOGNITION',
    name: 'DPIIT Startup India Recognition Certificate',
    category: 'legal_entity',
    description: 'Department for Promotion of Industry and Internal Trade (DPIIT) certificate granting Section 80-IAC 3-year income tax holiday, angel tax exemption, fast-tracked IPR patents, and self-certification under 9 labour laws.',
    formatAccepted: ['PDF'],
    maxSizeMB: 5,
    isMandatory: true,
    issuingAuthority: 'DPIIT, Ministry of Commerce & Industry',
    statuteAct: 'Startup India Action Plan / Finance Act',
    portalUrl: 'https://www.startupindia.gov.in',
    processingTimeEstimate: '2 - 4 Working Days',
    applicableSectors: ['software_it', 'fintech', 'healthtech', 'edtech', 'ecommerce_d2c', 'cleantech_ev'],
    sampleFileName: 'DPIIT_Startup_Recognition_Cert.pdf',
    extractedFields: [
      { label: 'DPIIT Certificate No', key: 'dpiitNo', expectedType: 'string' },
      { label: 'Recognition Date', key: 'recognitionDate', expectedType: 'date' },
      { label: 'Startup Entity Category', key: 'entityCategory', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-shops-est',
    code: 'DOC_SHOPS_EST',
    name: 'Shops & Commercial Establishments Act Registration',
    category: 'tax_labour',
    description: 'State Labour Department operating certificate for commercial offices, tech parks, and software firms regulating working hours, overtime, holidays, and employee registers.',
    formatAccepted: ['PDF'],
    maxSizeMB: 5,
    isMandatory: true,
    issuingAuthority: 'State Labour Commissionerate',
    statuteAct: 'State Shops and Commercial Establishments Act',
    portalUrl: 'https://shramsuvidha.gov.in',
    processingTimeEstimate: '3 - 7 Working Days',
    applicableSectors: ['software_it', 'fintech', 'healthtech', 'edtech', 'ecommerce_d2c'],
    sampleFileName: 'Shops_Establishment_Registration_Certificate.pdf',
    extractedFields: [
      { label: 'Registration Number', key: 'regNo', expectedType: 'string' },
      { label: 'Commercial Premises Address', key: 'premiseAddress', expectedType: 'string' },
      { label: 'Approved Headcount', key: 'headcount', expectedType: 'number' },
    ],
  },
  {
    id: 'doc-professional-tax',
    code: 'DOC_PROFESSIONAL_TAX',
    name: 'Professional Tax Enrolment (PTEC & PTRC)',
    category: 'tax_labour',
    description: 'Mandatory certificates: PTEC (for the company/directors) and PTRC (for deducting and depositing employee tax from salaries).',
    formatAccepted: ['PDF'],
    maxSizeMB: 3,
    isMandatory: true,
    issuingAuthority: 'State Commercial Taxes Department',
    statuteAct: 'State Tax on Professions, Trades and Employments Act',
    portalUrl: 'https://mahagst.gov.in',
    processingTimeEstimate: '2 - 3 Working Days',
    sampleFileName: 'Professional_Tax_PTEC_PTRC_Cert.pdf',
    extractedFields: [
      { label: 'PTEC Certificate No', key: 'ptecNo', expectedType: 'string' },
      { label: 'PTRC Certificate No', key: 'ptrcNo', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-epf-esic',
    code: 'DOC_EPF_ESIC',
    name: 'EPFO & ESIC Unified Social Security Registration',
    category: 'tax_labour',
    description: 'Unified Shram Suvidha code establishing Provident Fund and Employee State Insurance accounts for employee social welfare.',
    formatAccepted: ['PDF'],
    maxSizeMB: 4,
    isMandatory: true,
    issuingAuthority: 'Ministry of Labour & Employment / EPFO / ESIC',
    statuteAct: 'EPF & MP Act, 1952 / ESI Act, 1948',
    portalUrl: 'https://shramsuvidha.gov.in',
    processingTimeEstimate: '1 - 2 Working Days',
    sampleFileName: 'EPFO_ESIC_Unified_Registration.pdf',
    extractedFields: [
      { label: 'EPF Establishment Code', key: 'epfCode', expectedType: 'string' },
      { label: 'ESIC 17-Digit Code', key: 'esicCode', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-trademark-ip',
    code: 'DOC_TRADEMARK_IP',
    name: 'Intellectual Property Trademark Filing (Form TM-A)',
    category: 'ip_legal',
    description: 'Trademark registry application receipt protecting the startup brand name, proprietary SaaS software name, logo, and copyright under Class 9 & Class 42.',
    formatAccepted: ['PDF'],
    maxSizeMB: 5,
    isMandatory: false,
    issuingAuthority: 'Controller General of Patents, Designs & Trademarks (IP India)',
    statuteAct: 'Trade Marks Act, 1999',
    portalUrl: 'https://ipindia.gov.in',
    processingTimeEstimate: 'Immediate (Instant TM Filing Receipt)',
    sampleFileName: 'Trademark_TM_A_Filing_Receipt.pdf',
    extractedFields: [
      { label: 'Application Number', key: 'appNo', expectedType: 'string' },
      { label: 'Trademark Wordmark', key: 'wordmark', expectedType: 'string' },
      { label: 'Nice Classification (Class)', key: 'niceClass', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-iso-cybersec',
    code: 'DOC_ISO_CYBERSEC',
    name: 'ISO/IEC 27001 Security & DPDP Act Data Privacy Audit',
    category: 'it_cybersecurity',
    description: 'Information Security Management System (ISMS) certificate & compliance audit report guaranteeing enterprise data security, SOC-2 readiness, and Indian DPDP Act 2023 compliance.',
    formatAccepted: ['PDF'],
    maxSizeMB: 8,
    isMandatory: false,
    issuingAuthority: 'Accredited Certification Body / CERT-In Empanelled Auditor',
    statuteAct: 'Digital Personal Data Protection Act, 2023 / ISO 27001',
    portalUrl: 'https://cert-in.org.in',
    processingTimeEstimate: '10 - 20 Working Days',
    sampleFileName: 'ISO_27001_Data_Security_Audit.pdf',
    extractedFields: [
      { label: 'Certificate / Audit ID', key: 'certId', expectedType: 'string' },
      { label: 'Audited Scope', key: 'scope', expectedType: 'string' },
      { label: 'Validity Period', key: 'validity', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-stpi-lut',
    code: 'DOC_STPI_LUT',
    name: 'GST Export LUT (Letter of Undertaking) & Softex Clearance',
    category: 'financial',
    description: 'Form GST RFD-11 LUT allowing zero-rated export of IT services and SaaS subscriptions without payment of integrated GST, plus RBI Softex filing clearance.',
    formatAccepted: ['PDF'],
    maxSizeMB: 4,
    isMandatory: false,
    issuingAuthority: 'GST Network / Software Technology Parks of India (STPI)',
    statuteAct: 'CGST Act, 2017 - Rule 96A / Foreign Exchange Management Act (FEMA)',
    portalUrl: 'https://www.gst.gov.in',
    processingTimeEstimate: '1 - 2 Working Days (Instant Online LUT)',
    sampleFileName: 'GST_LUT_Form_RFD_11_Export.pdf',
    extractedFields: [
      { label: 'ARN Number', key: 'arnNo', expectedType: 'string' },
      { label: 'Financial Year Validity', key: 'financialYear', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-coworking',
    code: 'DOC_COWORKING_AGREEMENT',
    name: 'Registered Commercial Lease / Co-working Space Agreement & Landlord NOC',
    category: 'land_premises',
    description: 'Lease deed for commercial IT park, or Co-working Space Agreement (WeWork, Awfis, 91springboard) along with utility bill and Landlord No Objection Certificate (NOC).',
    formatAccepted: ['PDF'],
    maxSizeMB: 10,
    isMandatory: true,
    issuingAuthority: 'Commercial Tech Park Lessor / Sub-Registrar',
    statuteAct: 'Indian Contract Act & Transfer of Property Act',
    portalUrl: 'https://gras.mahakosh.gov.in',
    processingTimeEstimate: '1 - 3 Working Days',
    sampleFileName: 'TechPark_Commercial_Lease_NOC.pdf',
    extractedFields: [
      { label: 'Office / Seat Number', key: 'officeNo', expectedType: 'string' },
      { label: 'Commercial Park Name', key: 'parkName', expectedType: 'string' },
      { label: 'Lease Tenure (Months)', key: 'tenure', expectedType: 'number' },
    ],
  },

  // --- Manufacturing & Physical Premises Documents ---
  {
    id: 'doc-lease',
    code: 'DOC_LAND_LEASE',
    name: 'Registered Industrial Land Deed / MIDC Plot Allotment Agreement',
    category: 'land_premises',
    description: 'Registered title deed or long-term lease agreement with survey/khasra number from state industrial development corporation.',
    formatAccepted: ['PDF'],
    maxSizeMB: 15,
    isMandatory: true,
    issuingAuthority: 'State Revenue / Sub-Registrar / Industrial Development Corp (SIDC)',
    statuteAct: 'State Industrial Development Act',
    portalUrl: 'https://midcindia.org',
    processingTimeEstimate: '5 - 15 Working Days',
    sampleFileName: 'Registered_Industrial_Lease_Agreement.pdf',
    extractedFields: [
      { label: 'Plot / Survey Number', key: 'surveyNo', expectedType: 'string' },
      { label: 'Lessor / Authority Name', key: 'lessor', expectedType: 'string' },
      { label: 'Total Land Area (Sq.Ft)', key: 'area', expectedType: 'number' },
      { label: 'Lease Tenure (Years)', key: 'tenure', expectedType: 'number' },
    ],
  },
  {
    id: 'doc-layout',
    code: 'DOC_FACTORY_LAYOUT',
    name: 'Architectural Factory Layout & Structural Blueprint',
    category: 'technical_drawings',
    description: 'Blueprint signed by licensed structural engineer showing machinery placement, emergency exits, and ventilation.',
    formatAccepted: ['PDF', 'DWG'],
    maxSizeMB: 20,
    isMandatory: true,
    issuingAuthority: 'Licensed Chartered Structural Engineer & Town Planner',
    statuteAct: 'The Factories Act, 1948 - Section 6',
    portalUrl: 'https://dish.maharashtra.gov.in',
    processingTimeEstimate: '10 - 21 Working Days',
    sampleFileName: 'Factory_Layout_Drawing_Signed.pdf',
    extractedFields: [
      { label: 'Built-Up Area (Sq.Ft)', key: 'builtUpArea', expectedType: 'number' },
      { label: 'Licensed Architect Reg No', key: 'architectRegNo', expectedType: 'string' },
      { label: 'Fire Exit Width (Meters)', key: 'exitWidth', expectedType: 'number' },
    ],
  },
  {
    id: 'doc-project-report',
    code: 'DOC_PROJECT_REPORT',
    name: 'Detailed Project Report & Manufacturing Process Flow',
    category: 'technical_drawings',
    description: 'Step-by-step raw material inputs, manufacturing stages, machinery specs, power & water balance.',
    formatAccepted: ['PDF'],
    maxSizeMB: 10,
    isMandatory: true,
    issuingAuthority: 'Authorized Technical Consultant / Chartered Engineer',
    statuteAct: 'Industrial Policy & MSMED Act',
    portalUrl: 'https://msme.gov.in',
    processingTimeEstimate: '5 - 10 Working Days',
    sampleFileName: 'Detailed_Project_Report_Process_Flow.pdf',
    extractedFields: [
      { label: 'Product Description', key: 'productDesc', expectedType: 'string' },
      { label: 'Capital Outlay (₹ Lakhs)', key: 'capitalOutlay', expectedType: 'number' },
      { label: 'Connected Power Load (HP)', key: 'powerLoad', expectedType: 'number' },
    ],
  },
  {
    id: 'doc-pollution-mgmt',
    code: 'DOC_PCB_SCHEME',
    name: 'Effluent Treatment & Emission Control Scheme',
    category: 'environmental',
    description: 'ETP / STP schematics, stack emission height, and hazardous waste containment plan.',
    formatAccepted: ['PDF'],
    maxSizeMB: 10,
    isMandatory: false,
    issuingAuthority: 'MoEFCC / Accredited Environmental Auditor',
    statuteAct: 'Water Act 1974 & Air Act 1981',
    portalUrl: 'https://mpcb.gov.in',
    processingTimeEstimate: '15 - 30 Working Days',
    sampleFileName: 'ETP_Pollution_Mitigation_Plan.pdf',
    extractedFields: [
      { label: 'Effluent Discharge (KLD)', key: 'dischargeVolume', expectedType: 'number' },
      { label: 'Air Emission Sources', key: 'emissionSource', expectedType: 'string' },
      { label: 'Solid Waste Category', key: 'wasteCat', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-fire-specs',
    code: 'DOC_FIRE_SPECS',
    name: 'Fire Protection System Drawing & Hydraulic Calculation',
    category: 'safety',
    description: 'Hydrant piping, riser layout, sprinkler points, hose reels, and underground water reservoir capacity.',
    formatAccepted: ['PDF'],
    maxSizeMB: 10,
    isMandatory: false,
    issuingAuthority: 'Certified Fire Safety Auditor / NBC Part IV Consultant',
    statuteAct: 'National Building Code 2016 Part IV',
    portalUrl: 'https://mahafireservice.gov.in',
    processingTimeEstimate: '10 - 15 Working Days',
    sampleFileName: 'Fire_Protection_Hydrant_Layout.pdf',
    extractedFields: [
      { label: 'Underground Tank Capacity (KL)', key: 'tankCapacity', expectedType: 'number' },
      { label: 'NBC Hazard Classification', key: 'hazardClass', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-food-fsms',
    code: 'DOC_FSMS_PLAN',
    name: 'Food Safety Management Plan & Water Potability Test',
    category: 'safety',
    description: 'NABL accredited laboratory potable water test report and ISO 22000 / HACCP flow diagram.',
    formatAccepted: ['PDF'],
    maxSizeMB: 8,
    isMandatory: false,
    issuingAuthority: 'NABL Accredited Testing Laboratory',
    statuteAct: 'Food Safety and Standards Act, 2006',
    portalUrl: 'https://foscos.fssai.gov.in',
    processingTimeEstimate: '7 - 14 Working Days',
    sampleFileName: 'NABL_Water_Test_FSMS_Plan.pdf',
    extractedFields: [
      { label: 'NABL Test Certificate No', key: 'nablCertNo', expectedType: 'string' },
      { label: 'Water Potability Result', key: 'potabilityResult', expectedType: 'string' },
    ],
  },
  {
    id: 'doc-power-sanction',
    code: 'DOC_POWER_ESTIMATE',
    name: 'Electrical Single Line Diagram (SLD) & Load Estimate',
    category: 'technical_drawings',
    description: 'Sub-station layout, transformer ratings, switchgear ratings, and SLD certified by electrical supervisor.',
    formatAccepted: ['PDF'],
    maxSizeMB: 5,
    isMandatory: false,
    issuingAuthority: 'Licensed Electrical Contractor (Class A)',
    statuteAct: 'Electricity Act, 2003',
    portalUrl: 'https://mahadiscom.in',
    processingTimeEstimate: '7 - 14 Working Days',
    sampleFileName: 'Single_Line_Diagram_Electrical_Load.pdf',
    extractedFields: [
      { label: 'Connected Load (HP/kVA)', key: 'connectedLoad', expectedType: 'number' },
      { label: 'Contract Demand (kVA)', key: 'contractDemand', expectedType: 'number' },
    ],
  },
];

export const MASTER_APPROVALS: StatutoryApproval[] = [
  // --- Core Startup & Digital Economy Clearances ---
  {
    id: 'appr-dpiit',
    approvalCode: 'DPIIT_STARTUP_INDIA',
    title: 'DPIIT Startup India Recognition & 80-IAC Tax Exemption',
    department: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    statuteAct: 'Startup India Initiative / Finance Act Section 80-IAC',
    rationale: 'Grants 3-year 100% income tax exemption, self-certification under 9 labour and environmental laws, and 80% rebate on patent filings.',
    slaDays: 4,
    governmentFeeINR: 0,
    riskCategory: 'low',
    stageRequired: ['ideation', 'pre_construction', 'pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_PAN', 'DOC_DPIIT_RECOGNITION'],
    prerequisites: [],
    canRunInParallelWith: ['MSME_UDYAM', 'GST_REG', 'SHOPS_ESTABLISHMENT'],
    validityYears: 10,
    isMandatory: true,
  },
  {
    id: 'appr-shops-est',
    approvalCode: 'SHOPS_ESTABLISHMENT',
    title: 'Shops & Commercial Establishments Act Registration',
    department: 'State Labour Commissionerate',
    statuteAct: 'State Shops & Commercial Establishments Act',
    rationale: 'Primary legal operating permit for IT companies, SaaS startups, tech consultancies, and commercial offices. Regulates work hours, employee rosters, and holidays.',
    slaDays: 5,
    governmentFeeINR: 1200,
    riskCategory: 'low',
    stageRequired: ['ideation', 'pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_PAN', 'DOC_COWORKING_AGREEMENT'],
    prerequisites: [],
    canRunInParallelWith: ['DPIIT_STARTUP_INDIA', 'MSME_UDYAM', 'PROFESSIONAL_TAX_PTEC'],
    validityYears: 5,
    isMandatory: true,
  },
  {
    id: 'appr-pt-ptec',
    approvalCode: 'PROFESSIONAL_TAX_PTEC',
    title: 'Professional Tax Registration (PTEC & PTRC)',
    department: 'State Department of Commercial Taxes',
    statuteAct: 'State Tax on Professions Act',
    rationale: 'Mandatory certificate for company tax liability (PTEC) and employer withholding tax on salaried staff (PTRC).',
    slaDays: 3,
    governmentFeeINR: 2500,
    riskCategory: 'low',
    stageRequired: ['ideation', 'pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_PAN', 'DOC_COWORKING_AGREEMENT'],
    prerequisites: [],
    canRunInParallelWith: ['SHOPS_ESTABLISHMENT', 'GST_REG'],
    validityYears: 99,
    isMandatory: true,
  },
  {
    id: 'appr-epfo-esic',
    approvalCode: 'EPFO_ESIC_REG',
    title: 'EPFO & ESIC Unified Social Security Registration',
    department: 'Ministry of Labour & Employment (Shram Suvidha)',
    statuteAct: 'Employees Provident Fund Act 1952 & ESI Act 1948',
    rationale: 'Mandatory registration for retirement pension, provident fund, and medical insurance once employee headcount threshold is reached.',
    slaDays: 2,
    governmentFeeINR: 0,
    riskCategory: 'low',
    stageRequired: ['ideation', 'pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_PAN'],
    prerequisites: [],
    canRunInParallelWith: ['SHOPS_ESTABLISHMENT', 'PROFESSIONAL_TAX_PTEC'],
    validityYears: 99,
    isMandatory: true,
  },
  {
    id: 'appr-trademark',
    approvalCode: 'TRADEMARK_REGISTRATION',
    title: 'Intellectual Property Trademark Registration (Class 9 / 42)',
    department: 'Controller General of Patents, Designs & Trademarks',
    statuteAct: 'Trade Marks Act, 1999',
    rationale: 'Secures brand, algorithm, software trademark, and source code copyright protection against infringement.',
    slaDays: 3,
    governmentFeeINR: 4500,
    riskCategory: 'low',
    stageRequired: ['ideation', 'pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_TRADEMARK_IP'],
    prerequisites: [],
    canRunInParallelWith: ['DPIIT_STARTUP_INDIA'],
    validityYears: 10,
    isMandatory: false,
  },
  {
    id: 'appr-gst-lut',
    approvalCode: 'GST_LUT_EXPORT',
    title: 'GST Letter of Undertaking (LUT) for IT Software Exports',
    department: 'Central Board of Indirect Taxes & Customs (CBIC)',
    statuteAct: 'CGST Act 2017 - Rule 96A',
    rationale: 'Allows zero-rated software exports and overseas client billing without blockage of working capital through integrated tax.',
    slaDays: 1,
    governmentFeeINR: 0,
    riskCategory: 'low',
    stageRequired: ['ideation', 'pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_PAN', 'DOC_COI'],
    prerequisites: ['GST_REG'],
    canRunInParallelWith: ['SHOPS_ESTABLISHMENT'],
    validityYears: 1,
    isMandatory: false,
  },
  {
    id: 'appr-iso-27001',
    approvalCode: 'ISO_27001_CERT',
    title: 'ISO/IEC 27001 Information Security & DPDP Compliance',
    department: 'Standardization Testing & Quality Certification (STQC) / CERT-In',
    statuteAct: 'Digital Personal Data Protection Act 2023 / ISO 27001',
    rationale: 'Enterprise requirement for B2B SaaS startups, cloud platforms, and fintechs to safeguard user privacy and secure customer data.',
    slaDays: 14,
    governmentFeeINR: 15000,
    riskCategory: 'medium',
    stageRequired: ['pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_ISO_CYBERSEC'],
    prerequisites: [],
    canRunInParallelWith: ['SHOPS_ESTABLISHMENT'],
    validityYears: 3,
    isMandatory: false,
  },

  // --- Foundational Business & Industrial Clearances ---
  {
    id: 'appr-udyam',
    approvalCode: 'MSME_UDYAM',
    title: 'Udyam Registration Certificate',
    department: 'District Industries Centre (DIC) / Ministry of MSME',
    statuteAct: 'MSMED Act, 2006',
    rationale: 'Mandatory base recognition for MSME subsidies, priority bank lending, collateral-free credit, and single-window fast track.',
    slaDays: 2,
    governmentFeeINR: 0,
    riskCategory: 'low',
    stageRequired: ['ideation', 'pre_construction', 'pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_PAN'],
    prerequisites: [],
    canRunInParallelWith: ['GST_REG', 'PCB_CTE', 'FIRE_PROVISIONAL', 'DPIIT_STARTUP_INDIA'],
    validityYears: 99,
    isMandatory: true,
  },
  {
    id: 'appr-gst',
    approvalCode: 'GST_REG',
    title: 'Goods & Services Tax Registration (GSTIN)',
    department: 'Central Board of Indirect Taxes & Customs / State GST',
    statuteAct: 'CGST & SGST Act, 2017',
    rationale: 'Required for commercial invoicing, input tax credit, and domestic and international trade.',
    slaDays: 3,
    governmentFeeINR: 0,
    riskCategory: 'low',
    stageRequired: ['ideation', 'pre_construction', 'pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_PAN'],
    prerequisites: [],
    canRunInParallelWith: ['MSME_UDYAM', 'PCB_CTE'],
    validityYears: 99,
    isMandatory: true,
  },
  {
    id: 'appr-factory-plan',
    approvalCode: 'DISH_PLAN_APPROVAL',
    title: 'Factory Building Plan Approval',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    statuteAct: 'The Factories Act, 1948 - Section 6',
    rationale: 'Mandatory scrutiny of shopfloor heights, airspace per worker, light, ventilation, and emergency egress.',
    slaDays: 21,
    governmentFeeINR: 3500,
    riskCategory: 'medium',
    stageRequired: ['pre_construction', 'pre_operation'],
    requiredDocCodes: ['DOC_LAND_LEASE', 'DOC_FACTORY_LAYOUT', 'DOC_PROJECT_REPORT'],
    prerequisites: [],
    canRunInParallelWith: ['PCB_CTE', 'FIRE_PROVISIONAL'],
    validityYears: 5,
    isMandatory: true,
  },
  {
    id: 'appr-pcb-cte',
    approvalCode: 'PCB_CTE',
    title: 'Consent to Establish (CTE / NOC)',
    department: 'State Pollution Control Board (SPCB)',
    statuteAct: 'Water Act 1974 & Air Act 1981',
    rationale: 'Required prior to initiating civil construction to ensure adequate pollution abatement facilities.',
    slaDays: 30,
    governmentFeeINR: 12500,
    riskCategory: 'high',
    stageRequired: ['pre_construction'],
    requiredDocCodes: ['DOC_LAND_LEASE', 'DOC_FACTORY_LAYOUT', 'DOC_PROJECT_REPORT', 'DOC_PCB_SCHEME'],
    prerequisites: [],
    canRunInParallelWith: ['DISH_PLAN_APPROVAL', 'FIRE_PROVISIONAL'],
    validityYears: 5,
    isMandatory: true,
  },
  {
    id: 'appr-fire-provisional',
    approvalCode: 'FIRE_PROVISIONAL',
    title: 'Provisional Fire Safety NOC',
    department: 'State Fire & Emergency Services',
    statuteAct: 'National Building Code (NBC Part IV) / State Fire Force Act',
    rationale: 'Evaluates architectural blueprints for setback distances, fire tender driveways, sprinkler layout, and hydrants.',
    slaDays: 15,
    governmentFeeINR: 5000,
    riskCategory: 'medium',
    stageRequired: ['pre_construction'],
    requiredDocCodes: ['DOC_FACTORY_LAYOUT', 'DOC_FIRE_SPECS'],
    prerequisites: [],
    canRunInParallelWith: ['PCB_CTE', 'DISH_PLAN_APPROVAL'],
    validityYears: 2,
    isMandatory: true,
  },
  {
    id: 'appr-power-sanction',
    approvalCode: 'DISCOM_POWER',
    title: 'Industrial High/Low Tension Power Load Sanction',
    department: 'State Electricity Distribution Co. (DISCOM) / CEIG',
    statuteAct: 'Electricity Act, 2003',
    rationale: 'Sanction and energization of dedicated electrical feed transformer and meter for machinery load demand.',
    slaDays: 14,
    governmentFeeINR: 7500,
    riskCategory: 'low',
    stageRequired: ['pre_construction', 'pre_operation'],
    requiredDocCodes: ['DOC_LAND_LEASE', 'DOC_POWER_ESTIMATE'],
    prerequisites: ['DISH_PLAN_APPROVAL'],
    canRunInParallelWith: ['PCB_CTO'],
    validityYears: 99,
    isMandatory: true,
  },
  {
    id: 'appr-pcb-cto',
    approvalCode: 'PCB_CTO',
    title: 'Consent to Operate (CTO)',
    department: 'State Pollution Control Board (SPCB)',
    statuteAct: 'Water Act 1974, Air Act 1981, Hazardous Waste Rules 2016',
    rationale: 'Issued upon physical inspection confirming that pollution control equipment is fully erected and operational.',
    slaDays: 30,
    governmentFeeINR: 18000,
    riskCategory: 'high',
    stageRequired: ['pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_PCB_SCHEME'],
    prerequisites: ['PCB_CTE'],
    canRunInParallelWith: ['FIRE_FINAL_NOC', 'FACTORY_LICENSE'],
    validityYears: 5,
    isMandatory: true,
  },
  {
    id: 'appr-fire-final',
    approvalCode: 'FIRE_FINAL_NOC',
    title: 'Final Fire Safety Occupancy Certificate',
    department: 'State Fire & Emergency Services',
    statuteAct: 'Fire Safety Act & NBC 2016 Part IV',
    rationale: 'Physical live test of hydrants, diesel generator back-up pump, alarm sirens, and smoke dampers before factory premises occupancy.',
    slaDays: 14,
    governmentFeeINR: 4000,
    riskCategory: 'medium',
    stageRequired: ['pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_FIRE_SPECS'],
    prerequisites: ['FIRE_PROVISIONAL'],
    canRunInParallelWith: ['PCB_CTO', 'FACTORY_LICENSE'],
    validityYears: 1,
    isMandatory: true,
  },
  {
    id: 'appr-factory-license',
    approvalCode: 'FACTORY_LICENSE',
    title: 'Factory License under Factories Act 1948',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    statuteAct: 'The Factories Act, 1948 - Section 7',
    rationale: 'Statutory operating permit for manufacturing units employing 10+ workers with power, or 20+ workers without power.',
    slaDays: 20,
    governmentFeeINR: 6000,
    riskCategory: 'high',
    stageRequired: ['pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_FACTORY_LAYOUT', 'DOC_PROJECT_REPORT'],
    prerequisites: ['DISH_PLAN_APPROVAL'],
    canRunInParallelWith: ['PCB_CTO', 'FIRE_FINAL_NOC'],
    validityYears: 3,
    isMandatory: true,
  },
  {
    id: 'appr-fssai',
    approvalCode: 'FSSAI_MFG',
    title: 'FSSAI Central / State Food Manufacturing License',
    department: 'Food Safety and Standards Authority of India (FSSAI)',
    statuteAct: 'Food Safety and Standards Act, 2006',
    rationale: 'Compulsory for manufacturing, processing, packaging, or storage of any consumable food or beverage product.',
    slaDays: 25,
    governmentFeeINR: 7500,
    riskCategory: 'high',
    stageRequired: ['pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_FSMS_PLAN', 'DOC_FACTORY_LAYOUT', 'DOC_COI'],
    prerequisites: ['PCB_CTO'],
    canRunInParallelWith: ['FACTORY_LICENSE'],
    validityYears: 5,
    isMandatory: false,
  },
  {
    id: 'appr-boiler',
    approvalCode: 'BOILER_REG',
    title: 'Steam Boiler Registration & Inspection Certificate',
    department: 'Inspectorate of Steam Boilers',
    statuteAct: 'The Indian Boilers Act, 1923',
    rationale: 'Hydraulic pressure test and mountings inspection for steam generation vessels exceeding 25 liters capacity.',
    slaDays: 14,
    governmentFeeINR: 5500,
    riskCategory: 'high',
    stageRequired: ['pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_PROJECT_REPORT'],
    prerequisites: ['DISH_PLAN_APPROVAL'],
    canRunInParallelWith: ['PCB_CTO'],
    validityYears: 1,
    isMandatory: false,
  },
  {
    id: 'appr-trade-license',
    approvalCode: 'MUNICIPAL_TRADE',
    title: 'Municipal / Panchayat Health & Trade License',
    department: 'Urban Local Body / Municipal Corporation / Village Panchayat',
    statuteAct: 'Municipal Corporation Act / Panchayati Raj Act',
    rationale: 'Local civic authorization for commercial manufacturing activity within jurisdiction.',
    slaDays: 10,
    governmentFeeINR: 3000,
    riskCategory: 'low',
    stageRequired: ['pre_operation', 'operating', 'expansion'],
    requiredDocCodes: ['DOC_COI', 'DOC_LAND_LEASE'],
    prerequisites: [],
    canRunInParallelWith: ['FACTORY_LICENSE'],
    validityYears: 1,
    isMandatory: true,
  },
];

export function evaluateRegulatoryChecklist(profile: StartupProfile): {
  approvals: (StatutoryApproval & { specificRationale: string; isApplicable: boolean })[];
  requiredDocs: RequiredDocument[];
  riskRating: 'low' | 'medium' | 'high';
  estimatedTotalGovFees: number;
  criticalPathDays: number;
} {
  const isFood = profile.sector === 'food_processing';
  const isHeavyOrPharma =
    profile.sector === 'pharmaceuticals' ||
    profile.sector === 'heavy_engineering' ||
    profile.sector === 'chemical_plastics';
  const isSoftwareIT =
    profile.sector === 'software_it' ||
    profile.sector === 'fintech' ||
    profile.sector === 'edtech';
  const isFintech = profile.sector === 'fintech';
  const isEcommerce = profile.sector === 'ecommerce_d2c';
  const isHealthTech = profile.sector === 'healthtech';
  const isCleanTechEV = profile.sector === 'cleantech_ev';

  const isHighPollution = profile.pollutionCategory === 'orange' || profile.pollutionCategory === 'red';
  const isWhiteCategory = profile.pollutionCategory === 'white';
  const hasWorkersAboveLimit = profile.workforceCount >= 10 && profile.powerLoadHP > 0;
  const isPreConstruction = profile.stage === 'pre_construction' || profile.stage === 'ideation';
  const isOperationalPhase = profile.stage === 'pre_operation' || profile.stage === 'operating' || profile.stage === 'expansion';

  const evaluated = MASTER_APPROVALS.map((approval) => {
    let applicable = false;
    let rationale = approval.rationale;

    switch (approval.approvalCode) {
      // --- Digital Economy & Tech Startup Clearances ---
      case 'DPIIT_STARTUP_INDIA':
        applicable = profile.scale !== 'large';
        rationale = applicable
          ? `Applicable: ${profile.businessName} qualifies as an innovative startup under DPIIT for 80-IAC tax holiday and fast-track IP.`
          : 'Large established enterprises with >₹100 Cr revenue are not eligible for DPIIT Startup India status.';
        break;

      case 'SHOPS_ESTABLISHMENT':
        applicable = isSoftwareIT || isEcommerce || isHealthTech || isFintech || profile.builtUpAreaSqFt > 0;
        rationale = applicable
          ? `Mandatory statutory operating certificate under State Shops & Commercial Establishments Act for office in ${profile.district}, ${profile.state}.`
          : 'Operating under standalone factory act.';
        break;

      case 'PROFESSIONAL_TAX_PTEC':
        applicable = profile.workforceCount >= 1;
        rationale = `Compulsory for employer entity (PTEC) and ${profile.workforceCount} salaried team members (PTRC) in ${profile.state}.`;
        break;

      case 'EPFO_ESIC_REG':
        applicable = profile.workforceCount >= 10;
        rationale = applicable
          ? `Mandatory because workforce of ${profile.workforceCount} exceeds statutory social security threshold (10+ ESIC / 20+ EPFO).`
          : `Voluntary at current workforce of ${profile.workforceCount} (mandatory once team reaches 10+ employees).`;
        break;

      case 'TRADEMARK_REGISTRATION':
        applicable = isSoftwareIT || isFintech || isEcommerce || isHealthTech;
        rationale = applicable
          ? `Highly recommended for tech startup to secure proprietary SaaS brand, codebase copyright, and trademark under Nice Class 9/42.`
          : 'Standard trademark registration.';
        break;

      case 'GST_LUT_EXPORT':
        applicable = isSoftwareIT || isFintech;
        rationale = applicable
          ? 'Required for zero-rated IT service exports to global clients without paying 18% IGST upfront.'
          : 'Not applicable for domestic operations.';
        break;

      case 'ISO_27001_CERT':
        applicable = isSoftwareIT || isFintech || isHealthTech;
        rationale = applicable
          ? 'Required by enterprise B2B customers, financial institutions, and Indian DPDP Act 2023 for data privacy & SOC-2 compliance.'
          : 'Optional for traditional manufacturing.';
        break;

      // --- Foundational Approvals ---
      case 'MSME_UDYAM':
        applicable = profile.scale !== 'large';
        rationale = applicable
          ? `Applicable because investment of ₹${profile.capitalInvestmentLakhs} Lakhs falls under ${profile.scale.toUpperCase()} MSME classification.`
          : 'Large enterprises (>₹50 Cr) do not qualify for MSME Udyam, requiring Industrial Entrepreneurs Memorandum (IEM).';
        break;

      case 'GST_REG':
        applicable = true;
        rationale = 'Mandatory for commercial invoicing, input tax credit, and business banking.';
        break;

      // --- Manufacturing & Physical Plant Clearances ---
      case 'DISH_PLAN_APPROVAL':
        if (isSoftwareIT) {
          applicable = false;
          rationale = 'IT / Software services operating in commercial tech parks are exempt from DISH Factory Act (governed by Shops & Est Act).';
        } else {
          applicable = hasWorkersAboveLimit || profile.builtUpAreaSqFt > 2000;
          rationale = `Applicable as workforce of ${profile.workforceCount} with ${profile.powerLoadHP} HP power falls under Section 2(m)(i) of Factories Act 1948.`;
        }
        break;

      case 'PCB_CTE':
        if (isSoftwareIT || isWhiteCategory) {
          applicable = false;
          rationale = `${isWhiteCategory ? 'White Category' : 'IT Sector'} enterprises are exempt from Consent to Establish (CTE) under MoEFCC ease of business notification.`;
        } else {
          applicable = isPreConstruction || profile.stage === 'ideation';
          rationale = `Required prior to construction for ${profile.pollutionCategory.toUpperCase()} category manufacturing.`;
        }
        break;

      case 'PCB_CTO':
        if (isSoftwareIT || isWhiteCategory) {
          applicable = false;
          rationale = 'Exempt from CTO requirement under non-polluting category.';
        } else {
          applicable = isOperationalPhase;
          rationale = `Mandatory before commercial production starts for ${profile.pollutionCategory.toUpperCase()} category plants.`;
        }
        break;

      case 'FIRE_PROVISIONAL':
        if (isSoftwareIT) {
          applicable = false;
          rationale = 'IT offices in compliant commercial IT parks are covered by the master tech park Fire NOC.';
        } else {
          applicable =
            (isPreConstruction || profile.stage === 'ideation') &&
            (profile.builtUpAreaSqFt > 2500 || profile.hazardousMaterials || isHeavyOrPharma);
          rationale = applicable
            ? `Required because built-up area (${profile.builtUpAreaSqFt} sq.ft) or hazard profile requires National Building Code Fire Clearance.`
            : 'Built-up area under 2500 sq.ft in non-hazardous category does not require provisional fire NOC.';
        }
        break;

      case 'FIRE_FINAL_NOC':
        if (isSoftwareIT) {
          applicable = false;
          rationale = 'Master IT building fire certificate satisfies commercial requirements.';
        } else {
          applicable =
            isOperationalPhase &&
            (profile.builtUpAreaSqFt > 2500 || profile.hazardousMaterials || isHeavyOrPharma);
          rationale = applicable
            ? 'Mandatory site audit of fire pumps, hydrants, and egress before commercial production.'
            : 'Exempt due to small premises size and low hazard classification.';
        }
        break;

      case 'DISCOM_POWER':
        applicable = profile.powerLoadHP > 15;
        rationale = `Dedicated industrial power sanction required for connected machinery load of ${profile.powerLoadHP} HP.`;
        break;

      case 'FACTORY_LICENSE':
        if (isSoftwareIT) {
          applicable = false;
          rationale = 'IT / Tech units operate under State Shops & Commercial Establishments Act rather than Factories Act.';
        } else {
          applicable = isOperationalPhase && (hasWorkersAboveLimit || profile.powerLoadHP > 0);
          rationale = `Mandatory operating license under Factories Act 1948 for ${profile.workforceCount} shopfloor workers.`;
        }
        break;

      case 'FSSAI_MFG':
        applicable = isFood;
        rationale = isFood
          ? 'Mandatory food manufacturing license issued under FSSAI Act 2006.'
          : 'Not applicable for non-food manufacturing enterprises.';
        break;

      case 'BOILER_REG':
        applicable = profile.boilerInstalled;
        rationale = profile.boilerInstalled
          ? 'Mandatory hydrostatic testing and registration under Indian Boilers Act 1923.'
          : 'No industrial steam boiler installed on premises.';
        break;

      case 'MUNICIPAL_TRADE':
        applicable = !isSoftwareIT;
        rationale = applicable
          ? `Local civic trade license from ${profile.district} municipal body / panchayat.`
          : 'Commercial IT parks are exempt from municipal trade license in major states.';
        break;

      default:
        applicable = true;
    }

    return {
      ...approval,
      isApplicable: applicable,
      specificRationale: rationale,
    };
  });

  const applicableApprovals = evaluated.filter((a) => a.isApplicable);

  // Collect needed documents
  const neededDocCodes = new Set<string>();
  applicableApprovals.forEach((appr) => {
    appr.requiredDocCodes.forEach((code) => neededDocCodes.add(code));
  });

  // Always require foundational corporate identification
  neededDocCodes.add('DOC_COI');
  neededDocCodes.add('DOC_PAN');

  if (isSoftwareIT || isFintech || isEcommerce || isHealthTech) {
    neededDocCodes.add('DOC_DPIIT_RECOGNITION');
    neededDocCodes.add('DOC_COWORKING_AGREEMENT');
    neededDocCodes.add('DOC_SHOPS_EST');
    neededDocCodes.add('DOC_PROFESSIONAL_TAX');
  } else {
    neededDocCodes.add('DOC_LAND_LEASE');
  }

  const requiredDocs = MASTER_DOCUMENTS.filter((doc) => neededDocCodes.has(doc.code));

  // Determine overall risk
  let overallRisk: 'low' | 'medium' | 'high' = 'low';
  if (isHighPollution || profile.hazardousMaterials || profile.scale === 'large') {
    overallRisk = 'high';
  } else if (profile.scale === 'medium' || profile.powerLoadHP > 50 || isFood || isFintech) {
    overallRisk = 'medium';
  }

  const estimatedTotalGovFees = applicableApprovals.reduce((acc, curr) => acc + curr.governmentFeeINR, 0);

  // Critical path calculation
  const rootApprovals = applicableApprovals.filter((a) => a.prerequisites.length === 0);
  const childApprovals = applicableApprovals.filter((a) => a.prerequisites.length > 0);

  const rootMaxSLA = rootApprovals.reduce((max, a) => Math.max(max, a.slaDays), 0);
  const childMaxSLA = childApprovals.reduce((max, a) => Math.max(max, a.slaDays), 0);
  const criticalPathDays = rootMaxSLA + childMaxSLA;

  return {
    approvals: evaluated,
    requiredDocs,
    riskRating: overallRisk,
    estimatedTotalGovFees,
    criticalPathDays,
  };
}
