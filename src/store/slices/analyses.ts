import { demoJob, demoResume, emptyJob } from '../../data/mock';
import { createMockResult, isExampleJob } from '../../data/results';
import { validateJob } from '../../domain/validation';
import { createId } from '../utils';
import type { AnalysisSlice, DemoSlice } from '../types';

export const createAnalysisSlice: DemoSlice<AnalysisSlice> = (set, get) => ({
  job: { ...emptyJob }, analyses: [], draftAnalysisId: null,
  setJob: value => set(state => {
    const job = { ...state.job, ...value };
    return { job, draftAnalysisId: JSON.stringify(job) === JSON.stringify(state.job) ? state.draftAnalysisId : null };
  }),
  fillExample: () => set({ job: { ...demoJob }, draftAnalysisId: null }),
  startNewAnalysis: () => set({ job: { ...emptyJob }, draftAnalysisId: null }),
  prepareAnalysis: () => {
    const state = get();
    if (Object.keys(validateJob(state.job)).length || !state.document) return null;
    const existing = state.analyses.find(item => item.id === state.draftAnalysisId);
    if (existing) return existing.id;
    const id = createId('analysis');
    set({ draftAnalysisId: id, analyses: [{
      id, job: { ...state.job }, document: { ...state.document }, demoProfileName: demoResume.name,
      status: 'processing', createdAt: new Date().toISOString(), result: null,
    }, ...state.analyses] });
    return id;
  },
  completeAnalysis: id => {
    const analysis = get().analyses.find(item => item.id === id);
    if (!analysis) return false;
    if (analysis.status === 'completed') return true;
    const result = createMockResult(isExampleJob(analysis.job, demoJob) ? 'python' : 'custom');
    set(state => ({ analyses: state.analyses.map(item => item.id === id ? { ...item, status: 'completed', result } : item) }));
    return true;
  },
});
