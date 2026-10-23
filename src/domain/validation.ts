import type { Job, ResumeDocument, User } from '../data/types';

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
export const DOCUMENT_MIME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export function validateJob(job: Job): Partial<Record<keyof Job, string>> {
  const errors: Partial<Record<keyof Job, string>> = {};
  const labels: Partial<Record<keyof Job, string>> = {
    title: 'Informe o título da vaga.', company: 'Informe a empresa.',
    description: 'Descreva a oportunidade.', technicalRequirements: 'Informe os requisitos técnicos.',
    behavioralRequirements: 'Informe os requisitos comportamentais.',
  };
  for (const key of Object.keys(labels) as (keyof Job)[]) {
    if (!job[key].trim()) errors[key] = labels[key];
  }
  if (!['Remoto', 'Presencial', 'Híbrido'].includes(job.mode)) errors.mode = 'Selecione uma modalidade válida.';
  return errors;
}

export function validateUser(user: User): Partial<Record<keyof User, string>> {
  const errors: Partial<Record<keyof User, string>> = {};
  if (!user.name.trim()) errors.name = 'Informe seu nome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) errors.email = 'Informe um e-mail válido.';
  if (!user.formation.trim()) errors.formation = 'Informe sua formação.';
  return errors;
}

export function validateDocument(file: { name: string; size?: number }): string | null {
  if (!/\.(pdf|docx)$/i.test(file.name)) return 'Selecione um arquivo PDF ou DOCX.';
  if (file.size === undefined || !Number.isFinite(file.size)) return 'Não foi possível verificar o tamanho. Escolha outro documento ou use o exemplo.';
  if (file.size <= 0) return 'O documento está vazio.';
  if (file.size > MAX_DOCUMENT_SIZE) return 'O documento deve ter no máximo 10 MB.';
  return null;
}

export function documentMetadata(file: { name: string; size: number }, id: string): ResumeDocument {
  const pdf = /\.pdf$/i.test(file.name);
  return { id, name: file.name, size: file.size, type: pdf ? 'PDF' : 'DOCX',
    mimeType: DOCUMENT_MIME_TYPES[pdf ? 0 : 1], source: 'device' };
}
