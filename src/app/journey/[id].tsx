import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Btn, Card, DemoNotice, EmptyState, PageTitle, Screen, Tag, s } from '@/components/UI';
import { formatDuration } from '@/domain/selectors';
import { backToJourney } from '@/navigation/actions';
import { useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

export default function ActivityDetail() {
  const { id, journeyId } = useLocalSearchParams<{ id?: string; journeyId?: string }>();
  const journeys = useDemo(state => state.journeys);
  const toggleTask = useDemo(state => state.toggleTask);
  const selectJourney = useDemo(state => state.selectJourney);
  const journey = journeys.find(item => (!journeyId || item.id === journeyId) && item.stages.some(stage => stage.activities.some(activity => activity.id === id)));
  const stage = journey?.stages.find(item => item.activities.some(activity => activity.id === id));
  const activity = stage?.activities.find(item => item.id === id);
  function back() { if (journey) selectJourney(journey.id); backToJourney(); }
  return <Screen>
    {!activity || !journey ? <EmptyState title="Atividade não encontrada" message="A atividade pode não existir neste dispositivo ou os dados foram restaurados." action="Voltar à jornada" onAction={back} /> : <>
      <PageTitle title={activity.title} subtitle={stage?.title} />
      <Card><Text style={s.sectionTitle}>Objetivo</Text><Text style={s.body}>{activity.objective}</Text></Card>
      <Card><Text style={s.sectionTitle}>Descrição</Text><Text style={s.body}>{activity.description}</Text></Card>
      <Card><Text style={s.label}>Duração estimada</Text><Text style={[s.strong, { marginBottom: 16 }]}>{formatDuration(activity.durationMinutes)}</Text>
        <Text style={s.label}>Competência desenvolvida</Text><View style={s.wrap}><Tag text={activity.competence} /></View>
      </Card>
      <Card><Text style={s.sectionTitle}>Passos recomendados</Text>{activity.steps.map((step, index) => <View key={step} style={[s.row, { alignItems: 'flex-start', marginBottom: 14 }]}>
        <Text style={[s.strong, { color: C.primary }]}>{index + 1}.</Text><Text style={[s.body, s.flex]}>{step}</Text>
      </View>)}</Card>
      <Card><Text style={s.sectionTitle}>Recursos de aprendizagem demonstrativos</Text>{activity.resources.map(resource => <View key={resource.id} style={{ marginBottom: 16 }}>
        <Link href={resource.url} target="_blank" rel="noopener noreferrer" asChild><Pressable accessibilityRole="link" style={({ pressed }) => [s.row, { minHeight: 44 }, pressed && s.pressed]}>
          <Ionicons name="book-outline" color={C.primary} size={21} /><Text style={[s.link, s.flex]}>{resource.title} ↗</Text>
        </Pressable></Link><Text style={s.small}>{resource.description}</Text>
      </View>)}</Card>
      <Card style={{ backgroundColor: activity.done ? C.soft : C.white }}><View style={s.row}>
        <Ionicons name={activity.done ? 'checkmark-circle' : 'ellipse-outline'} color={C.primary} size={25} />
        <Text accessibilityLiveRegion="polite" style={s.strong}>Status: {activity.done ? 'Concluída' : 'Pendente'}</Text>
      </View></Card>
      <Btn title={activity.done ? 'Desmarcar conclusão' : 'Marcar como concluída'} onPress={() => toggleTask(journey.id, activity.id)} />
      <Btn title="Voltar à jornada" secondary onPress={back} />
      <View style={{ height: 20 }} /><DemoNotice message="A conclusão é autodeclarada e atualiza imediatamente a jornada correspondente. O dashboard acompanha a jornada ativa." />
    </>}
  </Screen>;
}
