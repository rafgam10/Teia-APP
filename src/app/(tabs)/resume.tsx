import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { DocumentSelection } from '@/components/DocumentSelection';
import { Btn, Card, DemoNotice, PageTitle, Screen, Tag, s } from '@/components/UI';
import { newAnalysis } from '@/navigation/actions';
import { useDemo } from '@/store/useDemo';
import { C } from '@/theme/colors';

export default function Resume() {
  const user = useDemo(state => state.user);
  const resume = useDemo(state => state.resume);
  const analyses = useDemo(state => state.analyses);
  const latestResult = analyses.find(item => item.status === 'completed')?.result;
  const initials = user.name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('');
  return <Screen tab>
    <PageTitle title="Meu currículo" subtitle="Seu perfil profissional e o documento selecionado." />
    <Card><View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.lime, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
      <Text style={{ color: C.green, fontWeight: '900', fontSize: 23 }}>{initials}</Text>
    </View><Text style={s.sectionTitle}>{user.name}</Text><Text style={s.muted}>{user.formation}</Text>
      <Btn title="Editar perfil profissional" secondary onPress={() => router.push('/profile')} />
    </Card>
    <Card><Text style={s.sectionTitle}>Resumo profissional</Text><Text style={s.body}>{resume.summary}</Text><Text style={[s.small, { marginTop: 10 }]}>Texto de exemplo; não extraído do arquivo.</Text></Card>
    <Card><Text style={s.sectionTitle}>Competências</Text><View style={s.wrap}>{user.skills.map(skill => <Tag key={skill} text={skill} />)}</View>
      {!user.skills.length && <Text style={s.muted}>Adicione habilidades no seu perfil.</Text>}
    </Card>
    <Card><Text style={s.sectionTitle}>Experiências demonstrativas</Text>{resume.experiences.map(item => <View key={item.id} style={{ marginBottom: 14 }}>
      <Text style={s.strong}>{item.title}</Text><Text style={[s.body, { marginTop: 4 }]}>{item.description}</Text>
    </View>)}</Card>
    <Text style={s.sectionTitle}>Documento selecionado</Text><DocumentSelection />
    <Card style={{ backgroundColor: C.yellow }}><Text style={s.sectionTitle}>Como melhorar seu currículo?</Text>
      {(latestResult?.resumeTips ?? ['Descrever projetos utilizando resultados mensuráveis.', 'Destacar as tecnologias utilizadas.', 'Incluir links para GitHub ou portfólio.']).map(tip => <Text key={tip} style={[s.body, { marginBottom: 12 }]}>• {tip}</Text>)}
      {latestResult?.scenario === 'python' && <Text style={s.body}>• Se você já pratica Docker, Pytest ou CI/CD, inclua exemplos concretos. Não mencionar uma tecnologia não significa não conhecê-la.</Text>}
      <Text style={s.small}>Recomendações do resultado demonstrativo mais recente, sem leitura do documento.</Text>
    </Card>
    <DemoNotice message="Seu perfil editável é local. Nas análises, qualquer documento é associado ao perfil fictício de Marina Ferreira; os dados do arquivo não são extraídos." />
    <Btn title="Analisar outra vaga" onPress={() => newAnalysis()} />
  </Screen>;
}
