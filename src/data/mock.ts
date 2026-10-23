import type { Analysis, DemoPreferences, Job, ResumeDocument, ResumeProfile, User } from './types';
import { createMockResult } from './results';
import { createJourney } from './roadmaps';

export const defaultUser: User = {
  name: 'Marina Ferreira',
  email: 'marina.ferreira@example.com',
  formation: 'Análise e Desenvolvimento de Sistemas',
  interestArea: 'Desenvolvimento backend',
  objective: 'Conquistar uma oportunidade como Desenvolvedora Python Júnior.',
  location: 'São Paulo, SP',
  skills: ['Python', 'Flask', 'SQL', 'Git', 'APIs REST', 'Comunicação', 'Trabalho em equipe'],
};

export const emptyJob: Job = {
  title: '', company: '', mode: 'Remoto', location: '', description: '',
  technicalRequirements: '', behavioralRequirements: '',
};

export const demoJob: Job = {
  title: 'Desenvolvedor Python Júnior',
  company: 'Tech Solutions',
  mode: 'Remoto',
  location: '',
  description: 'Desenvolvimento de APIs REST, integrações de sistemas e colaboração com equipes de tecnologia.',
  technicalRequirements: 'Python, Flask, APIs REST, SQL, Git, Docker, Pytest, CI/CD',
  behavioralRequirements: 'Comunicação, trabalho em equipe e proatividade',
};

export const demoResume: ResumeProfile = {
  name: defaultUser.name,
  formation: defaultUser.formation,
  summary: 'Desenvolvedora em formação com foco em Python e Flask, APIs REST e integração de sistemas. Busca aplicar conhecimentos acadêmicos em soluções com impacto real.',
  skills: [...defaultUser.skills],
  experiences: [
    { id: 'apis', title: 'Desenvolvimento de APIs REST', description: 'Projetos acadêmicos com rotas Flask e organização de serviços backend.' },
    { id: 'integration', title: 'Integração de sistemas', description: 'Consumo de APIs e troca de informações entre aplicações demonstrativas.' },
    { id: 'database', title: 'Projetos com banco de dados', description: 'Modelagem e consultas SQL em projetos de Análise e Desenvolvimento de Sistemas.' },
  ],
};

export const demoDocument: ResumeDocument = {
  id: 'resume-marina-demo', name: 'Curriculo_Marina_Demonstracao.pdf', type: 'PDF',
  mimeType: 'application/pdf', size: 245760, source: 'demo',
};

export const defaultPreferences: DemoPreferences = { showTips: true, expandJourneyStages: true };

export const professionalTips = [
  { id: 'summary', title: 'Um bom resumo faz diferença', description: 'Destaque resultados, não apenas tarefas. Use números sempre que puder.' },
  { id: 'technologies', title: 'Dê contexto às suas tecnologias', description: 'Conte onde utilizou cada ferramenta e qual problema o projeto resolveu.' },
  { id: 'portfolio', title: 'Mostre o que você construiu', description: 'Inclua links para um GitHub organizado ou portfólio com projetos documentados.' },
];

// Each preloaded opportunity has its own fictional result, not the Python feedback.
export function createInitialData() {
  const analyses: Analysis[] = [
    {
      id: 'marketing', createdAt: '2026-10-22T14:00:00.000Z', status: 'completed',
      job: { ...emptyJob, title: 'Estágio em Marketing', company: 'Lumina Studio',
        description: 'Apoiar campanhas digitais e acompanhar indicadores de conteúdo.',
        technicalRequirements: 'Planejamento de conteúdo, métricas e ferramentas digitais',
        behavioralRequirements: 'Comunicação e criatividade' },
      document: { ...demoDocument }, demoProfileName: demoResume.name,
      result: createMockResult('marketing'),
    },
    {
      id: 'projetos', createdAt: '2026-10-20T10:00:00.000Z', status: 'completed',
      job: { ...emptyJob, title: 'Analista de Projetos Jr.', company: 'Instituto Aurora',
        description: 'Organizar entregas, acompanhar cronogramas e comunicar o andamento de projetos.',
        technicalRequirements: 'Planejamento, cronogramas e indicadores de projetos',
        behavioralRequirements: 'Organização, comunicação e colaboração' },
      document: { ...demoDocument }, demoProfileName: demoResume.name,
      result: createMockResult('projects'),
    },
  ];
  const journey = createJourney(analyses[1]);
  journey.stages[0].activities[0].done = true;
  journey.stages[0].activities[1].done = true;
  return { analyses, journeys: [journey], activeJourneyId: journey.id };
}
