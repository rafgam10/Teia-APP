export type WorkMode = 'Remoto' | 'Presencial' | 'Híbrido';
export type DemoScenario = 'python' | 'marketing' | 'projects' | 'custom';
export type AnalysisFilter = 'all' | 'processing' | 'completed';

export interface User {
  name: string;
  email: string;
  formation: string;
  interestArea: string;
  objective: string;
  location: string;
  skills: string[];
}

export interface Job {
  title: string;
  company: string;
  mode: WorkMode;
  location: string;
  description: string;
  technicalRequirements: string;
  behavioralRequirements: string;
}

// Only metadata is retained. No URI, base64, file contents or extracted text.
export interface ResumeDocument {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX';
  mimeType: string;
  size: number;
  source: 'demo' | 'device';
}

export interface ResumeProfile {
  name: string;
  formation: string;
  summary: string;
  skills: string[];
  experiences: { id: string; title: string; description: string }[];
}

export interface CompatibilityResult {
  scenario: DemoScenario;
  simulated: true;
  score: number;
  classification: string;
  explanation: string;
  strengths: string[];
  gaps: string[];
  categories: { id: string; title: string; score: number }[];
  feedback: string[];
  resumeTips: string[];
}

export interface Analysis {
  id: string;
  job: Job;
  document: ResumeDocument;
  demoProfileName: string;
  createdAt: string;
  status: 'processing' | 'completed';
  result: CompatibilityResult | null;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: `https://${string}`;
}

export interface Activity {
  id: string;
  title: string;
  objective: string;
  description: string;
  durationMinutes: number;
  competence: string;
  steps: string[];
  resources: LearningResource[];
  done: boolean;
}

export interface JourneyStage {
  id: string;
  title: string;
  activities: Activity[];
}

export interface Journey {
  id: string;
  analysisId: string;
  createdAt: string;
  stages: JourneyStage[];
}

export interface DemoPreferences {
  showTips: boolean;
  expandJourneyStages: boolean;
}
