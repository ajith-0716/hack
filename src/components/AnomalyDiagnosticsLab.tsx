import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  WifiOff,
  ServerCrash,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Activity,
  ShieldAlert,
  Zap,
  Info,
  Sliders,
  Check,
  RotateCcw,
} from 'lucide-react';
import { SystemAnomaly, AnomalyType } from '../types';

export interface AnomalyDiagnosticsLabProps {
  activeAnomalies: SystemAnomaly[];
  setActiveAnomalies: React.Dispatch<React.SetStateAction<SystemAnomaly[]>>;
  onResolveAnomaly?: (id: string) => void;
}

export const INITIAL_ANOMALIES: SystemAnomaly[] = [
  {
    id: 'anom-input',
    type: 'invalid_input',
    title: 'Invalid or Unexpected Input: Malformed PAN & Negative Capital Entry',
    status: 'resolved',
    timestamp: '10:14:02 AM',
    component: 'Form Validation Gateway / OCR Parser API',
    severity: 'error',
    details: 'Received input string `99X-INVALID-PAN` and negative investment value `-450.00 Lakhs`. Failed regex validation.',
    metricCurrent: 'Regex Failure (HTTP 422)',
    metricThreshold: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
    diagnosticLog: [
      '[10:14:02.102] POST /api/v1/compliance/validate-input payload received',
      '[10:14:02.105] ERROR: schema constraint check failed on key: `panNumber`',
      '[10:14:02.106] Value `99X-INVALID-PAN` contains invalid characters and length mismatch (15 chars)',
      '[10:14:02.108] ERROR: field `capitalInvestmentLakhs` has value -450.00 < minimum allowed (0.00)',
      '[10:14:02.110] Response status HTTP 422 Unprocessable Entity generated',
    ],
    mitigationStep: 'Triggered Client-side Schema Enforcement & Input Normalizer to sanitize and auto-format fields.',
  },
  {
    id: 'anom-sensor',
    type: 'sensor_failure',
    title: 'Sensor Failure: IoT Stack CEMS Effluent Telemetry Missing Data',
    status: 'resolved',
    timestamp: '10:08:45 AM',
    component: 'Continuous Environmental Monitoring System (Station #CEMS-04)',
    severity: 'critical',
    details: 'Stack Emission Sensor #04 lost telemetry heartbeat. Missing mandatory SO2, NOx, and Dissolved Oxygen continuous data packets.',
    metricCurrent: 'Heartbeat LOST (0 packets/min)',
    metricThreshold: '>= 12 packets/min',
    diagnosticLog: [
      '[10:08:45.340] Heartbeat timeout on MQTT broker topic /env/station-04/telemetry',
      '[10:08:50.000] Consecutive missing packet count exceeded threshold: 5 packets dropped',
      '[10:09:00.000] Sensor Status transitioned from HEALTHY to UNRESPONSIVE / MISSING_DATA',
      '[10:09:12.000] MPCB Central Compliance Server flagged environmental monitoring gap',
    ],
    mitigationStep: 'Initiated failover to secondary redundant IoT optical probe & synthetic telemetry interpolation.',
  },
  {
    id: 'anom-network',
    type: 'unusual_network',
    title: 'Unusual Network Behaviour: National Single Window API Gateway Latency Spike',
    status: 'resolved',
    timestamp: '09:52:18 AM',
    component: 'NSWS Central Interop Bus / DigiLocker Verification Proxy',
    severity: 'warning',
    details: 'API Gateway latency surged to 6,420ms with 18.4% packet jitter. Response times exceeded maximum SLA threshold.',
    metricCurrent: '6,420 ms latency (18.4% loss)',
    metricThreshold: '< 800 ms (0.1% loss)',
    diagnosticLog: [
      '[09:52:18.014] HTTP GET https://api.nsws.gov.in/v2/verifications/sync initiation',
      '[09:52:21.840] TLS handshake negotiation delay: +2,400ms above baseline',
      '[09:52:24.434] Upstream socket read timeout after 6,420ms',
      '[09:52:24.450] WARN: Jitter variance +450ms, triggering retry-backoff queue',
    ],
    mitigationStep: 'Activated edge circuit-breaker with automatic exponential retry and read-replica cache fallback.',
  },
  {
    id: 'anom-component',
    type: 'component_failure',
    title: 'Component or Service Failure: AI OCR Deep-Inference Worker Crashed',
    status: 'resolved',
    timestamp: '09:30:11 AM',
    component: 'AI Microservice: ocr-engine-worker-3 (Port 8443)',
    severity: 'critical',
    details: 'AI Document Parsing microservice encountered unexpected SIGKILL (OOM 137). OCR queue processing halted temporarily.',
    metricCurrent: 'Worker 3: CRASHED (503 Service Unavailable)',
    metricThreshold: 'Worker Status: RUNNING (200 OK)',
    diagnosticLog: [
      '[09:30:11.200] Large document batch allocated: 48 pages 600 DPI PDF',
      '[09:30:11.450] Container memory allocation crossed limit (4096MB > 4000MB)',
      '[09:30:11.510] FATAL: Process terminated with SIGKILL (Exit code 137)',
      '[09:30:11.520] Healthcheck failed on unix:///var/run/ocr-engine.sock: Connection refused',
    ],
    mitigationStep: 'Auto-restarted container with memory swap cushion and distributed job across auxiliary worker cluster.',
  },
  {
    id: 'anom-spike',
    type: 'sudden_value_change',
    title: 'Sudden Change in Monitored Value: Industrial Effluent COD Spiked by +1,050%',
    status: 'resolved',
    timestamp: '09:15:00 AM',
    component: 'Effluent Treatment Plant (ETP) Continuous Water Probe',
    severity: 'critical',
    details: 'Monitored Chemical Oxygen Demand (COD) spiked from 35 mg/L to 468 mg/L in 90 seconds, breaching statutory threshold (250 mg/L).',
    metricCurrent: '468 mg/L (+1,050% surge)',
    metricThreshold: '< 250 mg/L (Safe Baseline: 35 mg/L)',
    diagnosticLog: [
      '[09:15:00.000] Baseline measurement: COD = 35.2 mg/L (Normal Green Zone)',
      '[09:15:30.000] Intermediate measurement: COD = 184.6 mg/L (Rapid slope detected)',
      '[09:16:30.000] Critical breach: COD = 468.0 mg/L (Exceeds MPCB threshold 250 mg/L by 87%)',
      '[09:16:32.000] Automated statutory compliance lock engaged: Alert sent to Sub-Regional Officer',
    ],
    mitigationStep: 'Dispatched automated neutralizing agent dosing command and initiated physical verification protocol.',
  },
];

