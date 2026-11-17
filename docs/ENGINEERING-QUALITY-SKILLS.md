# Engenharia de qualidade: skills e barreiras contra defeitos

Este documento define as skills e os controles que serão usados no TAX INTELLIGENCE BRASIL. Pesquisa consultada em 17/11/2026. Skills são instruções para agentes, não garantias formais de correção. Ferramentas, testes e revisão humana continuam obrigatórios.

## Estratégia recomendada

Adotar poucas skills centrais, ativadas conforme o tipo de tarefa. Evitar instalar dezenas de instruções redundantes que disputem prioridade ou consumam contexto.

### 1. Superpowers: processo de desenvolvimento, TDD e depuração
- Repositório: https://github.com/obra/superpowers
- Abrange brainstorming, planejamento, TDD RED-GREEN-REFACTOR, systematic-debugging, verification-before-completion, code review e execução por etapas.
- Instalação no Codex: procurar e instalar Superpowers pelo marketplace de plugins do Codex. Alternativa manual oficial documentada em https://github.com/obra/superpowers/blob/main/docs/README.codex.md
- Usar como processo principal de execução e correção de tarefas.
- Filosofia central: evidência antes de declarar conclusão; testar antes de implementar; investigar causa raiz em vez de mascarar sintomas.

### 2. GitHub Spec Kit: especificação antes do código
- Repositório: https://github.com/github/spec-kit
- Ajuda a criar constituição do projeto, requisitos, esclarecimentos, plano técnico, tarefas, análise de consistência e convergência.
- Instalação documentada: https://github.com/github/spec-kit/blob/main/docs/installation.md
~~~bash
uv tool install specify-cli
specify version
specify init tax-intelligence-brasil
~~~
- A sequência completa de SDD está documentada em https://github.com/github/spec-kit/blob/main/docs/reference/agentic-sdd.md
- Usar para funcionalidades grandes, integrações e mudanças de arquitetura. Para correções pequenas, não criar burocracia desnecessária.

### 3. Vercel Agent Skills: React e Next.js
- Repositório oficial: https://github.com/vercel-labs/agent-skills
- Instalação seletiva:
~~~bash
npx skills add vercel-labs/agent-skills --skill react-best-practices
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
npx skills add vercel-labs/agent-skills --skill composition-patterns
~~~
- react-best-practices: mais de 40 regras para waterfalls, bundle, renderização, fetching e performance.
- web-design-guidelines: revisão de acessibilidade, formulários, foco, animação, navegação, responsividade e UX.
- composition-patterns: arquitetura de componentes React reutilizáveis.
- Para Next.js, verificar no catálogo oficial a skill next-best-practices e instalar se disponível na versão do repositório.

### 4. Trail of Bits: segurança e revisão de alterações
- Repositório: https://github.com/trailofbits/skills
- Instalar apenas skills específicas necessárias:
~~~bash
npx skills add trailofbits/skills --skill differential-review
npx skills add trailofbits/skills --skill supply-chain-risk-auditor
npx skills add trailofbits/skills --skill static-analysis
npx skills add trailofbits/skills --skill post-patch-validation
~~~
- differential-review: revisão de segurança focada no diff e impacto das mudanças.
- supply-chain-risk-auditor: examina advisories, dependências, procedência e riscos de supply chain. A documentação informa limitações para alguns lockfiles; verificar cobertura do relatório.
- static-analysis: apoio a análise estática, CodeQL/Semgrep e SARIF.
- post-patch-validation: procura variantes não corrigidas e regressões.
- A licença do conjunto é CC-BY-SA-4.0; conferir termos e escopo antes de incorporar conteúdo ou redistribuir.

### 5. Regras específicas NestJS
- A API será NestJS. Usar documentação oficial como fonte normativa: https://docs.nestjs.com/
- Skills comunitárias de NestJS podem ser avaliadas depois que a versão e os módulos forem definidos. Não instalar instruções de terceiros sem revisar conteúdo, atualização, licença e compatibilidade com a versão do NestJS escolhida.
- Regras mínimas: DTO + ValidationPipe, guards e autorização no servidor, tratamento centralizado de erros, configuração validada, logs estruturados, testes de módulos e queries parametrizadas.

## Ferramentas de verificação que não são skills

- TypeScript: `strict: true`, typecheck no CI.
- ESLint: lint e regras de segurança/qualidade compatíveis com stack.
- Prettier: formatação consistente.
- Vitest ou Jest: testes unitários e integração, escolhendo uma stack coerente.
- Playwright: testes ponta a ponta de fluxos críticos e navegadores.
- Semgrep/CodeQL: análise estática e segurança, conforme viabilidade do repositório.
- Dependabot ou Renovate: atualizações controladas de dependências.
- GitHub Actions: pipeline obrigatório de lint, typecheck, testes, build e verificações de segurança.

Não adicionar todas as ferramentas de uma vez. Escolher versões compatíveis, fixar lockfile e validar o pipeline em um ambiente limpo.

## Pipeline mínimo para cada pull request

1. Instalação reproduzível a partir do lockfile.
2. Lint.
3. Typecheck.
4. Testes unitários.
5. Testes de integração relevantes.
6. Testes de contrato para APIs/adaptadores.
7. Testes Playwright dos fluxos críticos.
8. Build de produção.
9. Auditoria de dependências e análise estática configurada.
10. Revisão humana do diff e aprovação dos quality gates.

Nenhum job pode ser ignorado silenciosamente. Falhas intermitentes devem ser investigadas, não apenas repetidas até passar.

## Matriz de testes do domínio fiscal

- Valores e totais: casos de referência aprovados e testes de limites.
- Precisão decimal: evitar ponto flutuante binário para cálculos monetários; definir escala e arredondamento conforme contrato fiscal.
- Datas: fuso, vigência, início/fim de período e mudanças de regra.
- Motores upstream: comparar resultado e registrar SHA/versão do motor e base.
- Multi-tenancy: provar que usuário de uma organização não lê nem altera dados de outra.
- Documentos: arquivos inválidos, tamanho máximo, MIME real, XML malformado e conteúdo malicioso.
- Filas/webhooks: repetição, idempotência, timeout, retry e entrega duplicada.
- IA: respostas com fonte, abstenção sem evidência e testes contra instruções maliciosas em documentos.

## Regra de conclusão

Nunca dizer "sem erros" apenas porque o código foi gerado ou porque um teste isolado passou. Informar exatamente quais comandos foram executados, quais suites passaram, quais áreas não foram testadas e quais riscos permanecem.