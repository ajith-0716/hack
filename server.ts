import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database State for Government Single Window System
interface AnomalyState {
  id: string;
  type: string;
  title: string;
  status: 'active' | 'resolved';
  component: string;
  metricCurrent: string;
  metricThreshold: string;
}

let anomalies: AnomalyState[] = [
  {
    id: 'anom-input',
    type: 'invalid_input',
    title: 'Invalid or Unexpected Input: Malformed PAN & Negative Capital Entry',
    status: 'resolved',
    component: 'Form Validation Gateway',
    metricCurrent: 'Regex Failure (HTTP 422)',
    metricThreshold: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
  },
  {
    id: 'anom-sensor',
    type: 'sensor_failure',
    title: 'Sensor Failure: IoT Stack CEMS Effluent Telemetry Missing Data',
    status: 'resolved',
    component: 'CEMS Station #04',
    metricCurrent: 'Heartbeat LOST (0 packets/min)',
    metricThreshold: '>= 12 packets/min',
  },
  {
    id: 'anom-network',
    type: 'unusual_network',
    title: 'Unusual Network Behaviour: NSWS Gateway Latency Spike',
    status: 'resolved',
    component: 'NSWS Central Bus',
    metricCurrent: '6,420 ms latency',
    metricThreshold: '< 800 ms',
  },
  {
    id: 'anom-component',
    type: 'component_failure',
    title: 'Component or Service Failure: AI OCR Inference Worker Crashed',
    status: 'resolved',
    component: 'OCR Microservice Worker 3',
    metricCurrent: 'CRASHED (HTTP 503)',
    metricThreshold: 'RUNNING (200 OK)',
  },
  {
    id: 'anom-spike',
    type: 'sudden_value_change',
    title: 'Sudden Change in Monitored Value: Industrial Effluent COD Spiked',
    status: 'resolved',
    component: 'ETP Continuous Probe',
    metricCurrent: '468 mg/L (+1,050% surge)',
    metricThreshold: '< 250 mg/L',
  },
];

// --- BACKEND API ENDPOINTS ---

// 1. Auth Endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const role = email.includes('officer')
    ? 'officer'
    : email.includes('inspector')
    ? 'inspector'
    : email.includes('admin')
    ? 'admin'
    : 'founder';

  res.json({
    success: true,
    user: {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      token: `jwt_token_${Buffer.from(email).toString('base64')}`,
    },
  });
});

// 2. Business Profile Pre-Evaluation API
app.post('/api/profile/evaluate', (req: Request, res: Response) => {
  const { sector, scale, capitalInvestmentLakhs, powerLoadHP, workforceCount } = req.body;

  // Strict Schema Input Validation (Scenario 1 demonstration)
  if (capitalInvestmentLakhs && capitalInvestmentLakhs < 0) {
    return res.status(422).json({
      success: false,
      error: 'ERR_INVALID_INPUT',
      message: 'Validation Exception: Capital investment cannot be negative.',
    });
  }

  const generatedClearances = [];
  if (sector === 'food_processing') {
    generatedClearances.push({ code: 'FSSAI_MFG', name: 'FSSAI Manufacturing License', sla: 30 });
    generatedClearances.push({ code: 'PCB_CTE', name: 'MPCB Consent to Establish (Orange Category)', sla: 45 });
  } else if (sector === 'software_it') {
    generatedClearances.push({ code: 'DPIIT_RECOG', name: 'DPIIT Startup India Recognition', sla: 7 });
    generatedClearances.push({ code: 'SHOPS_EST', name: 'Shops & Commercial Establishment Act', sla: 15 });
  } else {
    generatedClearances.push({ code: 'PCB_CTE', name: 'State Pollution Control Board Clearance', sla: 45 });
  }

  if (powerLoadHP > 50 || workforceCount > 20) {
    generatedClearances.push({ code: 'DISH_FACTORY', name: 'Factory License & Safety Clearance', sla: 30 });
  }

  res.json({
    success: true,
    sector,
    scale,
    statutoryClearances: generatedClearances,
    mandatoryDocuments: [
      { code: 'DOC_COI', name: 'Certificate of Incorporation / Registration' },
      { code: 'DOC_PAN', name: 'Entity PAN Card' },
      { code: 'DOC_LEASE', name: 'Registered Lease Agreement / Ownership Deed' },
      { code: 'DOC_LAYOUT', name: 'Architectural Site Layout Plan' },
    ],
  });
});

