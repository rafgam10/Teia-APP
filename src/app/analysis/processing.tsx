import { useCallback, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { Btn, Card, DemoNotice, EmptyState, PageTitle, ProgressBar, Screen, s } from '@/components/UI';
import { PROCESSING_STEPS, simulateProcessing } from '@/domain/processing';
import { openHistory } from '@/navigation/actions';
import { demoStore, useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

export default function Processing() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const analysis = useDemo(state => state.analyses.find(item => item.id === id));
  const [progress, setProgress] = useState(0);
  useFocusEffect(useCallback(() => {
    const current = demoStore.getState().analyses.find(item => item.id === id);
    if (!current) return;
    if (current.status === 'completed') {
      router.replace({ pathname: '/analysis/result', params: { id: current.id } });
      return;
    }
    // The cleanup also runs on blur, so leaving this screen stops all callbacks.
    return simulateProcessing(setProgress, () => {
      if (demoStore.getState().completeAnalysis(current.id)) {
        router.replace({ pathname: '/analysis/result', params: { id: current.id } });
      }
    });
  }, [id]));
  const step = Math.min(PROCESSING_STEPS.length - 1, Math.floor(progress / 100 * PROCESSING_STEPS.length));
  return <Screen>
    {!analysis ? <EmptyState title="Análise não encontrada" message="Crie uma análise ou retome uma pelo histórico." action="Voltar ao histórico" onAction={openHistory} /> : <>
      <PageTitle title="Conectando suas possibilidades" subtitle={`${analysis.job.title} · ${analysis.job.company}`} />
      <Card style={{ paddingVertical: 28 }}>
        <ActivityIndicator color={C.primary} size="large" />
        <Text accessibilityLiveRegion="polite" style={[s.sectionTitle, { textAlign: 'center', marginTop: 22 }]}>{PROCESSING_STEPS[step]}</Text>
        <ProgressBar percent={progress} />
        <Text style={[s.strong, { textAlign: 'right', marginBottom: 20 }]}>{progress}%</Text>
        {PROCESSING_STEPS.map((title, index) => <View key={title} style={[s.row, { marginBottom: 14 }]}>
          <Text style={{ color: index <= step ? C.primary : C.muted, fontWeight: '800' }}>{index < step ? '✓' : `${index + 1}.`}</Text>
          <Text style={[s.body, s.flex, { color: index <= step ? C.text : C.muted }]}>{title}</Text>
        </View>)}
      </Card>
      <DemoNotice message="Estas etapas são apenas uma simulação visual de cerca de três segundos. Não lemos o arquivo e não executamos IA ou upload." />
      <Btn title="Voltar ao histórico" secondary onPress={openHistory} />
      <Text style={[s.small, { marginTop: 12 }]}>Se sair agora, você poderá retomar esta análise pelo filtro Em andamento.</Text>
    </>}
  </Screen>;
}
