import {create} from 'zustand';
import {Analysis, initialAnalyses, initialTasks, demoJob} from '../data/mock';
type Job={title:string;company:string;mode:string;description:string;requirements:string};
type Task=(typeof initialTasks)[number];
type State={job:Job;fileName:string;analyses:Analysis[];tasks:Task[];setJob:(value:Partial<Job>)=>void;setFile:(name:string)=>void;addDemoAnalysis:()=>void;toggleTask:(id:number)=>void};
export const useDemo=create<State>((set)=>({
 job:{title:'',company:'',mode:'Remoto',description:'',requirements:''},fileName:'',analyses:initialAnalyses,tasks:initialTasks,
 setJob:(value)=>set(s=>({job:{...s.job,...value}})),
 setFile:(name)=>set({fileName:name}),
 addDemoAnalysis:()=>set(s=>({analyses:s.analyses.some(a=>a.id==='python')?s.analyses:[{id:'python',title:s.job.title||demoJob.title,company:s.job.company||demoJob.company,score:78,status:'Jornada iniciada'},...s.analyses]})),
 toggleTask:(id)=>set(s=>({tasks:s.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)})),
}));
