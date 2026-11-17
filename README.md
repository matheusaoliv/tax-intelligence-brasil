# TAX INTELLIGENCE BRASIL

Plataforma SaaS independente para cálculo tributário, gestão de documentos fiscais e inteligência assistida por IA.

> Produto independente, sem vínculo, endosso ou certificação da Receita Federal do Brasil. Os projetos upstream serão integrados respeitando licenças, avisos e versões.

## Objetivo
Plataforma multiempresa para empresas e escritórios contábeis, integrando motores de cálculo RTC, geração de DANFSe, gestão documental, API, webhooks, auditoria e IA explicativa.

## Stack de referência
- Web: Next.js, React e TypeScript.
- API: NestJS e TypeScript.
- Dados: PostgreSQL; Redis + BullMQ para filas.
- Arquivos: storage compatível com S3.
- Motores upstream: Java/Spring Boot e Go.
- Observabilidade: OpenTelemetry.
- Visualização: avaliar Apache ECharts.
- Motion UI: Motion para React; GSAP apenas quando necessário.

## Projetos upstream
- https://github.com/ReceitaFederal/calculadora-rtc-regime-regular
- https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional
- https://github.com/ReceitaFederal/calculadora-rtc-gerador-danfse

## Princípios
1. Não alterar nem reimplementar silenciosamente a lógica tributária upstream.
2. Registrar versão do motor/base, parâmetros e resposta original de cada cálculo.
3. IA explica; não substitui o motor determinístico nem inventa regras ou resultados.
4. Gráficos rastreáveis a dados reais, com período, unidade e origem.
5. Isolamento multi-tenant, RBAC, auditoria, LGPD e segurança desde a fundação.
6. Animações não podem mascarar alterações em valores fiscais.

## Estrutura de código
- `apps/web`: aplicação Next.js.
- `apps/api`: API NestJS, autenticação por sessão e rate limiting.
- `packages/contracts`: contratos compartilhados validados com Zod.
- `packages/database`: modelo PostgreSQL/Prisma.

## Executar com Docker Compose
1. Copie `.env.example` para `.env` e gere uma senha forte para `POSTGRES_PASSWORD`.
2. Configure `DATA_ENCRYPTION_KEY` com uma chave aleatória de 32 bytes codificada em Base64 antes de cadastrar dados fiscais.
3. Execute `docker compose up --build`.
4. A API ficará em `http://localhost:3001/api/v1` e a interface em `http://localhost:3000`.

Os motores oficiais ficam em um perfil separado: `docker compose --profile fiscal-engines up --build`. O motor do Simples Nacional exige `SIMPLES_DB_DOWNLOAD_URL`, a URL base autorizada para baixar o banco SQLite oficial. Essa URL não é presumida pelo projeto.

## Documentação
- AGENTS.md: regras para agentes e contribuidores.
- DESIGN.md: direção visual inicial.
- docs/ARCHITECTURE-AND-PHASE-1.md: arquitetura e plano.
- docs/SKILLS.md: skills de UI/UX.
- docs/MOTION-AND-DATA-VIZ-SKILLS.md: motion, animação e visualização de dados.
- docs/ENGINEERING-QUALITY-SKILLS.md: skills de código, testes, segurança e quality gates.
- docs/CODEX-SETUP.md: instalação e configuração do ambiente Codex.
- docs/IMPLEMENTATION-STATUS.md: progresso, validações pendentes e próxima sequência.

## Estrutura de código
- `apps/web`: aplicação Next.js.
- `apps/api`: API NestJS com endpoint de saúde em `/api/v1/health`.
- `packages/contracts`: contratos compartilhados validados com Zod.
- `packages/database`: modelo inicial PostgreSQL/Prisma.

## Status
Fase de fundação. Builds, testes, contratos OpenAPI, licenças e SHAs dos projetos upstream ainda precisam ser validados.