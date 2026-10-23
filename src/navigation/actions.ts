import { router } from 'expo-router';
import { demoStore } from '../store/useDemo';

export function newAnalysis(fromResult = false) {
  const state = demoStore.getState();
  // Returning from a tab/reopening the app must not erase an unsent draft.
  // A submitted request or the explicit result action starts a fresh form.
  if (fromResult || state.draftAnalysisId) state.startNewAnalysis();
  if (fromResult) router.dismissTo('/analysis/new');
  else router.push('/analysis/new');
}

export function openHistory() {
  router.dismissTo('/(tabs)/analyses');
}

export function backToJourney() {
  router.dismissTo('/(tabs)/journey');
}