export const AnomalyDiagnosticsLab: React.FC<AnomalyDiagnosticsLabProps> = ({
  activeAnomalies,
  setActiveAnomalies,
}) => {
  const [selectedAnomalyType, setSelectedAnomalyType] = useState<AnomalyType>('invalid_input');
  const [activeTab, setActiveTab] = useState<'simulator' | 'telemetry' | 'system_logs'>('simulator');
  const [customInputValue, setCustomInputValue] = useState('99X-INVALID-PAN-$$');
  const [inputErrorFeedback, setInputErrorFeedback] = useState<string | null>(null);

  // Helper to check if an anomaly type is currently active
  const isTypeActive = (type: AnomalyType) =>
    activeAnomalies.some((a) => a.type === type && a.status === 'active');

  const triggerAnomaly = (type: AnomalyType) => {
    const template = INITIAL_ANOMALIES.find((a) => a.type === type);
    if (!template) return;

    const newAnomaly: SystemAnomaly = {
      ...template,
      id: `anom-${type}-${Date.now()}`,
      status: 'active',
      timestamp: new Date().toLocaleTimeString(),
    };

    setActiveAnomalies((prev) => [
      newAnomaly,
      ...prev.filter((a) => a.type !== type),
    ]);

    if (type === 'invalid_input') {
      setInputErrorFeedback('Validation Error: Input violates regex format `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`');
    }
  };

  const resolveAnomaly = (type: AnomalyType) => {
    setActiveAnomalies((prev) =>
      prev.map((a) => (a.type === type ? { ...a, status: 'resolved' } : a))
    );
    if (type === 'invalid_input') {
      setInputErrorFeedback(null);
      setCustomInputValue('AAACG1234F');
    }
  };

  const resolveAllAnomalies = () => {
    setActiveAnomalies((prev) => prev.map((a) => ({ ...a, status: 'resolved' })));
    setInputErrorFeedback(null);
    setCustomInputValue('AAACG1234F');
  };

  const activeCount = activeAnomalies.filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Official Government Diagnostic Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                System Resilience &amp; Fault Tolerance Sandbox
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live Kernel Telemetry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              System Anomaly, Sensor &amp; Input Failure Simulation
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Test and demonstrate how OneGov AI detects, isolates, and recovers from realistic regulatory system errors:
              <strong> Invalid Inputs</strong>, <strong>Sensor Outages</strong>, <strong>Network Jitter</strong>,
              <strong> Service Crashes</strong>, and <strong>Sudden Monitored Value Spikes</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 ${
                activeCount > 0
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  activeCount > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <div className="text-left">
                <div className="text-xs font-semibold">
                  {activeCount > 0 ? `${activeCount} Anomalies Active` : 'All 5 Subsystems Nominal'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeCount > 0 ? 'Diagnostic alert flagged' : 'Zero packet loss / 100% SLA'}
                </div>
              </div>
            </div>

            {activeCount > 0 && (
              <button
                onClick={resolveAllAnomalies}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Resolve All &amp; Restore Baseline</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Navigation Tabs inside Lab */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-white text-slate-900 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Error Sandbox (5 Scenarios)</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-white text-slate-900 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Subsystem Health Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('system_logs')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'system_logs'
                ? 'bg-white text-slate-900 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Diagnostic Logs Console</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 5 Error Scenario Selectors */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Select Anomaly Scenario to Test
            </h2>

            {/* Scenario 1 */}
            <div
              onClick={() => setSelectedAnomalyType('invalid_input')}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                selectedAnomalyType === 'invalid_input'
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isTypeActive('invalid_input')
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Invalid or Unexpected Input</h3>
                    <p className="text-xs text-slate-500">Malformed PAN/GSTIN, negative capital, inverted dates</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isTypeActive('invalid_input')
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isTypeActive('invalid_input') ? 'ACTIVE ERROR' : 'NORMAL'}
                </span>
              </div>
            </div>

            {/* Scenario 2 */}
            <div
              onClick={() => setSelectedAnomalyType('sensor_failure')}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                selectedAnomalyType === 'sensor_failure'
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isTypeActive('sensor_failure')
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Sensor Failure or Missing Data</h3>
                    <p className="text-xs text-slate-500">IoT Continuous Emission probe offline, missing page telemetry</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isTypeActive('sensor_failure')
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isTypeActive('sensor_failure') ? 'ACTIVE ERROR' : 'NORMAL'}
                </span>
              </div>
            </div>

            {/* Scenario 3 */}
            <div
              onClick={() => setSelectedAnomalyType('unusual_network')}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                selectedAnomalyType === 'unusual_network'
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isTypeActive('unusual_network')
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Unusual Network Behaviour</h3>
                    <p className="text-xs text-slate-500">NSWS Gateway latency &gt;6,000ms, packet jitter, 504 timeout</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isTypeActive('unusual_network')
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isTypeActive('unusual_network') ? 'ACTIVE ERROR' : 'NORMAL'}
                </span>
              </div>
            </div>

            {/* Scenario 4 */}
            <div
              onClick={() => setSelectedAnomalyType('component_failure')}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                selectedAnomalyType === 'component_failure'
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isTypeActive('component_failure')
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Component or Service Failure</h3>
                    <p className="text-xs text-slate-500">AI OCR Engine container crashed (503 Service Unavailable)</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isTypeActive('component_failure')
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isTypeActive('component_failure') ? 'ACTIVE ERROR' : 'NORMAL'}
                </span>
              </div>
            </div>

            {/* Scenario 5 */}
            <div
              onClick={() => setSelectedAnomalyType('sudden_value_change')}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                selectedAnomalyType === 'sudden_value_change'
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isTypeActive('sudden_value_change')
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Sudden Change in Monitored Value</h3>
                    <p className="text-xs text-slate-500">Effluent COD surges +1,050% from 35 mg/L to 468 mg/L</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isTypeActive('sudden_value_change')
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isTypeActive('sudden_value_change') ? 'ACTIVE ERROR' : 'NORMAL'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Interactive Test Bench */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {/* Scenario 1: Invalid Input */}
            {selectedAnomalyType === 'invalid_input' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Scenario #1 · Form &amp; Document Parsing Integrity
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Invalid or Unexpected Input Validation
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isTypeActive('invalid_input') ? (
                      <button
                        onClick={() => resolveAnomaly('invalid_input')}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Auto-Sanitize &amp; Fix</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => triggerAnomaly('invalid_input')}
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Trigger Input Error</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-600 leading-relaxed">
                  When applicants submit incomplete document applications or mistyped corporate credentials,
                  the OneGov AI parser enforces strict regex validation and format boundary verification.
                </div>

                {/* Interactive Demo Form Field */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Interactive Field Test: Permanent Account Number (PAN)
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Applicant Entity PAN (Required Format: 5 letters, 4 digits, 1 letter)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customInputValue}
                        onChange={(e) => {
                          setCustomInputValue(e.target.value);
                          if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(e.target.value)) {
                            setInputErrorFeedback('Invalid regex: must match [A-Z]{5}[0-9]{4}[A-Z]{1}');
                          } else {
                            setInputErrorFeedback(null);
                          }
                        }}
                        className={`w-full px-3.5 py-2 text-sm font-mono rounded-lg border focus:outline-none transition-colors ${
                          inputErrorFeedback || isTypeActive('invalid_input')
                            ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-500'
                            : 'border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500'
                        }`}
                        placeholder="e.g. ABCDE1234F"
                      />
                      <button
                        onClick={() => {
                          setCustomInputValue('99X-INVALID-PAN');
                          triggerAnomaly('invalid_input');
                        }}
                        className="px-3 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg whitespace-nowrap"
                      >
                        Inject Bad Data
                      </button>
                      <button
                        onClick={() => {
                          setCustomInputValue('AAACG1234F');
                          resolveAnomaly('invalid_input');
                        }}
                        className="px-3 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg whitespace-nowrap"
                      >
                        Load Valid PAN
                      </button>
                    </div>

                    {(inputErrorFeedback || isTypeActive('invalid_input')) && (
                      <div className="mt-2.5 p-3 rounded-lg bg-rose-100 border border-rose-300 text-rose-900 text-xs flex items-start gap-2 animate-fadeIn">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">HTTP 422 Unprocessable Entity:</strong>{' '}
                          {inputErrorFeedback ||
                            'Input string `99X-INVALID-PAN` fails strict pattern verification.'}
                          <div className="text-[11px] text-rose-700 mt-1">
                            Action Required: Enter 10-digit alphanumeric PAN without hyphens or symbols.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Diagnostic Details */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-900 text-slate-300 font-mono text-xs space-y-1.5">
                  <div className="text-slate-400 text-[11px] font-sans font-semibold uppercase tracking-wider mb-2">
                    Kernel Schema Inspection Trace
                  </div>
                  <div>[STATUS] SchemaValidator::assertValidRegex(field: "panNumber")</div>
                  <div>[VALUE] &quot;{customInputValue}&quot; (length: {customInputValue.length})</div>
                  <div
                    className={
                      inputErrorFeedback || isTypeActive('invalid_input')
                        ? 'text-rose-400 font-bold'
                        : 'text-emerald-400 font-bold'
                    }
                  >
                    [RESULT]{' '}
                    {inputErrorFeedback || isTypeActive('invalid_input')
                      ? 'FAIL: Pattern match 0/1. Raised ValidationError(ERR_BAD_INPUT_FORMAT)'
                      : 'PASS: Pattern match 1/1. Clean normalized value.'}
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 2: Sensor Failure */}
            {selectedAnomalyType === 'sensor_failure' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Scenario #2 · IoT Telemetry &amp; Environmental Sensors
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Sensor Failure or Missing Telemetry Data
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isTypeActive('sensor_failure') ? (
                      <button
                        onClick={() => resolveAnomaly('sensor_failure')}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Failover to Backup Sensor</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => triggerAnomaly('sensor_failure')}
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>Simulate Sensor Outage</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-600 leading-relaxed">
                  Industrial facilities operate Continuous Emission Monitoring System (CEMS) IoT nodes.
                  If a sensor hardware probe drops offline or reports null data, automated alerts are raised.
                </div>

                {/* Sensor Monitoring Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isTypeActive('sensor_failure')
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-emerald-50 border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isTypeActive('sensor_failure')
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        <Radio className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Probe Node #CEMS-04 (Effluent Discharge Pipe)
                        </div>
                        <div className="text-xs text-slate-500">
                          Location: MIDC Ranjangaon Zone II · Protocol: MQTT/TLS
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isTypeActive('sensor_failure')
                          ? 'bg-rose-200 text-rose-900 font-mono'
                          : 'bg-emerald-200 text-emerald-900 font-mono'
                      }`}
                    >
                      {isTypeActive('sensor_failure') ? 'STATUS: OFFLINE (NO PACKETS)' : 'STATUS: STREAMING (100%)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                    <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="text-[10px] text-slate-500 font-medium">BOD Reading</div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {isTypeActive('sensor_failure') ? 'NULL (Missing)' : '18.4 mg/L'}
                      </div>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="text-[10px] text-slate-500 font-medium">COD Reading</div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {isTypeActive('sensor_failure') ? 'NULL (Missing)' : '34.8 mg/L'}
                      </div>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="text-[10px] text-slate-500 font-medium">Heartbeat Pings</div>
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        {isTypeActive('sensor_failure') ? '0 / min (FAILED)' : '14 / min (OK)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnostic Mitigation Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-indigo-600" />
                    Failover &amp; Recovery Workflow
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    When telemetry packets drop for &gt; 3 minutes, the platform triggers an automatic failover to the
                    secondary optoelectronic sensor and requests an on-site calibration verification task.
                  </p>
                </div>
              </div>
            )}

            {/* Scenario 3: Unusual Network Behaviour */}
            {selectedAnomalyType === 'unusual_network' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Scenario #3 · Gateway Connectivity &amp; Latency
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Unusual Network Behaviour &amp; High Jitter
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isTypeActive('unusual_network') ? (
                      <button
                        onClick={() => resolveAnomaly('unusual_network')}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Activate Edge Circuit Breaker</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => triggerAnomaly('unusual_network')}
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <WifiOff className="w-3.5 h-3.5" />
                        <span>Inject Latency Spike (6,420ms)</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-600 leading-relaxed">
                  Inter-departmental synchronization with DigiLocker and the National Single Window Hub
                  occasionally experiences upstream bottlenecks, packet jitter, or 504 timeouts.
                </div>

                {/* Network Metrics Visualizer */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    className={`p-3.5 rounded-xl border ${
                      isTypeActive('unusual_network')
                        ? 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">API Gateway Latency</div>
                    <div className="text-xl font-bold font-mono mt-1">
                      {isTypeActive('unusual_network') ? '6,420 ms' : '142 ms'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {isTypeActive('unusual_network') ? '⚠️ SLA Violated (>800ms)' : '✓ Fast (Within SLA)'}
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${
                      isTypeActive('unusual_network')
                        ? 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Packet Jitter</div>
                    <div className="text-xl font-bold font-mono mt-1">
                      {isTypeActive('unusual_network') ? '18.4% Loss' : '0.01% Loss'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {isTypeActive('unusual_network') ? 'Heavy packet drop' : 'Clean transmission'}
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${
                      isTypeActive('unusual_network')
                        ? 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Gateway Response</div>
                    <div className="text-xl font-bold font-mono mt-1">
                      {isTypeActive('unusual_network') ? '504 Timeout' : '200 OK'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {isTypeActive('unusual_network') ? 'Upstream socket stalled' : 'Synchronized'}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 text-slate-300 font-mono text-xs space-y-1">
                  <div>[NET_DIAG] Target: https://api.nsws.gov.in/v2/verifications</div>
                  <div>[NET_DIAG] HTTP Ping: {isTypeActive('unusual_network') ? 'FAIL (RTT=6420ms)' : 'PASS (RTT=142ms)'}</div>
                  <div className={isTypeActive('unusual_network') ? 'text-amber-400' : 'text-emerald-400'}>
                    [NET_DIAG] Resilience Engine: {isTypeActive('unusual_network') ? 'CIRCUIT_BREAKER_HALF_OPEN' : 'CIRCUIT_BREAKER_CLOSED'}
                  </div>
                </div>
              </div>
            )}

            {/* Scenario 4: Component or Service Failure */}
            {selectedAnomalyType === 'component_failure' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Scenario #4 · Microservices &amp; Infrastructure
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Component or Microservice Outage (HTTP 503)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isTypeActive('component_failure') ? (
                      <button
                        onClick={() => resolveAnomaly('component_failure')}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reboot Container Worker</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => triggerAnomaly('component_failure')}
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <ServerCrash className="w-3.5 h-3.5" />
                        <span>Crash OCR Microservice</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-600 leading-relaxed">
                  During peak document submission surges, optical recognition container workers may run out of memory
                  or crash. OneGov AI isolates the failed pod and routes requests to the auxiliary pool.
                </div>

                {/* Worker Status Board */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">OCR Worker 1</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xs text-emerald-700 font-mono mt-2">Status: RUNNING</div>
                    <div className="text-[10px] text-emerald-600">RAM: 1.4 GB / 4.0 GB</div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">OCR Worker 2</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xs text-emerald-700 font-mono mt-2">Status: RUNNING</div>
                    <div className="text-[10px] text-emerald-600">RAM: 1.8 GB / 4.0 GB</div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${
                      isTypeActive('component_failure')
                        ? 'border-rose-300 bg-rose-50 text-rose-950 animate-pulse'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">OCR Worker 3</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isTypeActive('component_failure') ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                    <div className="text-xs font-mono mt-2">
                      Status: {isTypeActive('component_failure') ? 'CRASHED (503)' : 'RUNNING'}
                    </div>
                    <div className="text-[10px]">
                      {isTypeActive('component_failure') ? 'Exit Code 137 (OOM)' : 'RAM: 2.1 GB / 4.0 GB'}
                    </div>
                  </div>
                </div>

                {isTypeActive('component_failure') && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Autonomous Self-Healing Triggered:</strong> Container healthcheck
                      failed on port 8443. Traffic redirected to Worker 1 and Worker 2 while Worker 3 spins up a fresh replica.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scenario 5: Sudden Change in a Monitored Value */}
            {selectedAnomalyType === 'sudden_value_change' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Scenario #5 · Continuous Compliance &amp; Pollution Thresholds
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Sudden Change in Monitored Industrial Telemetry
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {isTypeActive('sudden_value_change') ? (
                      <button
                        onClick={() => resolveAnomaly('sudden_value_change')}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Deploy Neutralizer &amp; Reset</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => triggerAnomaly('sudden_value_change')}
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Simulate COD Spike (+1,050%)</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-600 leading-relaxed">
                  Real-time environmental probes continuously monitor manufacturing effluents. A violent sudden jump
                  in chemical oxygen demand or power load triggers instant containment procedures.
                </div>

                {/* Gauge / Value Spike Card */}
                <div
                  className={`p-5 rounded-xl border ${
                    isTypeActive('sudden_value_change')
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-emerald-50 border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Chemical Oxygen Demand (COD) Real-Time Monitor
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isTypeActive('sudden_value_change')
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {isTypeActive('sudden_value_change') ? 'CRITICAL SPIKE BREACH' : 'WITHIN STATUTORY LIMITS'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <div className="text-4xl font-extrabold font-mono text-slate-900">
                      {isTypeActive('sudden_value_change') ? '468.0' : '35.2'}
                      <span className="text-base font-normal text-slate-500 ml-1">mg/L</span>
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        isTypeActive('sudden_value_change') ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {isTypeActive('sudden_value_change') ? '▲ +1,050% Sudden Jump' : 'Nominal Baseline'}
                    </div>
                  </div>

                  {/* Progress / Bar indicator */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Baseline: 35 mg/L</span>
                      <span className="font-bold text-amber-700">Statutory Max: 250 mg/L</span>
                      <span>Dangerous: &gt; 400 mg/L</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          isTypeActive('sudden_value_change') ? 'w-full bg-rose-600' : 'w-[14%] bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {isTypeActive('sudden_value_change') && (
                  <div className="p-3.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Automated Legal Hold Triggered:</strong> Water clearance CTO-2026-09
                      paused by Pollution Control Board until industrial effluent returns below 250 mg/L.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Subsystem Health Matrix */}
      {activeTab === 'telemetry' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">OneGov AI Subsystem Telemetry Grid</h3>
              <p className="text-xs text-slate-500">
                Continuous healthchecks across API Gateways, IoT Sensor Ingestion, AI Models, and Storage
              </p>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Back to Simulator &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Form Validation Engine</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isTypeActive('invalid_input') ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="text-xs text-slate-500">
                Status:{' '}
                <strong className={isTypeActive('invalid_input') ? 'text-rose-600' : 'text-emerald-700'}>
                  {isTypeActive('invalid_input') ? '422 Exception Flagged' : '100% Validated'}
                </strong>
              </div>
              <div className="text-[11px] text-slate-400">Strict Schema regex: active</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">IoT Stack Sensor Ingestion</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isTypeActive('sensor_failure') ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="text-xs text-slate-500">
                Status:{' '}
                <strong className={isTypeActive('sensor_failure') ? 'text-rose-600' : 'text-emerald-700'}>
                  {isTypeActive('sensor_failure') ? 'Heartbeat Timeout' : 'Telemetry Streaming'}
                </strong>
              </div>
              <div className="text-[11px] text-slate-400">Broker: mqtts://iot.onegov.gov.in</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">National Interop Gateway</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isTypeActive('unusual_network') ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="text-xs text-slate-500">
                Status:{' '}
                <strong className={isTypeActive('unusual_network') ? 'text-amber-600' : 'text-emerald-700'}>
                  {isTypeActive('unusual_network') ? 'High Jitter / 6,420ms' : 'Nominal (142ms)'}
                </strong>
              </div>
              <div className="text-[11px] text-slate-400">DigiLocker &amp; NSWS Bus</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">AI OCR Worker Pool</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isTypeActive('component_failure') ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="text-xs text-slate-500">
                Status:{' '}
                <strong className={isTypeActive('component_failure') ? 'text-rose-600' : 'text-emerald-700'}>
                  {isTypeActive('component_failure') ? 'Worker 3 Down (503)' : '3/3 Workers Healthy'}
                </strong>
              </div>
              <div className="text-[11px] text-slate-400">Model: LayoutLMv3 + Tesseract OCR</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Environmental Value Monitoring</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isTypeActive('sudden_value_change') ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="text-xs text-slate-500">
                Status:{' '}
                <strong className={isTypeActive('sudden_value_change') ? 'text-rose-600' : 'text-emerald-700'}>
                  {isTypeActive('sudden_value_change') ? 'Threshold Spiked 468mg/L' : 'Baseline 35.2mg/L'}
                </strong>
              </div>
              <div className="text-[11px] text-slate-400">Statutory threshold: 250 mg/L max</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Cryptographic Seal Vault</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs text-slate-500">
                Status: <strong className="text-emerald-700">Operational (100%)</strong>
              </div>
              <div className="text-[11px] text-slate-400">SHA-256 HSM Digital Signatures</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Diagnostic Logs Console */}
      {activeTab === 'system_logs' && (
        <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 p-6 shadow-sm font-mono text-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">OneGov AI Central Telemetry &amp; Error Stream</span>
            </div>
            <span className="text-[10px] text-slate-400">Live tail: 50 lines / sec</span>
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
            {INITIAL_ANOMALIES.flatMap((a) => a.diagnosticLog).map((line, idx) => (
              <div
                key={idx}
                className={
                  line.includes('ERROR') || line.includes('FATAL')
                    ? 'text-rose-400'
                    : line.includes('WARN')
                    ? 'text-amber-400'
                    : line.includes('PASS')
                    ? 'text-emerald-400'
                    : 'text-slate-300'
                }
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
