import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnalysisCard } from '@/components/AnalysisCard';
import { Btn, DemoNotice, EmptyState, Field, PageTitle, Screen, s } from '@/components/UI';
import type { AnalysisFilter } from '@/data/types';
import { filterAnalyses } from '@/domain/selectors';
import { newAnalysis } from '@/navigation/actions';
import { useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

const filters: { id: AnalysisFilter; title: string }[] = [
  { id: 'all', title: 'Todas' }, { id: 'processing', title: 'Em andamento' }, { id: 'completed', title: 'Concluídas' },
];

export default function Analyses() {
  const analyses = useDemo(state => state.analyses);
  const [filter, setFilter] = useState<AnalysisFilter>('all');
  const [query, setQuery] = useState('');
  const visible = filterAnalyses(analyses, filter, query);
  return <Screen tab>
    <PageTitle title="Suas análises" subtitle="Oportunidades avaliadas e resultados demonstrativos." />
    <Field label="Pesquisar por cargo ou empresa" placeholder="Ex.: Python ou Tech Solutions" value={query} onChangeText={setQuery} returnKeyType="search" />
    <View style={styles.filters}>{filters.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: filter === item.id }}
      onPress={() => setFilter(item.id)} style={({ pressed }) => [styles.filter, filter === item.id && styles.selected, pressed && s.pressed]}>
      <Text style={[styles.filterText, filter === item.id && { color: C.white }]}>{item.title}</Text>
    </Pressable>)}</View>
    <Text accessibilityLiveRegion="polite" style={[s.small, { marginBottom: 14 }]}>{visible.length} análise(s) · Status referente ao processamento, não à conclusão da jornada.</Text>
    {visible.map(item => <AnalysisCard key={item.id} analysis={item} />)}
    {!visible.length && <EmptyState title={analyses.length ? 'Nenhum resultado encontrado' : 'Nenhuma análise ainda'}
      message={analyses.length ? 'Tente outro cargo, empresa ou filtro.' : 'Crie uma análise para começar sua jornada.'}
      action={analyses.length ? 'Limpar filtros' : 'Nova análise'} onAction={() => {
        if (analyses.length) { setFilter('all'); setQuery(''); } else newAnalysis();
      }} />}
    <Btn title="+ Nova análise" onPress={() => newAnalysis()} />
    <View style={{ height: 20 }} /><DemoNotice />
  </Screen>;
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  filter: { minHeight: 44, justifyContent: 'center', borderRadius: 22, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: C.white, borderWidth: 1, borderColor: C.line },
  selected: { backgroundColor: C.primary, borderColor: C.primary },
  filterText: { color: C.primary, fontSize: 13, fontWeight: '700' },
});
