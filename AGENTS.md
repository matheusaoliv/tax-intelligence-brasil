# Regras para agentes e contribuidores

## Princípios obrigatórios
- Trabalhar a partir de requisitos e critérios de aceite explícitos.
- Antes de alterar código, entender o contexto, dependências, contratos e comportamento existente.
- Não inventar valores, alíquotas, regras ou resultados fiscais.
- Não substituir resultados upstream por cálculo próprio sem decisão arquitetural, testes de equivalência e documentação.
- Registrar entrada, resposta original, versão do motor/base, timestamp, tenant e correlação conforme retenção.
- Diferenciar cálculo, simulação, estimativa e explicação.
- IA explica com fontes versionadas; declarar incerteza e encaminhar ambiguidades para revisão humana.
- Não arredondar dados internamente para facilitar visualização.

## Segurança
- Segredos apenas em variáveis de ambiente/secret manager.
- Autorizar organização e recurso no backend.
- Validar entradas, limitar payloads, aplicar rate limits e auditar eventos.
- Não expor serviços fiscais internos diretamente à internet.
- Minimizar dados pessoais e aplicar retenção/exclusão conforme LGPD.
- Revisar dependências, scripts de instalação, permissões e avisos de vulnerabilidade antes de adicionar pacote.

## Engenharia
- TypeScript strict e schemas validados entre serviços.
- Preferir tipos explícitos, funções pequenas e módulos coesos; evitar `any` e casts sem justificativa.
- Testes unitários, integração, contrato e ponta a ponta para fluxos relevantes.
- Idempotência em processamento e webhooks.
- Timeouts, retries limitados, circuit breakers e filas para tarefas longas.
- Não afirmar que builds/testes/deploys passaram sem executá-los.
- Não ignorar erros, warnings, testes flaky ou falhas de CI sem registrar causa e decisão.
- Nunca alterar teste apenas para fazê-lo passar sem confirmar o comportamento esperado.
- Cada correção de bug deve incluir teste de regressão.

## Ciclo obrigatório de implementação
1. Ler AGENTS.md, documentação relacionada e código afetado.
2. Esclarecer requisitos, casos-limite e critérios de aceite antes de codificar.
3. Planejar mudanças pequenas e verificáveis.
4. Escrever/ajustar teste que reproduza o comportamento esperado ou a falha.
5. Executar o teste e observar o resultado; implementar a menor correção coerente.
6. Rodar testes focados, suite relacionada, lint, typecheck e build.
7. Fazer revisão do diff: segurança, regressões, isolamento multi-tenant, logs, migrações e contratos.
8. Corrigir achados críticos/importantes e repetir verificações.
9. Registrar comandos executados, resultados, limitações e evidências no PR/commit.
10. Só então considerar a tarefa concluída.

## Quality gates
- Nenhum merge/deploy com testes falhando, typecheck falhando, lint crítico ou build quebrado.
- Alterações de API exigem validação de contrato e compatibilidade.
- Alterações de banco exigem migração reversível/segura e teste de migração.
- Fluxos multi-tenant exigem testes negativos de acesso cruzado.
- Fluxos fiscais exigem fixtures de referência, comparação com motor upstream e registro de versão.
- Alterações de dependência exigem lockfile atualizado e avaliação de vulnerabilidade/licença.
- Revisão humana obrigatória para regras fiscais, segurança, dados pessoais, migrações e deploy de produção.

## Design e motion
- Priorizar clareza e acessibilidade.
- Respeitar prefers-reduced-motion; informação acessível sem animação.
- Não sugerir que um valor tributário mudou quando ocorreu apenas transição visual.
- Não animar cada número em tabelas densas.
- Gráficos com rótulos, unidades, períodos, estados vazios/erro/loading e alternativa tabular.
- Não esconder outliers nem alterar escalas silenciosamente.
- Testar telas menores, teclado e leitor de tela.

## Definition of Done
Fluxo validado com fixtures fictícias; estados loading/vazio/erro/sucesso tratados; testes executados; typecheck/lint/build executados; revisão do diff concluída; acessibilidade verificada; nenhum dado real de contribuinte em fixtures ou logs; documentação atualizada.