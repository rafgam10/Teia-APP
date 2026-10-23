import { demoDocument, demoResume } from '../../data/mock';
import { validateDocument } from '../../domain/validation';
import type { DemoSlice, ResumeSlice } from '../types';

export const createResumeSlice: DemoSlice<ResumeSlice> = (set, get) => ({
  resume: { ...demoResume, skills: [...demoResume.skills], experiences: demoResume.experiences.map(item => ({ ...item })) },
  document: { ...demoDocument },
  setDocument: document => {
    if (validateDocument(document)) return false;
    // Whitelist metadata even if a picker asset with extra properties is supplied.
    const { id, name, type, mimeType, size, source } = document;
    set({ document: { id, name, type, mimeType, size, source }, draftAnalysisId: null });
    return true;
  },
  clearDocument: () => set({ document: null, draftAnalysisId: null }),
  selectDemoDocument: () => { get().setDocument({ ...demoDocument }); },
});
