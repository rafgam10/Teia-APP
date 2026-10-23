import { createJourney } from '../../data/roadmaps';
import type { DemoSlice, JourneySlice } from '../types';

export const createJourneySlice: DemoSlice<JourneySlice> = (set, get) => ({
  journeys: [], activeJourneyId: null,
  createJourneyForAnalysis: analysisId => {
    const state = get();
    const analysis = state.analyses.find(item => item.id === analysisId);
    if (!analysis || analysis.status !== 'completed' || !analysis.result) return null;
    const existing = state.journeys.find(item => item.analysisId === analysisId);
    if (existing) {
      set({ activeJourneyId: existing.id });
      return existing.id;
    }
    const journey = createJourney(analysis);
    set({ journeys: [...state.journeys, journey], activeJourneyId: journey.id });
    return journey.id;
  },
  selectJourney: activeJourneyId => {
    if (get().journeys.some(item => item.id === activeJourneyId)) set({ activeJourneyId });
  },
  toggleTask: (journeyId, activityId) => set(state => ({
    journeys: state.journeys.map(journey => journey.id !== journeyId ? journey : {
      ...journey, stages: journey.stages.map(stage => ({ ...stage,
        activities: stage.activities.map(activity => activity.id === activityId ? { ...activity, done: !activity.done } : activity),
      })),
    }),
  })),
});
