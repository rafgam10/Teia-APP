import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { DocumentSelection } from '@/components/DocumentSelection';
import { Btn, Card, DemoNotice, PageTitle, Screen, s } from '@/components/UI';
import { validateJob } from '@/domain/validation';
import { useDemo } from '@/store/useDemo';

export default function Upload() {
  const document = useDemo(state => state.document);
  const job = useDemo(state => state.job);
  const prepareAnalysis = useDemo(state => state.prepareAnalysis);
  const [error, setError] = useState('');
  const navigating = useRef(false);
  const valid = !Object.keys(validateJob(job)).length;
  function analyze() {
    if (navigating.current) return;
    const id = prepareAnalysis();
    if (!id) { setError('Confira os dados da vaga e selecione um documento válido.'); return; }
    navigating.current = true;
    // Replace removes the upload from the return path, preventing accidental resubmission.
    router.replace({ pathname: '/analysis/processing', params: { id } });
  }
  return <Screen>
    <PageTitle title="Agora, seu currículo" subtitle="Escolha um documento ou experimente o currículo de demonstração." />
    {valid ? <Card><Text style={s.strong}>{job.title}</Text><Text style={s.small}>{job.company} · {job.mode}</Text></Card>
      : <Card><Text style={s.error}>Preencha os dados da vaga antes de analisar.</Text><Btn title="Informar vaga" secondary onPress={() => router.dismissTo('/analysis/new')} /></Card>}
    <DemoNotice message="Usaremos o perfil fictício de Marina Ferreira, mesmo se você selecionar outro documento. Nenhum texto é extraído e não há upload ou IA real." />
    <DocumentSelection />
    {error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    <Btn title="Analisar compatibilidade →" disabled={!document || !valid} onPress={analyze} />
  </Screen>;
}
