export type Analysis = {id:string;title:string;company:string;score:number;status:string};
export const initialAnalyses:Analysis[] = [
  {id:'marketing',title:'Estágio em Marketing',company:'Lumina Studio',score:87,status:'Em andamento'},
  {id:'projetos',title:'Analista de Projetos Jr.',company:'Instituto Aurora',score:72,status:'Jornada iniciada'},
];
export const demoJob = {title:'Desenvolvedor Python Júnior',company:'Tech Solutions',mode:'Remoto',description:'Desenvolvimento de APIs REST, integrações e colaboração com equipes de tecnologia.',requirements:'Python, Flask, SQL, Git, Docker, testes automatizados, CI/CD, APIs REST'};
export const strengths = ['Python e Flask identificados','Experiência com APIs REST','Conhecimento de SQL e Git','Projetos práticos descritos'];
export const gaps = ['Docker não identificado no currículo','Testes automatizados não identificados','CI/CD não identificado no currículo'];
export const initialTasks = [
 {id:1,title:'Entender imagens e containers',group:'Fundamentos de Docker',done:false},
 {id:2,title:'Criar seu primeiro Dockerfile',group:'Fundamentos de Docker',done:false},
 {id:3,title:'Implementar testes com Pytest',group:'Testes automatizados',done:false},
 {id:4,title:'Testar endpoints de uma API Flask',group:'Testes automatizados',done:false},
 {id:5,title:'Criar pipeline no GitHub Actions',group:'Integração contínua',done:false},
];
