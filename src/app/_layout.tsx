import { useEffect } from 'react';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { C } from '@/theme/colors';
import { hydrateDemo, useDemo } from '@/store/useDemo';
import { s } from '@/components/UI';

export const unstable_settings = { anchor: '(tabs)' };

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: C.primary, background: C.bg, card: C.white, text: C.text, border: C.line } };

export default function Layout() {
  const hydrated = useDemo(state => state.hasHydrated);
  useEffect(() => { void hydrateDemo(); }, []);
  return <ThemeProvider value={theme}>
    <StatusBar style="dark" />
    {hydrated ? <Stack screenOptions={{
      headerStyle: { backgroundColor: C.bg }, headerTintColor: C.green,
      headerShadowVisible: false, contentStyle: { backgroundColor: C.bg }, headerBackTitle: 'Voltar',
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="analysis/new" options={{ title: 'Nova análise' }} />
      <Stack.Screen name="analysis/upload" options={{ title: 'Anexar currículo' }} />
      <Stack.Screen name="analysis/processing" options={{ title: 'Processamento simulado', gestureEnabled: false }} />
      <Stack.Screen name="analysis/result" options={{ title: 'Resultado' }} />
      <Stack.Screen name="journey/[id]" options={{ title: 'Detalhes da atividade' }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil profissional' }} />
      <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Página não encontrada' }} />
    </Stack> : <View style={[s.screen, { alignItems: 'center', justifyContent: 'center', gap: 16 }]}>
      <ActivityIndicator color={C.primary} size="large" /><Text style={s.body}>Preparando sua TEIA…</Text>
    </View>}
  </ThemeProvider>;
}
