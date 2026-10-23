import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Keep the server snapshot stable without an extra synchronous effect update. */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
