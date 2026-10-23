import { useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Btn, Card, Field, PageTitle, Screen, s } from '@/components/UI';
import type { User } from '@/data/types';
import { validateUser } from '@/domain/validation';
import { retryLocalSave, useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

export default function Profile() {
  const user = useDemo(state => state.user);
  const saveUser = useDemo(state => state.saveUser);
  const [form, setForm] = useState<User>(() => ({ ...user, skills: [...user.skills] }));
  const [skills, setSkills] = useState(user.skills.join(', '));
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [failed, setFailed] = useState(false);
  const errors = validateUser(form);
  const update = (key: keyof Omit<User, 'skills'>, value: string) => { setForm(previous => ({ ...previous, [key]: value })); setFeedback(''); };

  async function save() {
    setAttempted(true);
    setFeedback('');
    const parsedSkills = [...new Set(skills.split(',').map(item => item.trim()).filter(Boolean))];
    if (!saveUser({ ...form, skills: parsedSkills })) return;
    setSaving(true);
    const saved = await retryLocalSave();
    setSaving(false);
    setFailed(!saved);
    setFeedback(saved ? 'Alterações salvas neste dispositivo.' : 'Perfil atualizado em memória, mas não foi possível persistir. Tente novamente nas Configurações.');
  }
  return <Screen>
    <PageTitle title="Meu perfil" subtitle="Informações profissionais locais. Nenhuma conta ou autenticação é necessária." />
    <Card><View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
      <Text style={{ color: C.primary, fontSize: 24, fontWeight: '900' }}>{form.name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('') || 'MF'}</Text>
    </View><Text style={s.sectionTitle}>{form.name || 'Seu nome'}</Text><Text style={s.muted}>{form.objective}</Text></Card>
    <Field label="Nome completo *" value={form.name} onChangeText={value => update('name', value)} error={attempted ? errors.name : undefined} autoComplete="name" />
    <Field label="E-mail *" value={form.email} onChangeText={value => update('email', value)} error={attempted ? errors.email : undefined} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
    <Field label="Formação *" value={form.formation} onChangeText={value => update('formation', value)} error={attempted ? errors.formation : undefined} />
    <Field label="Área de interesse" value={form.interestArea} onChangeText={value => update('interestArea', value)} />
    <Field label="Objetivo profissional" value={form.objective} onChangeText={value => update('objective', value)} multiline />
    <Field label="Localização" value={form.location} onChangeText={value => update('location', value)} />
    <Field label="Habilidades (separadas por vírgula)" value={skills} onChangeText={value => { setSkills(value); setFeedback(''); }} multiline />
    <Btn title="Salvar alterações" loading={saving} onPress={save} />
    {feedback && <Text accessibilityLiveRegion="polite" style={failed ? s.error : s.success}>{feedback}</Text>}
    <Btn title="Configurações" secondary onPress={() => router.push('/settings')} />
    <Text style={[s.small, { marginTop: 18 }]}>O perfil edita a apresentação local do app. O resultado simulado continua usando Marina Ferreira como personagem demonstrativa, sem ler seu documento.</Text>
  </Screen>;
}
