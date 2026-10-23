const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createDemoStore, STORAGE_KEY } = require('../src/store/createDemoStore.ts');
const { queuedStorage } = require('../src/store/persistence.ts');
const { demoDocument, demoJob, defaultUser, emptyJob } = require('../src/data/mock.ts');
const { journeyProgress, filterAnalyses } = require('../src/domain/selectors.ts');
const { documentMetadata, MAX_DOCUMENT_SIZE, validateDocument, validateJob, validateUser } = require('../src/domain/validation.ts');
const { simulateProcessing } = require('../src/domain/processing.ts');

function memoryStorage() {
  const data = new Map();
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); }, removeItem: key => { data.delete(key); } };
}

async function setup(storage = memoryStorage()) {
  const store = createDemoStore(storage);
  await store.persist.rehydrate();
  return { store, storage };
}

function pythonAnalysis(store) {
  store.getState().startNewAnalysis();
  store.getState().fillExample();
  const id = store.getState().prepareAnalysis();
  assert.ok(id);
  store.getState().completeAnalysis(id);
  return id;
}

test('initial dashboard and journey use the same coherent progress', async () => {
  const { store } = await setup();
  const state = store.getState();
  assert.equal(state.hasHydrated, true);
  assert.equal(state.analyses.length, 2);
  const journey = state.journeys.find(item => item.id === state.activeJourneyId);
  assert.equal(journey.analysisId, 'projetos');
  assert.equal(journeyProgress(journey).percent, 33);
  assert.equal(journeyProgress(journey).done, 2);
  assert.equal(journeyProgress().percent, 0);
  assert.equal(state.analyses.find(item => item.id === 'marketing').result.scenario, 'marketing');
});

test('required fields and local profile are validated', () => {
  assert.equal(Object.keys(validateJob(emptyJob)).length, 5);
  assert.deepEqual(validateJob(demoJob), {});
  assert.ok(validateJob({ ...demoJob, mode: 'anything' }).mode);
  assert.ok(validateUser({ ...defaultUser, email: 'invalid' }).email);
});

test('picker validation enforces extensions, known sizes and the 10 MB boundary', () => {
  assert.equal(validateDocument({ name: 'Curriculo.PDF', size: MAX_DOCUMENT_SIZE }), null);
  assert.equal(validateDocument({ name: 'curriculo.docx', size: 128 }), null);
  assert.ok(validateDocument({ name: 'curriculo.pdf.exe', size: 128 }));
  assert.ok(validateDocument({ name: 'curriculo.pdf', size: MAX_DOCUMENT_SIZE + 1 }));
  assert.ok(validateDocument({ name: 'curriculo.pdf', size: undefined }));
  assert.ok(validateDocument({ name: 'curriculo.pdf', size: 0 }));
  assert.ok(validateDocument({ name: 'curriculo.pdf', size: NaN }));
  const metadata = documentMetadata({ name: 'curriculo.docx', size: 256, uri: 'secret' }, 'document-id');
  assert.equal(metadata.type, 'DOCX');
  assert.equal(metadata.uri, undefined);
});

test('analysis creation and completion are idempotent; a new request gets a new stable ID', async () => {
  const { store } = await setup();
  assert.equal(store.getState().prepareAnalysis(), null);
  store.getState().fillExample();
  const id = store.getState().prepareAnalysis();
  assert.equal(store.getState().prepareAnalysis(), id);
  assert.equal(store.getState().analyses.length, 3);
  assert.equal(store.getState().analyses[0].status, 'processing');
  assert.equal(store.getState().completeAnalysis(id), true);
  const result = store.getState().analyses[0].result;
  assert.equal(result.score, 78);
  assert.deepEqual(result.categories.map(item => item.score), [82, 75, 90, 70]);
  store.getState().completeAnalysis(id);
  assert.equal(store.getState().analyses[0].result, result);
  assert.equal(store.getState().analyses.length, 3);
  const second = pythonAnalysis(store);
  assert.notEqual(second, id);
  assert.equal(store.getState().analyses.length, 4);
  assert.equal(store.getState().completeAnalysis('missing'), false);
});

