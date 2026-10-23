import type { StateCreator } from 'zustand/vanilla';
import type { Analysis, DemoPreferences, Job, Journey, ResumeDocument, ResumeProfile, User } from '../data/types';

export interface UserSlice {
  user: User;
  preferences: DemoPreferences;
  saveUser: (user: User) => boolean;
  setPreferences: (value: Partial<DemoPreferences>) => void;
}

export interface AnalysisSlice {
  job: Job;
  analyses: Analysis[];
  draftAnalysisId: string | null;
  setJob: (value: Partial<Job>) => void;
  fillExample: () => void;
  startNewAnalysis: () => void;
  prepareAnalysis: () => string | null;
  completeAnalysis: (id: string) => boolean;
}

export interface ResumeSlice {
  resume: ResumeProfile;
  document: ResumeDocument | null;
  setDocument: (document: ResumeDocument) => boolean;
  clearDocument: () => void;
  selectDemoDocument: () => void;
}

export interface JourneySlice {
  journeys: Journey[];
  activeJourneyId: string | null;
  createJourneyForAnalysis: (analysisId: string) => string | null;
  selectJourney: (journeyId: string) => void;
  toggleTask: (journeyId: string, activityId: string) => void;
}

export interface LifecycleSlice {
  hasHydrated: boolean;
  storageError: string | null;
  finishHydration: (error?: string) => void;
  setStorageError: (message: string | null) => void;
  resetAll: () => void;
}

export type DemoState = UserSlice & AnalysisSlice & ResumeSlice & JourneySlice & LifecycleSlice;
export type DemoSlice<T> = StateCreator<DemoState, [], [], T>;
export type PersistedDemoState = Pick<DemoState, 'user' | 'preferences' | 'job' | 'analyses' | 'draftAnalysisId' | 'resume' | 'document' | 'journeys' | 'activeJourneyId'>;
