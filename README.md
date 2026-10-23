# TEIA Carreiras

MVP mobile demonstrativo de análise de currículo e jornada de qualificação, com **Expo SDK 58, React Native, TypeScript, Expo Router, Zustand e AsyncStorage**.

**Não há backend, autenticação, banco remoto ou IA.** Resultados, experiências e roteiros são fictícios. Nenhum documento é enviado ou lido.

## Executar

Requer Node.js compatível com o Expo SDK 58 (22.13+; validado com Node 24) e npm.

```bash
npm install
npx expo start
```

- Android: pressione `a` com um emulador disponível ou abra pelo Expo Go compatível com o SDK 58.
- iOS: use um dispositivo com Expo Go compatível ou o simulador em um Mac.
- Navegador: pressione `w` ou execute `npm run web`.
- Se estiver vendo o antigo template, reinicie com `npx expo start --clear`.

Document Picker e AsyncStorage são incluídos no Expo Go para este SDK. Para módulos nativos que não estejam incluídos, será necessário um development build. Nenhum projeto `android/` ou `ios/` precisa ser editado manualmente.

## Roteiro para apresentação

1. No início, veja as duas análises fictícias e a jornada inicial de Projetos (2/6 tarefas).
2. Toque em **Nova análise → Preencher com exemplo → Continuar**.
3. Use o currículo de demonstração ou selecione PDF/DOCX de até 10 MB.
4. Toque em **Analisar compatibilidade**. Após cerca de 3 segundos, veja o resultado simulado de **78%** para o exemplo de Python.
5. Toque em **Criar jornada**. O roteiro contém nove atividades de Docker, Pytest e CI/CD.
6. Marque/desmarque tarefas ou abra seus detalhes. O início e a jornada mostram o mesmo progresso.
7. Reabra o aplicativo para demonstrar persistência. O histórico permite pesquisa e filtros.
8. Acesse Perfil pelo avatar e Configurações pelo início ou perfil. A restauração de dados pede confirmação.

Vagas diferentes do exemplo recebem **65% como valor fixo explicitamente fictício**, com recomendações genéricas; isso não é uma análise dos requisitos reais. Abrir um resultado novamente não cria outra análise. Cada nova solicitação tem um identificador próprio e uma jornada independente. Um formulário ainda não enviado é retomado ao voltar pela ação Nova análise, inclusive após reabrir o app.

## Telas

Tabs: **Início**, **Análises**, **Jornada**, **Currículo**.

Stack: **Nova análise**, **Anexar currículo**, **Processamento**, **Resultado**, **Detalhes da atividade**, **Perfil**, **Configurações**.

As rotas estão exclusivamente em `src/app/`. O antigo `app/` foi incorporado a essa estrutura porque o Expo prioriza `src/app/` quando ambos existem.

## Dados locais e privacidade

- O estado é separado em slices de usuário, análises, currículo e jornadas, persistidos em um único snapshot coerente.
- A chave do AsyncStorage é `teia-carreiras-mvp`.
- Somente metadados do documento (nome, tipo, tamanho e identificador) são mantidos; não são persistidos URI, base64 ou conteúdo.
- O perfil editável é local; análises usam a personagem demonstrativa Marina Ferreira, independentemente do arquivo selecionado.
- AsyncStorage não é criptografado. Não use informações sensíveis nesta demonstração.
- Links de aprendizagem abrem sites externos apenas mediante toque e exigem internet.
- Para restaurar a demonstração, use **Configurações → Restaurar dados mockados**, não o script de template `reset-project`.

## Verificações

```bash
npm test
npx tsc --noEmit
npx expo lint
npx expo install --check
npx expo-doctor
```

`npm test` executa 15 testes de domínio/persistência com o test runner do Node e o TypeScript já instalado, sem dependências adicionais de teste.

Para verificar os bundles (não gera APK/IPA nem exige projetos nativos):

```bash
npx expo export --platform web
npx expo export --platform android --platform ios
```

O web é uma SPA, sem servidor de aplicação. Ao publicar em hospedagem estática, configure fallback das rotas para `index.html`.

Consulte [docs/ENTREGA_MVP.md](docs/ENTREGA_MVP.md) para auditoria, arquivos alterados, validações e limitações.
