import type { StateStorage } from 'zustand/middleware';
import type { Analysis, CompatibilityResult, Job, Journey, ResumeDocument, ResumeProfile, User } from '../data/types';
import { validateDocument } from '../domain/validation';
import type { PersistedDemoState } from './types';

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');
const stringFields = (value: Record<string, unknown>, keys: string[]) => keys.every(key => typeof value[key] === 'string');
const score = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;
const date = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value));
const nullableId = (value: unknown) => value === null || typeof value === 'string';

function validUser(value: unknown): value is User {
  return record(value) && stringFields(value, ['name', 'email', 'formation', 'interestArea', 'objective', 'location']) && strings(value.skills);
}

function validJob(value: unknown): value is Job {
  return record(value) && stringFields(value, ['title', 'company', 'mode', 'location', 'description', 'technicalRequirements', 'behavioralRequirements'])
    && ['Remoto', 'Presencial', 'Híbrido'].includes(String(value.mode));
}

function validDocument(value: unknown): value is ResumeDocument {
  return record(value) && stringFields(value, ['id', 'name', 'type', 'mimeType'])
    && ['PDF', 'DOCX'].includes(String(value.type)) && ['demo', 'device'].includes(String(value.source))
    && typeof value.size === 'number' && !validateDocument({ name: String(value.name), size: value.size });
}

function validResult(value: unknown): value is CompatibilityResult {
  return record(value) && value.simulated === true && score(value.score)
    && ['python', 'marketing', 'projects', 'custom'].includes(String(value.scenario))
    && stringFields(value, ['classification', 'explanation']) && strings(value.strengths) && strings(value.gaps)
    && strings(value.feedback) && strings(value.resumeTips) && Array.isArray(value.categories)
    && value.categories.every(item => record(item) && stringFields(item, ['id', 'title']) && score(item.score));
}

function validAnalysis(value: unknown): value is Analysis {
  return record(value) && stringFields(value, ['id', 'demoProfileName']) && date(value.createdAt)
    && validJob(value.job) && validDocument(value.document)
    && ((value.status === 'processing' && value.result === null) || (value.status === 'completed' && validResult(value.result)));
}

function validProfile(value: unknown): value is ResumeProfile {
  return record(value) && stringFields(value, ['name', 'formation', 'summary']) && strings(value.skills)
    && Array.isArray(value.experiences) && value.experiences.every(item => record(item) && stringFields(item, ['id', 'title', 'description']));
}

function validJourney(value: unknown): value is Journey {
  return record(value) && stringFields(value, ['id', 'analysisId']) && date(value.createdAt)
    && Array.isArray(value.stages) && value.stages.every(stage => record(stage) && stringFields(stage, ['id', 'title'])
      && Array.isArray(stage.activities) && stage.activities.every(activity => record(activity)
        && stringFields(activity, ['id', 'title', 'objective', 'description', 'competence'])
        && typeof activity.done === 'boolean' && typeof activity.durationMinutes === 'number' && activity.durationMinutes > 0
        && strings(activity.steps) && Array.isArray(activity.resources) && activity.resources.every(item => record(item)
          && stringFields(item, ['id', 'title', 'description', 'url']) && String(item.url).startsWith('https://'))));
}

function onlyMetadata(document: ResumeDocument): ResumeDocument {
  const { id, name, type, mimeType, size, source } = document;
  return { id, name, type, mimeType, size, source };
}

export function readPersistedState(value: unknown): Partial<PersistedDemoState> {
  if (value === undefined || value === null) return {};
  if (!record(value) || !validUser(value.user) || !validJob(value.job) || !validProfile(value.resume)
    || !record(value.preferences) || typeof value.preferences.showTips !== 'boolean' || typeof value.preferences.expandJourneyStages !== 'boolean'
    || !nullableId(value.activeJourneyId) || !nullableId(value.draftAnalysisId)
    || !(value.document === null || validDocument(value.document))
    || !Array.isArray(value.analyses) || !value.analyses.every(validAnalysis)
    || !Array.isArray(value.journeys) || !value.journeys.every(validJourney)) {
    throw new Error('Formato de dados locais inválido.');
  }
  const data = value as unknown as PersistedDemoState;
  if (new Set(data.analyses.map(item => item.id)).size !== data.analyses.length
    || new Set(data.journeys.map(item => item.analysisId)).size !== data.journeys.length
    || data.journeys.some(item => !data.analyses.some(analysis => analysis.id === item.analysisId && analysis.status === 'completed'))) {
    throw new Error('Referências locais inconsistentes.');
  }
  return {
    user: { ...data.user, skills: [...data.user.skills] }, preferences: { ...data.preferences },
    job: { ...data.job }, resume: data.resume,
    document: data.document ? onlyMetadata(data.document) : null,
    analyses: data.analyses.map(item => ({ ...item, document: onlyMetadata(item.document) })),
    journeys: data.journeys,
    draftAnalysisId: data.analyses.some(item => item.id === data.draftAnalysisId) ? data.draftAnalysisId : null,
    activeJourneyId: data.journeys.some(item => item.id === data.activeJourneyId) ? data.activeJourneyId : null,
  };
}

// Serialize writes so a rapid toggle/reset can never be overwritten by an older save.
export function queuedStorage(storage: StateStorage, onError: (message: string) => void): StateStorage & { flush: () => Promise<void> } {
  let queue: Promise<void> = Promise.resolve();
  const enqueue = (operation: () => unknown) => {
    queue = queue.then(operation).then(() => undefined).catch(() => {
      onError('Não foi possível salvar no dispositivo. Seu progresso atual está em memória; tente novamente em Configurações.');
    });
    return queue;
  };
  return {
    getItem: async name => { await queue; return storage.getItem(name); },
    setItem: (name, value) => enqueue(() => storage.setItem(name, value)),
    removeItem: name => enqueue(() => storage.removeItem(name)),
    flush: async () => { let pending; do { pending = queue; await pending; } while (pending !== queue); },
  };
}
