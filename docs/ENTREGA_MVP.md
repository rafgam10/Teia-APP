# Entrega — MVP demonstrativo TEIA Carreiras

## Auditoria inicial

- Expo SDK 58, React 19.3, React Native 0.88, TypeScript, Zustand e Expo Document Picker já estavam presentes. O estilo utilizado era `StyleSheet`.
- Existiam duas árvores de rotas: `app/` com o TEIA e `src/app/` com o template Expo. Como `src/app/` tem precedência, as telas TEIA não eram as rotas efetivamente utilizadas.
- As sete telas TEIA existentes eram **Início, Histórico, Jornada, Currículo, Nova análise, Anexar currículo e Resultado**. Foram preservados a identidade visual, os componentes básicos, os exemplos e os caminhos das telas, com integração e complementação funcional.
- Faltavam inicialmente **Processamento, Detalhes da atividade, Perfil e Configurações**. As versões parciais dessas telas presentes durante a implementação também foram integradas e completadas.
- O dashboard tinha progresso fixo de 68% e atividades desconectadas da jornada. O estado não vinculava jornadas a análises. O ID `python` impedia novas análises independentes.
- O mesmo feedback Python era mostrado para Marketing e Projetos. Datas, resultados completos, filtros, pesquisa, tamanho/extensão de arquivo e persistência estavam ausentes ou incompletos.
- Os componentes reutilizáveis eram `PageTitle`, `Card`, `Btn`, `Field` e `Tag`. Foram ampliados, sem troca de biblioteca visual.
- `@expo/vector-icons` era importado sem estar instalado. AsyncStorage e a configuração de lint também foram adicionados. As versões de manutenção foram alinhadas ao SDK 58, sem migração de SDK.

## Funcionalidades entregues

| Tela | Entrega |
| --- | --- |
| Início | Perfil clicável, contadores reais, progresso da jornada ativa, análises recentes, próximas tarefas e dicas configuráveis. |
| Nova análise | Campos controlados, modalidade selecionável, validação por campo, localização opcional, preenchimento por exemplo e rascunho persistente. |
| Anexar currículo | PDF/DOCX, validação até 10 MB, nome/tipo/tamanho, remover/substituir, perfil demonstrativo e nenhum upload/leitura. |
| Processamento | Cinco etapas, indicador visual, duração aproximada de três segundos, limpeza ao sair e possibilidade de retomar no histórico. |
| Resultado | Snapshot da vaga/documento, data, score e categorias simulados, feedback próprio, aviso explícito e criação idempotente de jornada. |
| Histórico | Pesquisa sem distinção de acentos/caixa, filtros, estados vazios e acesso ao resultado ou processamento pendente. |
| Jornada | Seleção da jornada ativa, vínculo por análise, etapas recolhíveis, nove tarefas Python, marcação/desmarcação, detalhes e conclusão. |
| Detalhes da atividade | Objetivo, descrição, duração, competência, passos, recursos externos sugeridos e atualização imediata de status. |
| Currículo | Perfil, formação, resumo, competências, experiências demonstrativas, substituição do documento e recomendações. |
| Perfil | Edição local de todos os campos, incluindo habilidades; validação, salvamento e feedback de persistência. |
| Configurações | Preferências funcionais, versão, conteúdo demonstrativo de privacidade, recuperação de salvamento e restauração confirmada. |

O status do histórico refere-se ao processamento da análise (**Em andamento/Concluída**). A conclusão de uma jornada é apresentada separadamente. Concluir tarefas não recalcula o score fictício.

## Arquivos e organização

### Telas incorporadas de `app/` a `src/app/`

- `src/app/_layout.tsx`
- `src/app/(tabs)/_layout.tsx`
- `src/app/(tabs)/index.tsx`
- `src/app/(tabs)/analyses.tsx`
- `src/app/(tabs)/journey.tsx`
- `src/app/(tabs)/resume.tsx`
- `src/app/analysis/new.tsx`
- `src/app/analysis/upload.tsx`
- `src/app/analysis/result.tsx`

O redirecionamento do antigo `app/index.tsx` deixou de ser necessário: a tab `index` é a rota inicial. Os arquivos `src/app/index.tsx` e `src/app/explore.tsx` do template foram substituídos pelas rotas TEIA; os componentes auxiliares do template não utilizados foram preservados.

### Telas novas/completadas

