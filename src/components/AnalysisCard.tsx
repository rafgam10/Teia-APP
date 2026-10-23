import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Analysis } from '../data/types';
import { formatDate } from '../domain/selectors';
import { C } from '../theme/colors';
import { Card, s } from './UI';

export function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const processing = analysis.status === 'processing';
  return <Pressable accessibilityRole="button" accessibilityLabel={`${analysis.job.title}, ${analysis.job.company}. ${processing ? 'Retomar análise' : 'Ver resultado'}`}
    onPress={() => router.push({ pathname: processing ? '/analysis/processing' : '/analysis/result', params: { id: analysis.id } })}
    style={({ pressed }) => pressed && s.pressed}>
    <Card><View style={s.row}>
      <View style={styles.avatar}><Text style={styles.initial}>{analysis.job.company[0]?.toUpperCase() || 'T'}</Text></View>
      <View style={s.flex}>
        <Text style={s.strong}>{analysis.job.title}</Text>
        <Text style={s.small}>{analysis.job.company}</Text>
        <Text style={s.small}>{formatDate(analysis.createdAt)} · {processing ? 'Em andamento' : 'Concluída'}</Text>
        <Text style={styles.caption}>{processing ? 'Toque para retomar' : 'Compatibilidade simulada'}</Text>
      </View>
      <Text style={styles.score}>{analysis.result ? `${analysis.result.score}%` : '…'}</Text>
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </View></Card>
  </Pressable>;
}

const styles = StyleSheet.create({
  avatar: { width: 40, height: 40, backgroundColor: C.soft, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  initial: { color: C.primary, fontWeight: '800', fontSize: 18 },
  score: { fontSize: 23, fontWeight: '900', color: C.primary },
  caption: { fontSize: 10, fontWeight: '700', color: C.primary, marginTop: 6 },
});
