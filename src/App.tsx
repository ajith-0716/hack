/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  StartupProfile,
  UploadedDocRecord,
  ApplicationTask,
  UserProfile,
  FlowStep,
  SystemAnomaly,
} from './types';
import {
  SAMPLE_STARTUPS,
  getInitialDocsAndTasksForStartup,
} from './data/sampleStartups';
import { DEMO_USERS } from './data/authUsers';
import { Header, ActiveTab } from './components/Header';
import { ComplianceFlowWizard } from './components/ComplianceFlowWizard';
import { AnomalyDiagnosticsLab, INITIAL_ANOMALIES } from './components/AnomalyDiagnosticsLab';
import { EntrepreneurPortal } from './components/EntrepreneurPortal';
import { OfficerPortal } from './components/OfficerPortal';
import { InspectionPortal } from './components/InspectionPortal';
import { AnalyticsPortal } from './components/AnalyticsPortal';
import { DocumentExplorer } from './components/DocumentExplorer';
import { ShieldCheck, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentStartup, setCurrentStartup] = useState<StartupProfile>(SAMPLE_STARTUPS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('flow');
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS[0]);
  const [activeAnomalies, setActiveAnomalies] = useState<SystemAnomaly[]>(INITIAL_ANOMALIES);

  const initialData = getInitialDocsAndTasksForStartup(SAMPLE_STARTUPS[0].id);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocRecord[]>(initialData.docs);
  const [applicationTasks, setApplicationTasks] = useState<ApplicationTask[]>(initialData.tasks);

  const handleStartupChange = (newStartup: StartupProfile) => {
    setCurrentStartup(newStartup);
    const data = getInitialDocsAndTasksForStartup(newStartup.id);
    setUploadedDocs(data.docs);
    setApplicationTasks(data.tasks);
  };

  const activeAnomaliesCount = activeAnomalies.filter((a) => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Universal Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStartup={currentStartup}
        setCurrentStartup={handleStartupChange}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        activeAnomaliesCount={activeAnomaliesCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'flow' && (
          <ComplianceFlowWizard
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            startup={currentStartup}
            setStartup={setCurrentStartup}
            uploadedDocs={uploadedDocs}
            setUploadedDocs={setUploadedDocs}
            applicationTasks={applicationTasks}
            setApplicationTasks={setApplicationTasks}
            onOpenAnomalyLab={() => setActiveTab('anomalies')}
          />
        )}

        {activeTab === 'anomalies' && (
          <AnomalyDiagnosticsLab
            activeAnomalies={activeAnomalies}
            setActiveAnomalies={setActiveAnomalies}
          />
        )}

        {activeTab === 'founder' && (
          <EntrepreneurPortal
            startup={currentStartup}
            setStartup={setCurrentStartup}
            uploadedDocs={uploadedDocs}
            setUploadedDocs={setUploadedDocs}
            applicationTasks={applicationTasks}
            setApplicationTasks={setApplicationTasks}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerPortal
            currentStartup={currentStartup}
            applicationTasks={applicationTasks}
            setApplicationTasks={setApplicationTasks}
            uploadedDocs={uploadedDocs}
            setUploadedDocs={setUploadedDocs}
          />
        )}

        {activeTab === 'inspection' && (
          <InspectionPortal
            currentStartup={currentStartup}
            applicationTasks={applicationTasks}
            setApplicationTasks={setApplicationTasks}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsPortal />}

        {activeTab === 'library' && <DocumentExplorer />}
      </main>

      {/* Official Single Window Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900">OneGov AI</span>
              <span className="text-slate-400"> · National Single Window Regulatory &amp; Compliance Hub</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span>Ease of Doing Business (EoDB)</span>
            <span>·</span>
            <span>Smart India Hackathon 2026 Prototype</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> India DPDP Act &amp; DigiLocker Aligned
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