- `src/app/analysis/processing.tsx`
- `src/app/journey/[id].tsx`
- `src/app/profile.tsx`
- `src/app/settings.tsx`
- `src/app/+not-found.tsx` (tratamento adicional de rota inexistente)

### Componentes e regras de negócio criados

- `src/components/AnalysisCard.tsx`
- `src/components/DocumentSelection.tsx`
- `src/components/app-tabs.shared.tsx`
- `src/hooks/use-document-selection.ts`
- `src/data/types.ts`
- `src/data/results.ts`
- `src/data/roadmaps.ts`
- `src/domain/selectors.ts`
- `src/domain/validation.ts`
- `src/domain/processing.ts`
- `src/navigation/actions.ts`
- `src/store/createDemoStore.ts`
- `src/store/persistence.ts`
- `src/store/types.ts`
- `src/store/utils.ts`
- `src/store/slices/user.ts`
- `src/store/slices/analyses.ts`
- `src/store/slices/resume.ts`
- `src/store/slices/journey.ts`
- `src/types/styles.d.ts`
- `tests/demo.test.cjs`
- `scripts/register-typescript.cjs`
- `eslint.config.js`
- `docs/ENTREGA_MVP.md`

### Outros arquivos modificados

- `src/components/UI.tsx`: layout seguro/responsivo, botões, validação visual, progresso, confirmação e estados vazios.
- `src/components/app-tabs.tsx` e `src/components/app-tabs.web.tsx`: navegação TEIA compartilhada, eliminando a incompatibilidade de `ref` do template web.
- `src/hooks/use-color-scheme.web.ts`: hidratação compatível com as regras atuais de hooks.
- `src/data/mock.ts`: dados consistentes e snapshots independentes.
- `src/store/useDemo.ts`: integração com AsyncStorage, hidratação única, escrita sequencial e feedback de falha.
- `src/theme/colors.ts`: paleta TEIA e estados de erro.
- `app.json`: nome, aparência clara, fundo/splash e web sem servidor de aplicação.
- `package.json` e `package-lock.json`: dependências compatíveis, lint e comandos de verificação/teste.
- `README.md`: execução, demonstração e cuidados com dados locais.

## Verificações e limites

- `npm test`: **15 testes aprovados** de validação, snapshots, IDs, criação idempotente, jornadas independentes, progresso, filtros, persistência, restauração, falhas de armazenamento e temporizadores. A hidratação de um snapshot inválido não o apaga automaticamente.
- `npx tsc --noEmit` e `npx expo lint`: sem erros.
- `npx expo install --check`: dependências compatíveis.
- `npx expo-doctor`: 20/20 verificações aprovadas.
- Exportações de JavaScript/Hermes para Android, iOS e web geradas com sucesso; isso não substitui teste em aparelho ou build de instalação.
- Fluxo de ponta a ponta validado com Chromium/Playwright sobre a exportação web, sem adicionar Playwright às dependências do aplicativo: formulário e rascunho após recarga, seleção real de arquivos PDF/DOCX, extensão inválida, arquivo acima de 10 MB, resultado Python, resultado personalizado fictício, histórico/filtros, criação de jornadas independentes, detalhes, conclusão/desmarcação, persistência, preferências, privacidade e confirmação/cancelamento da restauração.
- Também foram verificados viewport de 320 px sem overflow horizontal, IDs inexistentes, cancelamento/retomada do processamento e ausência de erros de execução no navegador.

### Pendências/limitações explícitas

- Fazer uma conferência final em aparelho Android e iOS (seletor nativo, teclado, recortes e gestos). O ambiente de desenvolvimento desta entrega é Linux; não foi executado um simulador iOS nem instalado APK/IPA.
- `npm audit` sinaliza quatro alertas altos na cadeia transitiva do Expo CLI/`node-forge`. A correção sugerida pelo npm envolve downgrade incompatível do Expo; não foi aplicado `audit fix --force`. Não é bloqueio demonstrado do fluxo local, mas deve ser acompanhado antes de distribuição de produção.
- A política de privacidade é demonstrativa. AsyncStorage não é criptografado; nenhum dado sensível deve ser usado.
- O app não lê o conteúdo de documentos e não tem IA, backend ou autenticação. Recursos externos exigem internet; os dados e o fluxo da demonstração são locais.
- Sem bloqueio conhecido de código para a apresentação; a execução no aparelho escolhido e a compatibilidade do cliente Expo devem ser verificadas previamente.
