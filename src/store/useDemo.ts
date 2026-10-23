import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from 'zustand';
import { createDemoStore } from './createDemoStore';
import { queuedStorage } from './persistence';
import type { DemoState } from './types';

const storage = queuedStorage(AsyncStorage, message => {
  demoStore.getState().setStorageError(message);
});
export const demoStore = createDemoStore(storage);

export async function savePendingChanges() {
  await storage.flush();
  return !demoStore.getState().storageError;
}

export async function retryLocalSave() {
  demoStore.setState({ storageError: null });
  return savePendingChanges();
}

export function useDemo<T>(selector: (state: DemoState) => T): T {
  return useStore(demoStore, selector);
}

let hydration: Promise<void> | undefined;
export function hydrateDemo() {
  // Safe under Strict Mode, and never reads AsyncStorage during server rendering.
  hydration ??= Promise.resolve(demoStore.persist.rehydrate());
  return hydration;
}
