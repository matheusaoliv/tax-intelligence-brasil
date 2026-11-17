# Regras para agentes e contribuidores

## Integridade fiscal
- Nunca inventar valores, alíquotas, regras ou resultados fiscais.
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

## Engenharia
- TypeScript strict e schemas validados entre serviços.
- Testes unitários, integração e contrato para adaptadores.
- Idempotência em processamento e webhooks.
- Timeouts, retries limitados, circuit breakers e filas para tarefas longas.
- Não afirmar que builds/testes/deploys passaram sem executá-los.

## Design e motion
- Priorizar clareza e acessibilidade.
- Respeitar prefers-reduced-motion; informação acessível sem animação.
- Não sugerir que um valor tributário mudou quando ocorreu apenas transição visual.
- Não animar cada número em tabelas densas.
- Gráficos com rótulos, unidades, períodos, estados vazios/erro/loading e alternativa tabular.
- Não esconder outliers nem alterar escalas silenciosamente.
- Testar telas menores, teclado e leitor de tela.

## Definition of Done
Fluxo validado com fixtures fictícias; estados loading/vazio/erro/sucesso tratados; testes executados; acessibilidade verificada; nenhum dado real de contribuinte em fixtures ou logs; documentação atualizada.