import { createStore } from 'zustand/vanilla';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createInitialData } from '../data/mock';
import { createUserSlice } from './slices/user';
import { createAnalysisSlice } from './slices/analyses';
import { createResumeSlice } from './slices/resume';
import { createJourneySlice } from './slices/journey';
import type { DemoState, PersistedDemoState } from './types';
import { readPersistedState } from './persistence';

export const STORAGE_KEY = 'teia-carreiras-mvp';

// A single persisted snapshot keeps the four responsibilities consistent after hydration.
export function createDemoStore(storage: StateStorage) {
  let hydrating = false;
  const hydrationSafeStorage: StateStorage = {
    getItem: name => storage.getItem(name),
    // Updating hydration/error flags must not overwrite a corrupt or unreadable snapshot.
    setItem: (name, value) => hydrating ? undefined : storage.setItem(name, value),
    removeItem: name => storage.removeItem(name),
  };
  return createStore<DemoState>()(persist<DemoState, [], [], PersistedDemoState>((set, get, api) => ({
    ...createUserSlice(set, get, api),
    ...createAnalysisSlice(set, get, api),
    ...createResumeSlice(set, get, api),
    ...createJourneySlice(set, get, api),
    ...createInitialData(),
    hasHydrated: false, storageError: null,
    finishHydration: error => set({ hasHydrated: true, ...(error ? { storageError: error } : {}) }),
    setStorageError: storageError => {
      if (get().storageError !== storageError) set({ storageError });
    },
    resetAll: () => set({
      ...createUserSlice(set, get, api),
      ...createAnalysisSlice(set, get, api),
      ...createResumeSlice(set, get, api),
      ...createJourneySlice(set, get, api),
      ...createInitialData(),
    }),
  }), {
    name: STORAGE_KEY, version: 1, skipHydration: true,
    storage: createJSONStorage(() => hydrationSafeStorage),
    partialize: state => ({
      user: state.user, preferences: state.preferences, job: state.job, analyses: state.analyses,
      draftAnalysisId: state.draftAnalysisId, document: state.document, resume: state.resume,
      journeys: state.journeys, activeJourneyId: state.activeJourneyId,
    }),
    merge: (persisted, current) => ({ ...current, ...readPersistedState(persisted) }),
    onRehydrateStorage: state => {
      hydrating = true;
      return (_restored, error) => {
        state.finishHydration(error
          ? 'Não foi possível recuperar os dados locais. Os dados de demonstração estão disponíveis; verifique o armazenamento em Configurações.' : undefined);
        hydrating = false;
      };
    },
  }));
}
