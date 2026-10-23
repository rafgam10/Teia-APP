import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  return <Tabs backBehavior="history" screenOptions={{
    headerShown: false, tabBarActiveTintColor: C.primary, tabBarInactiveTintColor: C.muted,
    tabBarHideOnKeyboard: true, tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
    tabBarStyle: { height: 60 + Math.max(insets.bottom, 8), paddingTop: 6, paddingBottom: Math.max(insets.bottom, 8), backgroundColor: C.white, borderTopColor: C.line },
  }}>
    <Tabs.Screen name="index" options={{ title: 'Início', tabBarAccessibilityLabel: 'Início', tabBarIcon: ({ size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={focused ? C.primary : C.muted} /> }} />
    <Tabs.Screen name="analyses" options={{ title: 'Análises', tabBarAccessibilityLabel: 'Análises', tabBarIcon: ({ size, focused }) => <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={size} color={focused ? C.primary : C.muted} /> }} />
    <Tabs.Screen name="journey" options={{ title: 'Jornada', tabBarAccessibilityLabel: 'Jornada', tabBarIcon: ({ size, focused }) => <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={focused ? C.primary : C.muted} /> }} />
    <Tabs.Screen name="resume" options={{ title: 'Currículo', tabBarAccessibilityLabel: 'Currículo', tabBarIcon: ({ size, focused }) => <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={size} color={focused ? C.primary : C.muted} /> }} />
  </Tabs>;
}
