import type { CompatibilityResult, DemoScenario, Job } from './types';

const resumeTips = [
  'Descrever projetos utilizando resultados mensuráveis.',
  'Destacar as tecnologias utilizadas e o contexto de aplicação.',
  'Incluir links para GitHub ou portfólio com projetos documentados.',
];

const categories = (technical: number, experience: number, education: number, behavior: number) => [
  { id: 'technical', title: 'Habilidades técnicas', score: technical },
  { id: 'experience', title: 'Experiência', score: experience },
  { id: 'education', title: 'Formação', score: education },
  { id: 'behavior', title: 'Habilidades comportamentais', score: behavior },
];

export function createMockResult(scenario: DemoScenario): CompatibilityResult {
  const base = {
    scenario, simulated: true as const, resumeTips: [...resumeTips],
    explanation: 'Cenário demonstrativo com números e comentários pré-definidos. Não há leitura do documento, IA ou previsão de contratação.',
  };
  if (scenario === 'python') return {
    ...base, score: 78, classification: 'Boa aderência simulada',
    strengths: ['Python', 'Flask', 'SQL', 'Git', 'Desenvolvimento de APIs'],
    gaps: ['Docker', 'Testes com Pytest', 'CI/CD'],
    categories: categories(82, 75, 90, 70),
    feedback: [
      'No perfil demonstrativo de Marina, Python, Flask, SQL, Git e projetos com APIs REST estão alinhados ao exemplo de vaga.',
      'Docker, testes com Pytest e CI/CD não estão demonstrados nesse perfil de exemplo. Isso não significa que a pessoa não possua essas competências.',
      'A jornada propõe práticas para desenvolver ou evidenciar essas competências. Concluir tarefas não altera automaticamente o score fictício.',
    ],
  };
  if (scenario === 'marketing') return {
    ...base, score: 87, classification: 'Alta aderência fictícia',
    strengths: ['Comunicação', 'Colaboração', 'Organização de conteúdo'],
    gaps: ['Métricas de campanhas', 'Portfólio de conteúdo', 'Planejamento editorial'],
    categories: categories(84, 80, 92, 92),
    feedback: ['Este exemplo de marketing usa um cenário fictício independente do currículo selecionado.',
      'As recomendações ilustram como evidenciar métricas e projetos. Não representam uma avaliação das capacidades de Marina.'],
  };
  if (scenario === 'projects') return {
    ...base, score: 72, classification: 'Aderência moderada fictícia',
    strengths: ['Trabalho em equipe', 'Organização', 'Projetos acadêmicos'],
    gaps: ['Planejamento de entregas', 'Indicadores de projetos', 'Comunicação de resultados'],
    categories: categories(70, 65, 85, 78),
    feedback: ['Este cenário de projetos é inteiramente fictício e serve para demonstrar o acompanhamento de uma jornada.',
      'Os pontos a desenvolver indicam evidências a praticar, não a ausência de capacidade profissional.'],
  };
  return {
    ...base, score: 65, classification: 'Exemplo fictício — não calculado',
    explanation: 'Vaga personalizada: 65% é um valor fixo de demonstração, não calculado a partir da vaga ou do arquivo. As recomendações abaixo são genéricas e fictícias.',
    strengths: ['Apresentação do perfil (exemplo)', 'Experiências descritas (exemplo)', 'Competências declaradas (exemplo)'],
    gaps: ['Resultados mensuráveis', 'Portfólio demonstrável', 'Preparação para entrevista'],
    categories: categories(65, 60, 80, 70),
    feedback: ['Nenhuma competência foi extraída do documento e nenhum requisito desta vaga foi avaliado automaticamente.',
      'Use este cenário genérico apenas para conhecer a experiência do aplicativo. Não interprete as pontuações como avaliação profissional.'],
  };
}

export function normalizeText(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('pt-BR');
}

export function isExampleJob(job: Job, example: Job) {
  return (Object.keys(example) as (keyof Job)[]).every(key => normalizeText(job[key]) === normalizeText(example[key]));
}