test('custom jobs are explicitly fictional and do not silently receive the Python feedback', async () => {
  const { store } = await setup();
  store.getState().setJob({ ...demoJob, company: 'Outra empresa' });
  const id = store.getState().prepareAnalysis();
  store.getState().setJob({ title: 'Vaga editada depois' });
  store.getState().completeAnalysis(id);
  const analysis = store.getState().analyses.find(item => item.id === id);
  assert.equal(analysis.job.title, demoJob.title);
  assert.equal(analysis.result.scenario, 'custom');
  assert.match(analysis.result.explanation, /valor fixo de demonstração/);
  assert.equal(analysis.result.score, 65);
  assert.ok(!analysis.result.strengths.includes('Flask'));
});

test('journeys belong to an analysis, have nine Python tasks and never share completion state', async () => {
  const { store } = await setup();
  const firstId = pythonAnalysis(store);
  const firstJourneyId = store.getState().createJourneyForAnalysis(firstId);
  assert.equal(store.getState().createJourneyForAnalysis(firstId), firstJourneyId);
  const secondId = pythonAnalysis(store);
  const secondJourneyId = store.getState().createJourneyForAnalysis(secondId);
  const first = store.getState().journeys.find(item => item.id === firstJourneyId);
  assert.equal(journeyProgress(first).total, 9);
  const activityId = first.stages[0].activities[0].id;
  store.getState().toggleTask(firstJourneyId, activityId);
  assert.equal(journeyProgress(store.getState().journeys.find(item => item.id === firstJourneyId)).percent, 11);
  assert.equal(journeyProgress(store.getState().journeys.find(item => item.id === secondJourneyId)).percent, 0);
  store.getState().toggleTask(firstJourneyId, activityId);
  assert.equal(journeyProgress(store.getState().journeys.find(item => item.id === firstJourneyId)).percent, 0);
  for (const activity of journeyProgress(first).activities) store.getState().toggleTask(firstJourneyId, activity.id);
  assert.equal(journeyProgress(store.getState().journeys.find(item => item.id === firstJourneyId)).percent, 100);
  assert.equal(store.getState().analyses.find(item => item.id === firstId).result.score, 78);
  assert.equal(store.getState().createJourneyForAnalysis('missing'), null);
});

test('history filters/search handle completed, pending, accents, company and empty states', async () => {
  const { store } = await setup();
  store.getState().fillExample();
  store.getState().prepareAnalysis();
  const analyses = store.getState().analyses;
  assert.equal(filterAnalyses(analyses, 'all', '').length, 3);
  assert.equal(filterAnalyses(analyses, 'processing', '').length, 1);
  assert.equal(filterAnalyses(analyses, 'completed', '').length, 2);
  assert.equal(filterAnalyses(analyses, 'all', 'ESTAGIO').length, 1);
  assert.equal(filterAnalyses(analyses, 'all', 'tech solutions').length, 1);
  assert.equal(filterAnalyses(analyses, 'all', 'missing').length, 0);
  assert.equal(filterAnalyses([], 'all', '').length, 0);
});

test('profile, preferences, drafts, document removal and task progress survive reopening', async () => {
  const { store, storage } = await setup();
  const id = pythonAnalysis(store);
  const journeyId = store.getState().createJourneyForAnalysis(id);
  const journey = store.getState().journeys.find(item => item.id === journeyId);
  store.getState().toggleTask(journeyId, journey.stages[0].activities[0].id);
  store.getState().saveUser({ ...defaultUser, name: 'Marina Editada', skills: ['Python', 'Docker'] });
  store.getState().setPreferences({ showTips: false });
  store.getState().setJob({ title: 'Rascunho preservado' });
  store.getState().clearDocument();
  const reopened = (await setup(storage)).store;
  assert.equal(reopened.getState().user.name, 'Marina Editada');
  assert.equal(reopened.getState().preferences.showTips, false);
  assert.equal(reopened.getState().job.title, 'Rascunho preservado');
  assert.equal(reopened.getState().document, null);
  assert.equal(journeyProgress(reopened.getState().journeys.find(item => item.id === journeyId)).done, 1);
  assert.equal(reopened.getState().activeJourneyId, journeyId);
});

