import { useState } from 'react';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Switch, Text, View } from 'react-native';
import { Btn, Card, ConfirmDialog, DemoNotice, PageTitle, Screen, s } from '@/components/UI';
import { retryLocalSave, useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

export default function Settings() {
  const preferences = useDemo(state => state.preferences);
  const setPreferences = useDemo(state => state.setPreferences);
  const resetAll = useDemo(state => state.resetAll);
  const storageError = useDemo(state => state.storageError);
  const [confirmReset, setConfirmReset] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  async function reset() {
    setConfirmReset(false);
    setBusy(true);
    resetAll();
    const saved = await retryLocalSave();
    setBusy(false);
    setFeedback(saved ? 'Dados mockados restaurados. O perfil, as análises e o progresso voltaram ao exemplo inicial.' : 'Dados restaurados em memória. Não foi possível salvar no dispositivo.');
  }
  async function retry() {
    setBusy(true);
    const saved = await retryLocalSave();
    setBusy(false);
    setFeedback(saved ? 'Dados locais salvos com sucesso.' : 'O armazenamento continua indisponível. Seu progresso está somente em memória.');
  }
  return <Screen>
    <PageTitle title="Configurações" subtitle="Personalize a demonstração e gerencie os dados deste dispositivo." />
    <Card><Text style={s.sectionTitle}>Preferências de demonstração</Text>
      <View style={[s.row, { minHeight: 62 }]}><View style={s.flex}><Text style={s.strong}>Dicas profissionais no início</Text><Text style={s.small}>Exibir os cards com dicas de currículo.</Text></View>
        <Switch accessibilityLabel="Exibir dicas profissionais" value={preferences.showTips} onValueChange={showTips => setPreferences({ showTips })} trackColor={{ false: C.line, true: C.primary }} thumbColor={C.white} />
      </View>
      <View style={[s.row, { minHeight: 62 }]}><View style={s.flex}><Text style={s.strong}>Etapas expandidas por padrão</Text><Text style={s.small}>Usado nas etapas que você ainda não abriu ou fechou.</Text></View>
        <Switch accessibilityLabel="Expandir etapas da jornada por padrão" value={preferences.expandJourneyStages} onValueChange={expandJourneyStages => setPreferences({ expandJourneyStages })} trackColor={{ false: C.line, true: C.primary }} thumbColor={C.white} />
      </View>
    </Card>
    <Card><Text style={s.sectionTitle}>Sobre o aplicativo</Text><Text style={s.strong}>TEIA Carreiras</Text>
      <Text style={s.body}>Versão {Constants.expoConfig?.version ?? '1.0.0'} · MVP demonstrativo</Text>
      <Text style={[s.muted, { marginTop: 10 }]}>Explore a compatibilidade fictícia entre currículo e vaga e acompanhe um roteiro de qualificação. Sem backend, login, banco remoto ou inteligência artificial real.</Text>
    </Card>
    <Card><Pressable accessibilityRole="button" accessibilityLabel="Política de privacidade demonstrativa" accessibilityState={{ expanded: privacyOpen }} onPress={() => setPrivacyOpen(!privacyOpen)}
      style={({ pressed }) => [s.row, { minHeight: 48 }, pressed && s.pressed]}>
      <Text style={[s.strong, s.flex]}>Política de privacidade demonstrativa</Text><Ionicons name={privacyOpen ? 'chevron-up' : 'chevron-down'} size={21} color={C.primary} />
    </Pressable>
      {privacyOpen && <View style={{ gap: 12, marginTop: 14 }}>
        <Text style={s.body}>Este conteúdo é demonstrativo e não substitui uma política jurídica para um produto em produção.</Text>
        <Text style={s.body}>O aplicativo salva perfil, metadados do documento, análises fictícias, preferências e progresso localmente com AsyncStorage, sem criptografia. Não use informações sensíveis nesta demonstração.</Text>
        <Text style={s.body}>Não fazemos upload, leitura de PDF/DOCX ou extração de texto. Arquivos não são guardados permanentemente pelo app; somente nome, tipo e tamanho são mantidos para demonstrar a seleção.</Text>
        <Text style={s.body}>Recursos de aprendizagem são links externos abertos apenas quando você toca neles. Você pode remover os dados de demonstração restaurando o exemplo inicial abaixo.</Text>
      </View>}
    </Card>
    <Card><Text style={s.sectionTitle}>Armazenamento local</Text>
      <Text accessibilityLiveRegion="polite" style={storageError ? s.error : s.body}>{storageError ?? 'A persistência local está ativa. As mudanças são recuperadas ao reabrir o aplicativo.'}</Text>
      <Btn title="Tentar salvar dados locais" secondary loading={busy} onPress={retry} />
    </Card>
    <DemoNotice message="Restaurar remove suas alterações locais e repõe apenas os exemplos iniciais. A ação pede confirmação e não afeta outros aplicativos." />
    <Btn title="Restaurar dados mockados" secondary disabled={busy} onPress={() => setConfirmReset(true)} />
    {feedback && <Text accessibilityLiveRegion="polite" style={storageError ? s.error : s.success}>{feedback}</Text>}
    <ConfirmDialog visible={confirmReset} title="Restaurar dados mockados?"
      message="Seu perfil editado, documentos selecionados, novas análises, preferências e progresso local serão substituídos pelos exemplos iniciais. Deseja continuar?"
      confirmLabel="Sim, restaurar dados" onCancel={() => setConfirmReset(false)} onConfirm={reset} />
  </Screen>;
}