// 3. Document OCR Pre-Validation API
app.post('/api/documents/pre-validate', (req: Request, res: Response) => {
  const { docCode, fileName, extractedFields } = req.body;

  // Simulate OCR Analysis
  const isBoardResolution = docCode === 'DOC_BOARD_RES';
  const hasDIN = extractedFields?.dinNumber;

  if (isBoardResolution && !hasDIN) {
    return res.json({
      success: true,
      status: 'DEFECT_DETECTED',
      ocrConfidence: 68.4,
      defects: [
        'Missing Director Identification Number (DIN)',
        'ROC corporate seal unverified on signature block',
      ],
      recommendation: 'Request Correction before submission to Government Officer',
    });
  }

  res.json({
    success: true,
    status: 'PASS',
    ocrConfidence: 97.8,
    digiLockerHash: `sha256_${Date.now()}`,
    defects: [],
    extractedMetadata: {
      signatoryMatched: true,
      entityNameVerified: true,
    },
  });
});

// 4. Officer Review & Defect Management API
app.post('/api/officer/review', (req: Request, res: Response) => {
  const { action, docCode, defectRemark } = req.body;

  if (action === 'raise_defect') {
    return res.json({
      success: true,
      action: 'DEFECT_RAISED',
      defectNotice: {
        docCode,
        remark: defectRemark || 'Defect detected in uploaded statutory document',
        timestamp: new Date().toISOString(),
        status: 'CORRECTION_REQUIRED',
      },
    });
  }

  res.json({
    success: true,
    action: 'APPROVED',
    certificateNumber: `MH/ONEGOV/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    grantedAt: new Date().toISOString(),
  });
});

// 5. IoT Sensor Telemetry & Anomaly Trigger API
app.get('/api/telemetry/anomalies', (_req: Request, res: Response) => {
  res.json({ success: true, anomalies });
});

app.post('/api/telemetry/anomalies/trigger', (req: Request, res: Response) => {
  const { type } = req.body;
  anomalies = anomalies.map((a) => (a.type === type ? { ...a, status: 'active' } : a));
  res.json({ success: true, message: `Anomaly ${type} activated`, anomalies });
});

app.post('/api/telemetry/anomalies/resolve', (req: Request, res: Response) => {
  const { type } = req.body;
  anomalies = anomalies.map((a) => (a.type === type ? { ...a, status: 'resolved' } : a));
  res.json({ success: true, message: `Anomaly ${type} resolved`, anomalies });
});

// Real-Time IoT Environmental Sensor Stream
app.get('/api/telemetry/cems-stream', (_req: Request, res: Response) => {
  const spikeActive = anomalies.find((a) => a.type === 'sudden_value_change' && a.status === 'active');
  const sensorOffline = anomalies.find((a) => a.type === 'sensor_failure' && a.status === 'active');

  if (sensorOffline) {
    return res.status(503).json({
      status: 'OFFLINE',
      stationId: 'CEMS-STATION-04',
      error: 'TELEMETRY_PACKET_LOSS',
      lastSeenSecondsAgo: 240,
    });
  }

  res.json({
    status: 'ONLINE',
    stationId: 'CEMS-STATION-04',
    readings: {
      bod: spikeActive ? 180.2 : 18.4,
      cod: spikeActive ? 468.0 : 35.2,
      ph: 7.2,
      flowRateKLD: 42.0,
      alertTriggered: !!spikeActive,
    },
    timestamp: new Date().toISOString(),
  });
});

// --- VITE DEV / PROD SERVER INTEGRATION ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[OneGov AI] Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
