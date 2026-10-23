import type { Analysis, AnalysisFilter, Journey } from '../data/types';
import { normalizeText } from '../data/results';

export function journeyProgress(journey?: Journey) {
  const activities = journey?.stages.flatMap(stage => stage.activities) ?? [];
  const done = activities.filter(activity => activity.done).length;
  return { activities, done, total: activities.length, percent: activities.length ? Math.round(done / activities.length * 100) : 0 };
}

export function filterAnalyses(analyses: Analysis[], filter: AnalysisFilter, query: string) {
  const search = normalizeText(query);
  return analyses.filter(analysis => (filter === 'all' || analysis.status === filter)
    && normalizeText(`${analysis.job.title} ${analysis.job.company}`).includes(search));
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}h${rest ? ` ${rest}min` : ''}` : `${rest}min`;
}

export function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
