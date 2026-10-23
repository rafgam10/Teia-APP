import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnalysisCard } from '@/components/AnalysisCard';
import { Btn, Card, DemoNotice, EmptyState, ProgressBar, Screen, s } from '@/components/UI';
import { professionalTips } from '@/data/mock';
import { formatDuration, journeyProgress } from '@/domain/selectors';
import { newAnalysis } from '@/navigation/actions';
import { useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

export default function Home() {
  const user = useDemo(state => state.user);
  const analyses = useDemo(state => state.analyses);
  const journeys = useDemo(state => state.journeys);
  const activeId = useDemo(state => state.activeJourneyId);
  const showTips = useDemo(state => state.preferences.showTips);
  const storageError = useDemo(state => state.storageError);
  const journey = journeys.find(item => item.id === activeId);
  const analysis = analyses.find(item => item.id === journey?.analysisId);
  const progress = journeyProgress(journey);
  const completedAnalyses = analyses.filter(item => item.status === 'completed').length;
  const initials = user.name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('');
  return <Screen tab>
    <View style={[s.row, { alignItems: 'flex-start', marginBottom: 24 }]}>
      <View style={s.flex}><Text style={styles.logo}>◆ TEIA <Text style={styles.brand}>CARREIRAS</Text></Text>
        <Text accessibilityRole="header" style={styles.greeting}>Olá, {user.name}!</Text>
        <Text style={s.subtitle}>Um passo de cada vez, mais perto da sua próxima oportunidade.</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Abrir meu perfil" onPress={() => router.push('/profile')}
        style={({ pressed }) => [styles.avatar, pressed && s.pressed]}><Text style={styles.initials}>{initials}</Text></Pressable>
    </View>
    {storageError && <Card><Text style={s.error}>{storageError}</Text><Btn title="Ver armazenamento" secondary onPress={() => router.push('/settings')} /></Card>}
    <Card style={styles.hero}>
      <Text style={styles.kicker}>✦ EVOLUÇÃO EM DESTAQUE</Text>
      <Text style={styles.heroTitle}>{progress.percent === 100 ? 'Uma jornada concluída. Novos caminhos pela frente!' : 'Seu próximo passo começa aqui.'}</Text>
      <Text style={styles.heroText}>{analysis ? `${analysis.job.title} · ${analysis.job.company}` : 'Crie uma jornada a partir de uma análise para acompanhar sua evolução.'}</Text>
      <View style={styles.summary}>
        <View><Text style={styles.metric}>{progress.percent}%</Text><Text style={styles.metricLabel}>da jornada ativa</Text></View>
        <View><Text style={styles.metric}>{progress.done}/{progress.total}</Text><Text style={styles.metricLabel}>tarefas concluídas</Text></View>
        <View><Text style={styles.metric}>{completedAnalyses}</Text><Text style={styles.metricLabel}>análises realizadas</Text></View>
      </View>
      <ProgressBar percent={progress.percent} inverse />
      <Btn title={journey ? 'Ver minha jornada →' : 'Ver análises para criar jornada'} secondary onPress={() => router.navigate(journey ? '/(tabs)/journey' : '/(tabs)/analyses')} />
    </Card>
    <Btn title="+ Nova análise" onPress={() => newAnalysis()} />
    <View style={styles.section}><Text style={s.sectionTitle}>Análises recentes</Text>
      <Pressable accessibilityRole="button" onPress={() => router.navigate('/(tabs)/analyses')} style={({ pressed }) => [styles.linkButton, pressed && s.pressed]}><Text style={s.link}>Ver todas →</Text></Pressable>
    </View>
    {analyses.length ? analyses.slice(0, 2).map(item => <AnalysisCard key={item.id} analysis={item} />)
      : <EmptyState title="Sua primeira análise" message="Informe uma vaga e conheça o fluxo demonstrativo." action="Nova análise" onAction={() => newAnalysis()} />}
    <Card><Text style={s.sectionTitle}>Próximas atividades</Text><Text style={s.small}>Da sua jornada ativa</Text>
      {progress.activities.filter(item => !item.done).slice(0, 2).map(activity => <Pressable key={activity.id}
        accessibilityRole="button" accessibilityLabel={`Ver atividade ${activity.title}`}
        onPress={() => router.push({ pathname: '/journey/[id]', params: { id: activity.id, journeyId: journey!.id } })}
        style={({ pressed }) => [styles.activity, pressed && s.pressed]}>
        <Ionicons name="ellipse-outline" color={C.primary} size={22} /><View style={s.flex}>
          <Text style={s.strong}>{activity.title}</Text><Text style={s.small}>{formatDuration(activity.durationMinutes)} · Pendente</Text>
        </View><Ionicons name="chevron-forward" size={18} color={C.muted} />
      </Pressable>)}
      {!journey && <Text style={[s.muted, { marginTop: 12 }]}>Nenhuma jornada ativa. Crie uma no resultado de uma análise.</Text>}
      {journey && progress.done === progress.total && <Text style={s.success}>Todas as atividades concluídas! 🎉</Text>}
      <Btn title="Acessar jornada" secondary onPress={() => router.navigate('/(tabs)/journey')} />
    </Card>
    {showTips && <><Text style={[s.sectionTitle, { marginTop: 12 }]}>Dicas profissionais</Text>
      {professionalTips.map(tip => <Card key={tip.id} style={{ backgroundColor: C.yellow }}><Text style={styles.tipKicker}>✦ DICA DA TEIA</Text>
        <Text style={[s.strong, { marginBottom: 6 }]}>{tip.title}</Text><Text style={s.body}>{tip.description}</Text>
      </Card>)}</>}
    <DemoNotice />
    <Btn title="Configurações" secondary onPress={() => router.push('/settings')} />
  </Screen>;
}

const styles = StyleSheet.create({
  logo: { fontSize: 23, color: C.green, fontWeight: '900', marginBottom: 18 },
  brand: { fontSize: 11, letterSpacing: 2 }, greeting: { fontSize: 24, color: C.text, fontWeight: '800' },
  avatar: { width: 48, height: 48, backgroundColor: C.soft, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 17, color: C.primary, fontWeight: '900' },
  hero: { backgroundColor: C.primary, padding: 23, borderRadius: 22 },
  kicker: { fontSize: 11, color: C.lime, fontWeight: '800', letterSpacing: 0.8 },
  heroTitle: { fontSize: 26, lineHeight: 33, fontWeight: '800', color: C.white, marginTop: 17 },
  heroText: { color: '#D3EBE2', fontSize: 13, lineHeight: 21, marginTop: 10 },
  summary: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18, marginTop: 24, marginBottom: 5 },
  metric: { fontSize: 24, color: C.white, fontWeight: '900' }, metricLabel: { fontSize: 11, color: '#D3EBE2', marginTop: 4 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginTop: 28, marginBottom: 4 },
  linkButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 5 },
  activity: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderTopColor: C.line, marginTop: 10 },
  tipKicker: { fontSize: 11, color: '#82641B', fontWeight: '800', marginBottom: 10 },
});
