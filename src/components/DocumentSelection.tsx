import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
import { formatSize } from '../domain/selectors';
import { useDocumentSelection } from '../hooks/use-document-selection';
import { useDemo } from '../store/useDemo';
import { C } from '../theme/colors';
import { Btn, Card, s } from './UI';

export function DocumentSelection() {
  const document = useDemo(state => state.document);
  const clearDocument = useDemo(state => state.clearDocument);
  const selectDemoDocument = useDemo(state => state.selectDemoDocument);
  const { pick, picking, error, clearError } = useDocumentSelection();
  return <View>
    <Card style={{ alignItems: 'center', borderStyle: 'dashed', borderColor: C.primary, paddingVertical: 26 }}>
      <Ionicons name="cloud-upload-outline" size={42} color={C.primary} />
      <Text style={[s.sectionTitle, { marginTop: 12 }]}>PDF ou DOCX · até 10 MB</Text>
      <Text style={[s.small, { textAlign: 'center' }]}>O documento não é enviado, lido ou copiado para armazenamento permanente. Guardamos somente nome, tipo e tamanho.</Text>
    </Card>
    {document ? <Card>
      <View style={s.row}><Ionicons name="document-text-outline" size={26} color={C.primary} />
        <View style={s.flex}><Text style={s.strong}>{document.name}</Text>
          <Text style={s.small}>{document.type} · {formatSize(document.size)} · {document.source === 'demo' ? 'Exemplo fictício' : 'Arquivo selecionado'}</Text>
        </View>
      </View>
      <Btn title="Substituir documento" secondary loading={picking} onPress={pick} />
      <Btn title="Remover documento" secondary disabled={picking} onPress={() => { clearError(); clearDocument(); }} />
    </Card> : <Btn title="Selecionar arquivo" loading={picking} onPress={pick} />}
    <Btn title="Usar currículo de demonstração" secondary disabled={picking} onPress={() => { clearError(); selectDemoDocument(); }} />
    {error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
    <Text style={[s.small, { marginVertical: 15 }]}>Qualquer documento selecionado será associado ao perfil fictício de Marina Ferreira. Não extraímos informações reais do PDF/DOCX.</Text>
  </View>;
}