test('document contents, picker URIs and lifecycle state are never persisted', async () => {
  const { store, storage } = await setup();
  store.getState().setDocument({ ...demoDocument, source: 'device', uri: 'private-file-uri', base64: 'private-content', file: {} });
  pythonAnalysis(store);
  const raw = storage.getItem(STORAGE_KEY);
  assert.ok(!raw.includes('private-file-uri'));
  assert.ok(!raw.includes('private-content'));
  assert.ok(!raw.includes('hasHydrated'));
  assert.ok(!raw.includes('storageError'));
});

test('reset restores an isolated seed snapshot and remains reset after reopening', async () => {
  const { store, storage } = await setup();
  pythonAnalysis(store);
  store.getState().saveUser({ ...defaultUser, name: 'Alterada' });
  store.getState().clearDocument();
  store.getState().resetAll();
  const reopened = (await setup(storage)).store;
  assert.equal(reopened.getState().analyses.length, 2);
  assert.equal(reopened.getState().user.name, 'Marina Ferreira');
  assert.equal(reopened.getState().document.source, 'demo');
  assert.equal(reopened.getState().job.title, '');
  assert.equal(journeyProgress(reopened.getState().journeys[0]).done, 2);
});

test('corrupted storage falls back safely and exposes a recovery message', async () => {
  for (const content of ['not json', JSON.stringify({ state: { user: null }, version: 1 })]) {
    const storage = memoryStorage();
    storage.setItem(STORAGE_KEY, content);
    const { store } = await setup(storage);
    assert.equal(store.getState().hasHydrated, true);
    assert.equal(store.getState().analyses.length, 2);
    assert.ok(store.getState().storageError);
    assert.equal(storage.getItem(STORAGE_KEY), content, 'Hydration alone must not erase an unreadable snapshot');
  }
});

test('queued persistence prevents out-of-order writes and reset races', async () => {
  const data = new Map();
  const storage = queuedStorage({
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => new Promise(resolve => setTimeout(() => { data.set(key, value); resolve(); }, value === 'old' ? 15 : 0)),
    removeItem: key => { data.delete(key); },
  }, () => assert.fail('Unexpected storage failure'));
  storage.setItem('key', 'old');
  storage.setItem('key', 'new');
  storage.setItem('key', 'reset');
  await storage.flush();
  assert.equal(data.get('key'), 'reset');
});

test('storage write failures are handled without unhandled promise rejections', async () => {
  const failures = [];
  const storage = queuedStorage({ getItem: () => null, setItem: async () => { throw new Error('Disk unavailable'); }, removeItem: () => {} }, message => failures.push(message));
  await storage.setItem('key', 'value');
  await storage.flush();
  assert.equal(failures.length, 1);
  assert.match(failures[0], /Não foi possível salvar/);
});

test('processing completes exactly once around three seconds', context => {
  context.mock.timers.enable({ apis: ['Date', 'setInterval', 'setTimeout'], now: 0 });
  let finished = 0;
  let progress = 0;
  const cleanup = simulateProcessing(value => { progress = value; }, () => { finished += 1; });
  context.mock.timers.tick(2999);
  assert.equal(finished, 0);
  context.mock.timers.tick(1);
  assert.equal(finished, 1);
  assert.equal(progress, 100);
  context.mock.timers.tick(10000);
  assert.equal(finished, 1);
  cleanup();
});

test('processing cleanup prevents callbacks after blur/unmount and Strict Mode reruns', context => {
  context.mock.timers.enable({ apis: ['Date', 'setInterval', 'setTimeout'], now: 0 });
  let finished = 0;
  const cancelled = simulateProcessing(() => {}, () => { finished += 1; });
  cancelled();
  context.mock.timers.tick(5000);
  assert.equal(finished, 0);
  const cleanup = simulateProcessing(() => {}, () => { finished += 1; });
  context.mock.timers.tick(3000);
  assert.equal(finished, 1);
  cleanup();
});
