import type { Activity, Analysis, Journey, JourneyStage, LearningResource } from './types';

interface TaskSeed {
  id: string;
  title: string;
  objective: string;
  minutes: number;
  steps: string[];
}

const resource = (id: string, title: string, url: LearningResource['url']): LearningResource => ({
  id, title, url, description: 'Recurso sugerido para o roteiro demonstrativo. Abre um site externo e requer internet.',
});

function stage(analysisId: string, id: string, title: string, seeds: TaskSeed[], resources: LearningResource[]): JourneyStage {
  return {
    id: `${analysisId}:${id}`, title,
    activities: seeds.map((seed): Activity => ({
      id: `${analysisId}:${seed.id}`, title: seed.title, objective: seed.objective,
      description: `Atividade prática do roteiro de ${title}. Trabalhe em um projeto de exemplo e registre o que aprendeu. A conclusão é autodeclarada, sem avaliação automática.`,
      durationMinutes: seed.minutes, competence: title, steps: [...seed.steps],
      resources: resources.map(item => ({ ...item })), done: false,
    })),
  };
}

export function createJourney(analysis: Analysis): Journey {
  const id = analysis.id;
  const scenario = analysis.result?.scenario ?? 'custom';
  let stages: JourneyStage[];
  if (scenario === 'python') {
    stages = [
      stage(id, 'docker', 'Docker', [
        { id: 'containers', title: 'Conhecer containers', objective: 'Diferenciar imagens, containers e máquinas virtuais.', minutes: 40,
          steps: ['Leia os conceitos de imagem e container.', 'Execute um container de exemplo.', 'Registre quando containers podem ajudar em um projeto.'] },
        { id: 'dockerfile', title: 'Criar Dockerfile', objective: 'Construir uma imagem para uma aplicação Python.', minutes: 60,
          steps: ['Escolha uma imagem base Python.', 'Copie dependências e código para a imagem.', 'Execute o build e documente o comando.'] },
        { id: 'flask-container', title: 'Containerizar uma API Flask', objective: 'Executar uma API Flask em um container local.', minutes: 90,
          steps: ['Reaproveite o Dockerfile da atividade anterior.', 'Configure a porta e o comando de inicialização.', 'Teste um endpoint e escreva um README.'] },
      ], [resource('docker-docs', 'Docker — primeiros passos', 'https://docs.docker.com/get-started/')]),
      stage(id, 'testing', 'Testes automatizados', [
        { id: 'pytest', title: 'Aprender Pytest', objective: 'Conhecer asserts, fixtures e a execução de testes.', minutes: 45,
          steps: ['Leia a introdução do Pytest.', 'Crie um teste simples com assert.', 'Execute os testes e observe uma falha intencional.'] },
        { id: 'unit-tests', title: 'Criar testes unitários', objective: 'Validar funções com casos de sucesso e de erro.', minutes: 60,
          steps: ['Escolha uma função pequena.', 'Escreva testes para entradas válidas e inválidas.', 'Organize os testes e reutilize uma fixture.'] },
        { id: 'flask-tests', title: 'Testar endpoints Flask', objective: 'Testar respostas HTTP com o cliente de testes Flask.', minutes: 75,
          steps: ['Configure uma aplicação Flask de teste.', 'Teste status e corpo de uma resposta.', 'Inclua cenários de validação e erro.'] },
      ], [resource('pytest-docs', 'Documentação do Pytest', 'https://docs.pytest.org/en/stable/getting-started.html'),
        resource('flask-docs', 'Testes no Flask', 'https://flask.palletsprojects.com/en/stable/testing/')]),
      stage(id, 'cicd', 'CI/CD', [
        { id: 'continuous-integration', title: 'Conhecer integração contínua', objective: 'Entender o papel da integração contínua no desenvolvimento.', minutes: 35,
          steps: ['Estude os conceitos de workflow, job e step.', 'Desenhe um fluxo de validação de código.', 'Liste quais verificações seu projeto deve executar.'] },
        { id: 'github-actions', title: 'Criar workflow no GitHub Actions', objective: 'Configurar um workflow básico para um projeto Python.', minutes: 60,
          steps: ['Crie um arquivo em .github/workflows.', 'Configure checkout e versão do Python.', 'Instale dependências e acompanhe uma execução.'] },
        { id: 'automated-tests', title: 'Automatizar testes', objective: 'Executar o Pytest automaticamente a cada alteração.', minutes: 60,
          steps: ['Adicione o comando pytest ao workflow.', 'Abra uma alteração de exemplo no repositório.', 'Verifique os logs e registre o resultado no portfólio.'] },
      ], [resource('actions-docs', 'GitHub Actions — introdução', 'https://docs.github.com/pt/actions/get-started/understand-github-actions')]),
    ];
  } else {
    const titles = analysis.result?.gaps ?? ['Resultados mensuráveis', 'Portfólio demonstrável', 'Preparação para entrevista'];
    stages = titles.map((title, index) => stage(id, `stage-${index + 1}`, title, [
      { id: `practice-${index + 1}`, title: `Explorar: ${title}`, objective: `Identificar formas de praticar e evidenciar ${title.toLocaleLowerCase('pt-BR')}.`, minutes: 40,
        steps: ['Escolha um projeto ou experiência de exemplo.', 'Liste o que deseja aprender e as evidências necessárias.', 'Planeje uma pequena atividade prática.'] },
      { id: `evidence-${index + 1}`, title: `Registrar evidências: ${title}`, objective: 'Produzir um registro concreto do aprendizado para o currículo ou portfólio.', minutes: 60,
        steps: ['Execute a prática planejada.', 'Registre contexto, ações e resultados.', 'Revise o material e descreva como apresentá-lo em uma entrevista.'] },
    ], [resource('portfolio-guide', 'Guia para organizar um portfólio no GitHub', 'https://docs.github.com/pt/get-started/start-your-journey/hello-world')]));
  }
  return { id: `journey:${id}`, analysisId: id, createdAt: analysis.createdAt, stages };
}
