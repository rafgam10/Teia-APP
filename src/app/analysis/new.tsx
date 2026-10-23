import { useState } from 'react';
import { router } from 'expo-router';
import { Keyboard, Pressable, Text, View } from 'react-native';
import { Btn, DemoNotice, Field, PageTitle, Screen, s } from '@/components/UI';
import type { Job, WorkMode } from '@/data/types';
import { validateJob } from '@/domain/validation';
import { useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

const modes: WorkMode[] = ['Remoto', 'Presencial', 'Híbrido'];

export default function NewAnalysis() {
  const job = useDemo(state => state.job);
  const setJob = useDemo(state => state.setJob);
  const fillExample = useDemo(state => state.fillExample);
  const [attempted, setAttempted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof Job, boolean>>>({});
  const errors = validateJob(job);
  const error = (key: keyof Job) => attempted || touched[key] ? errors[key] : undefined;
  const blur = (key: keyof Job) => () => setTouched(previous => ({ ...previous, [key]: true }));
  function next() {
    setAttempted(true);
    if (Object.keys(errors).length) return;
    Keyboard.dismiss();
    router.push('/analysis/upload');
  }
  return <Screen>
    <PageTitle title="Qual vaga você deseja?" subtitle="Informe os dados da oportunidade. Seu rascunho é preservado durante a navegação e ao reabrir o aplicativo." />
    <Btn title="Preencher com exemplo" secondary onPress={() => { fillExample(); setAttempted(false); setTouched({}); }} />
    <View style={{ height: 24 }} />
    <Field label="Título da vaga *" placeholder="Ex.: Desenvolvedor Python Júnior" value={job.title} onChangeText={title => setJob({ title })} onBlur={blur('title')} error={error('title')} />
    <Field label="Nome da empresa *" placeholder="Ex.: Tech Solutions" value={job.company} onChangeText={company => setJob({ company })} onBlur={blur('company')} error={error('company')} />
    <Text style={s.label}>Modalidade de trabalho *</Text>
    <View accessibilityRole="radiogroup" accessibilityLabel="Modalidade de trabalho" style={[s.wrap, { gap: 8, marginBottom: 18 }]}>{modes.map(mode => <Pressable key={mode}
      accessibilityRole="radio" accessibilityState={{ checked: job.mode === mode }} onPress={() => setJob({ mode })}
      style={({ pressed }) => [{ minHeight: 46, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: job.mode === mode ? C.primary : C.line, backgroundColor: job.mode === mode ? C.soft : C.white }, pressed && s.pressed]}>
      <Text style={{ color: C.primary, fontWeight: job.mode === mode ? '800' : '500' }}>{mode}</Text>
    </Pressable>)}</View>
    <Field label="Localidade (opcional)" placeholder="Ex.: São Paulo, SP" value={job.location} onChangeText={location => setJob({ location })} />
    <Field label="Descrição da vaga *" multiline placeholder="Conte sobre as responsabilidades da oportunidade" value={job.description} onChangeText={description => setJob({ description })} onBlur={blur('description')} error={error('description')} />
    <Field label="Requisitos técnicos *" multiline placeholder="Python, Flask, APIs REST, SQL, Git..." value={job.technicalRequirements} onChangeText={technicalRequirements => setJob({ technicalRequirements })} onBlur={blur('technicalRequirements')} error={error('technicalRequirements')} />
    <Field label="Requisitos comportamentais *" multiline placeholder="Comunicação, trabalho em equipe..." value={job.behavioralRequirements} onChangeText={behavioralRequirements => setJob({ behavioralRequirements })} onBlur={blur('behavioralRequirements')} error={error('behavioralRequirements')} />
    <Text style={s.small}>* Campos obrigatórios. Caso a vaga não informe algum requisito, escreva “Não informado”.</Text>
    {attempted && Object.keys(errors).length > 0 && <Text accessibilityRole="alert" style={s.error}>Revise os campos indicados antes de continuar.</Text>}
    <Btn title="Continuar →" onPress={next} />
    <View style={{ height: 20 }} /><DemoNotice message="O exemplo de Python tem um resultado pré-definido de 78%. Vagas personalizadas recebem um cenário genérico fictício, identificado como demonstração." />
  </Screen>;
}
