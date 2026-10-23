import { useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { Btn, Card, DemoNotice, EmptyState, PageTitle, ProgressBar, Screen, Tag, s } from '@/components/UI';
import { formatDate, journeyProgress } from '@/domain/selectors';
import { backToJourney, newAnalysis, openHistory } from '@/navigation/actions';
import { useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

export default function Result() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const analysis = useDemo(state => state.analyses.find(item => item.id === id));
  const journey = useDemo(state => state.journeys.find(item => item.analysisId === id));
  const createJourney = useDemo(state => state.createJourneyForAnalysis);
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { openHistory(); return true; });
    return () => subscription.remove();
  }, []));
  const result = analysis?.result;
  function openJourney() {
    if (analysis && createJourney(analysis.id)) backToJourney();
  }
  return <Screen>
    <Stack.Screen options={{ gestureEnabled: false, headerBackVisible: false, headerLeft: () => <Pressable accessibilityRole="button" accessibilityLabel="Voltar ao histórico" onPress={openHistory}
      style={({ pressed }) => [{ minHeight: 44, minWidth: 44, justifyContent: 'center' }, pressed && s.pressed]}><Ionicons name="arrow-back" size={24} color={C.primary} /></Pressable> }} />
    {!analysis ? <EmptyState title="Análise não encontrada" message="Este resultado não existe neste dispositivo. Consulte seu histórico." action="Voltar ao histórico" onAction={openHistory} />
      : !result ? <EmptyState title="Análise em andamento" message="Retome o processamento demonstrativo para ver o resultado." action="Retomar processamento" onAction={() => router.replace({ pathname: '/analysis/processing', params: { id: analysis.id } })} /> : <>
        <PageTitle title="Seu resultado está pronto!" subtitle={`${analysis.job.title} · ${analysis.job.company}`} />
        <DemoNotice message={result.explanation} />
        <Card style={styles.scoreCard}>
          <Text style={styles.kicker}>COMPATIBILIDADE SIMULADA</Text>
          <View style={styles.circle}><Text style={styles.score}>{result.score}%</Text></View>
          <Text style={styles.classification}>{result.classification}</Text>
          <View style={{ width: '100%', marginTop: 10 }}><ProgressBar percent={result.score} inverse /></View>
          <Text style={styles.scoreDescription}>Pontuação fictícia, sem relação com chance de contratação.</Text>
        </Card>
        <Card><Text style={s.sectionTitle}>Resumo da análise</Text>
          <Text style={s.body}>Vaga: {analysis.job.title}</Text><Text style={s.body}>Empresa: {analysis.job.company}</Text>
          <Text style={s.body}>Modalidade: {analysis.job.mode}{analysis.job.location ? ` · ${analysis.job.location}` : ''}</Text>
          <Text style={s.body}>Data: {formatDate(analysis.createdAt)}</Text>
          <Text style={s.small}>Documento: {analysis.document.name}</Text>
          <Text style={s.small}>Perfil usado: {analysis.demoProfileName} (demonstração)</Text>
        </Card>
        <Card><Text style={s.sectionTitle}>Pontos fortes simulados</Text><View style={s.wrap}>{result.strengths.map(item => <Tag key={item} text={item} />)}</View></Card>
        <Card style={{ backgroundColor: C.yellow }}><Text style={s.sectionTitle}>Lacunas identificadas no exemplo</Text>
          {result.gaps.map(item => <View key={item} style={[s.row, { marginBottom: 12 }]}><Ionicons name="alert-circle-outline" size={20} color="#82641B" /><Text style={[s.body, s.flex]}>{item}</Text></View>)}
          <Text style={s.small}>São oportunidades de desenvolvimento ou de evidenciar conhecimentos. Uma competência não mencionada não significa falta de capacidade profissional.</Text>
        </Card>
        <Card><Text style={s.sectionTitle}>Compatibilidade por categoria</Text>{result.categories.map(category => <View key={category.id} style={{ marginTop: 10 }}>
          <View style={[s.row, { justifyContent: 'space-between' }]}><Text style={[s.body, s.flex]}>{category.title}</Text><Text style={s.strong}>{category.score}%</Text></View>
          <ProgressBar percent={category.score} />
        </View>)}<Text style={s.small}>Todas as categorias têm valores pré-definidos.</Text></Card>
        <Card><Text style={s.sectionTitle}>Feedback para os próximos passos</Text>{result.feedback.map(item => <Text key={item} style={[s.body, { marginBottom: 14 }]}>{item}</Text>)}</Card>
        {journey && <Text style={s.success}>Sua jornada já existe: {journeyProgress(journey).percent}% concluída. Seu progresso será preservado.</Text>}
        <Btn title={journey ? 'Acessar minha jornada →' : 'Criar jornada →'} onPress={openJourney} />
        <Btn title="Nova análise" secondary onPress={() => newAnalysis(true)} />
        <Btn title="Voltar ao histórico" secondary onPress={openHistory} />
      </>}
  </Screen>;
}

const styles = StyleSheet.create({
  scoreCard: { backgroundColor: C.primary, alignItems: 'center', padding: 26 },
  kicker: { color: C.lime, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  circle: { borderWidth: 10, borderColor: C.lime, borderRadius: 75, width: 148, height: 148, alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  score: { color: C.white, fontSize: 39, fontWeight: '900' },
  classification: { color: C.white, fontWeight: '800', fontSize: 20, textAlign: 'center' },
  scoreDescription: { color: '#D3EBE2', textAlign: 'center', fontSize: 12, lineHeight: 19, marginTop: 8 },
});
