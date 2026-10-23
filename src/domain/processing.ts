export const PROCESSING_DURATION = 3000;
export const PROCESSING_STEPS = [
  'Recebendo informações da vaga', 'Preparando currículo', 'Identificando competências',
  'Comparando requisitos', 'Preparando recomendações',
];

export function simulateProcessing(onProgress: (percent: number) => void, onComplete: () => void) {
  let active = true;
  const startedAt = Date.now();
  onProgress(0);
  const interval = setInterval(() => {
    if (active) onProgress(Math.min(99, Math.round((Date.now() - startedAt) / PROCESSING_DURATION * 100)));
  }, 100);
  const timeout = setTimeout(() => {
    if (!active) return;
    active = false;
    clearInterval(interval);
    onProgress(100);
    onComplete();
  }, PROCESSING_DURATION);
  return () => { active = false; clearInterval(interval); clearTimeout(timeout); };
}
