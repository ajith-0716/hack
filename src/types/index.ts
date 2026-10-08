export type IndustrySector =
  | 'software_it'
  | 'fintech'
  | 'ecommerce_d2c'
  | 'healthtech'
  | 'edtech'
  | 'cleantech_ev'
  | 'food_processing'
  | 'textiles'
  | 'pharmaceuticals'
  | 'heavy_engineering'
  | 'electronics'
  | 'chemical_plastics'
  | 'renewable_energy';

export type EnterpriseScale = 'micro' | 'small' | 'medium' | 'large';

export type BusinessStage = 'ideation' | 'pre_construction' | 'pre_operation' | 'operating' | 'expansion';

export type PollutionCategory = 'white' | 'green' | 'orange' | 'red';

export type LegalStructure =
  | 'private_limited'
  | 'llp'
  | 'sole_proprietorship'
  | 'partnership'
  | 'one_person_company';

export type DocumentCategory =
  | 'identity'
  | 'legal_entity'
  | 'land_premises'
  | 'technical_drawings'
  | 'environmental'
  | 'safety'
  | 'financial'
  | 'it_cybersecurity'
  | 'ip_legal'
  | 'tax_labour';

export type DocumentLifecycleStatus =
  | 'not_uploaded'
  | 'draft_in_progress'
  | 'validating'
  | 'verified'
  | 'query_raised'
  | 'rejected'
  | 'expired';

export interface StartupProfile {
  id: string;
  businessName: string;
  cinOrRegistration: string;
  legalStructure: LegalStructure;
  sector: IndustrySector;
  scale: EnterpriseScale;
  stage: BusinessStage;
  state: string;
  district: string;
  zoneType: 'approved_industrial_estate' | 'commercial_zone' | 'non_conforming_area' | 'rural_panchayat';
  landAreaSqFt: number;
  builtUpAreaSqFt: number;
  capitalInvestmentLakhs: number;
  workforceCount: number;
  powerLoadHP: number;
  waterRequirementKLD: number;
  pollutionCategory: PollutionCategory;
  hazardousMaterials: boolean;
  effluentDischarge: boolean;
  boilerInstalled: boolean;
  dgSetInstalled: boolean;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  code: string;
  category: DocumentCategory;
  description: string;
  formatAccepted: string[];
  maxSizeMB: number;
  isMandatory: boolean;
  issuingAuthority: string;
  statuteAct?: string;
  portalUrl?: string;
  processingTimeEstimate?: string;
  applicableSectors?: IndustrySector[];
  sampleFileName?: string;
  extractedFields?: {
    label: string;
    key: string;
    expectedType: 'string' | 'number' | 'date';
  }[];
}

export interface UploadedDocRecord {
  docId: string;
  docCode: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: DocumentLifecycleStatus;
  ocrConfidence: number;
  extractedData: Record<string, string>;
  digiLockerVerified: boolean;
  mismatchWarnings: string[];
  fileUrl?: string;
  verifiedAt?: string;
  expiresAt?: string;
  documentStatusNote?: string;
}

export interface StatutoryApproval {
  id: string;
  approvalCode: string;
  title: string;
  department: string;
  statuteAct: string;
  rationale: string;
  slaDays: number;
  governmentFeeINR: number;
  riskCategory: 'low' | 'medium' | 'high';
  stageRequired: BusinessStage[];
  requiredDocCodes: string[];
  prerequisites: string[];
  canRunInParallelWith: string[];
  validityYears: number;
  isMandatory: boolean;
}

export interface ApplicationTask {
  approvalId: string;
  approvalCode: string;
  title: string;
  department: string;
  status: 'pending_docs' | 'submitted' | 'under_scrutiny' | 'inspection_scheduled' | 'query_raised' | 'approved' | 'rejected';
  submittedAt?: string;
  slaDaysTotal: number;
  slaDaysRemaining: number;
  officerAssigned?: string;
  inspectionDate?: string;
  queryMessage?: string;
  approvalCertificateNumber?: string;
  approvalGrantedDate?: string;
  expiryDate?: string;
  isFastTrack: boolean;
}

export interface JointInspection {
  id: string;
  applicationId: string;
  startupName: string;
  scheduledDate: string;
  timeSlot: string;
  participatingDepartments: string[];
  leadOfficer: string;
  leadOfficerContact: string;
  siteAddress: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'rescheduled';
  jointChecklist: {
    item: string;
    department: string;
    status: 'pending' | 'verified' | 'non_compliant';
    remarks?: string;
  }[];
  reportSummary?: string;
  recommendation?: 'grant_immediate' | 'grant_with_conditions' | 'resubmit';
}

export interface RenewalAlert {
  id: string;
  approvalTitle: string;
  department: string;
  certificateNo: string;
  grantDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'active' | 'expiring_soon' | 'critical' | 'expired';
  statutoryFinePerDay?: number;
}
