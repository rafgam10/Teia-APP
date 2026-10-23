import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Btn, Card, DemoNotice, EmptyState, PageTitle, ProgressBar, Screen, s } from '@/components/UI';
import { formatDuration, journeyProgress } from '@/domain/selectors';
import { useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

export default function Journey() {
  const journeys = useDemo(state => state.journeys);
  const activeId = useDemo(state => state.activeJourneyId);
  const analyses = useDemo(state => state.analyses);
  const selectJourney = useDemo(state => state.selectJourney);
  const toggleTask = useDemo(state => state.toggleTask);
  const defaultExpanded = useDemo(state => state.preferences.expandJourneyStages);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const journey = journeys.find(item => item.id === activeId);
  const analysis = analyses.find(item => item.id === journey?.analysisId);
  const progress = journeyProgress(journey);
  return <Screen tab>
    <PageTitle title="Minha jornada" subtitle="Pequenas ações para desenvolver e evidenciar suas competências." />
    {!journey || !analysis ? <EmptyState title="Sua jornada começa com uma análise" message="Abra um resultado e toque em Criar jornada para montar seu roteiro demonstrativo."
      action="Ver análises" onAction={() => router.navigate('/(tabs)/analyses')} /> : <>
      {journeys.length > 1 && <Card><Text style={s.label}>Selecionar jornada ativa</Text>
        {journeys.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Selecionar jornada: ${analyses.find(entry => entry.id === item.analysisId)?.job.title ?? 'Jornada'}`} accessibilityState={{ selected: item.id === activeId }}
          style={({ pressed }) => [styles.journeyOption, item.id === activeId && { backgroundColor: C.soft }, pressed && s.pressed]}
          onPress={() => selectJourney(item.id)}>
          <Ionicons name={item.id === activeId ? 'radio-button-on' : 'radio-button-off'} color={C.primary} size={21} />
          <Text style={[s.body, s.flex]}>{analyses.find(entry => entry.id === item.analysisId)?.job.title ?? 'Jornada'}</Text>
        </Pressable>)}
      </Card>}
      <Card style={{ backgroundColor: C.primary }}>
        <Text style={styles.kicker}>ROADMAP PERSONALIZADO · DEMONSTRAÇÃO</Text>
        <Text style={styles.heroTitle}>{analysis.job.title}</Text>
        <Text style={styles.heroText}>{analysis.job.company}</Text>
        <Text style={[styles.heroText, { marginTop: 16 }]}>{progress.done} de {progress.total} atividades concluídas</Text>
        <ProgressBar percent={progress.percent} inverse />
        <Text style={styles.percent}>{progress.percent}%</Text>
        <Btn title="Ver análise correspondente" secondary onPress={() => router.push({ pathname: '/analysis/result', params: { id: analysis.id } })} />
      </Card>
      {progress.total > 0 && progress.done === progress.total && <Card style={{ backgroundColor: C.soft }}>
        <Text accessibilityLiveRegion="polite" style={s.sectionTitle}>Parabéns! Jornada concluída 🎉</Text>
        <Text style={s.body}>Você finalizou todas as atividades. Registre as evidências no currículo e continue praticando. Isso não altera a pontuação simulada nem garante uma contratação.</Text>
      </Card>}
      {journey.stages.map((stage, index) => {
        const open = expanded[stage.id] ?? defaultExpanded;
        const done = stage.activities.filter(item => item.done).length;
        return <Card key={stage.id}>
          <Pressable accessibilityRole="button" accessibilityLabel={`${open ? 'Recolher' : 'Expandir'} etapa ${stage.title}`} accessibilityState={{ expanded: open }}
            onPress={() => setExpanded(previous => ({ ...previous, [stage.id]: !open }))}
            style={({ pressed }) => [s.row, { minHeight: 48 }, pressed && s.pressed]}>
            <View style={styles.stageNumber}><Text style={styles.stageNumberText}>{index + 1}</Text></View>
            <View style={s.flex}><Text style={s.strong}>Etapa {index + 1}: {stage.title}</Text><Text style={s.small}>{done}/{stage.activities.length} concluídas</Text></View>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={21} color={C.primary} />
          </Pressable>
          {open && stage.activities.map(activity => <View key={activity.id} style={styles.activity}>
            <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: activity.done }} accessibilityLabel={`${activity.done ? 'Desmarcar' : 'Concluir'} ${activity.title}`}
              onPress={() => toggleTask(journey.id, activity.id)} style={({ pressed }) => [styles.checkbox, pressed && s.pressed]}>
              <Ionicons name={activity.done ? 'checkbox' : 'square-outline'} size={27} color={C.primary} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={`Detalhes: ${activity.title}`}
              onPress={() => router.push({ pathname: '/journey/[id]', params: { id: activity.id, journeyId: journey.id } })}
              style={({ pressed }) => [s.row, s.flex, { minHeight: 54 }, pressed && s.pressed]}>
              <View style={s.flex}><Text style={[s.body, activity.done && styles.completed]}>{activity.title}</Text>
                <Text style={s.small}>{formatDuration(activity.durationMinutes)} · {activity.done ? 'Concluída' : 'Pendente'}</Text>
              </View><Ionicons name="chevron-forward" size={18} color={C.muted} />
            </Pressable>
          </View>)}
        </Card>;
      })}
    </>}
    <DemoNotice message="Atividades e recursos sugeridos fazem parte de um roteiro demonstrativo. O progresso é autodeclarado e salvo apenas neste dispositivo." />
  </Screen>;
}

const styles = StyleSheet.create({
  kicker: { color: C.lime, fontWeight: '800', fontSize: 10, letterSpacing: 0.6 },
  heroTitle: { fontSize: 23, fontWeight: '800', color: C.white, marginTop: 14 },
  heroText: { color: '#D3EBE2', fontSize: 14, marginTop: 7 },
  percent: { color: C.lime, textAlign: 'right', fontSize: 22, fontWeight: '900' },
  journeyOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, marginTop: 5, minHeight: 48 },
  stageNumber: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.soft, alignItems: 'center', justifyContent: 'center' },
  stageNumberText: { color: C.primary, fontWeight: '900' },
  activity: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: C.line, marginTop: 10, paddingTop: 10, gap: 5 },
  checkbox: { width: 44, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  completed: { color: C.muted, textDecorationLine: 'line-through' },
});
