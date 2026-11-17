# Arquitetura e plano de execução

## Arquitetura
- Frontend: Next.js + React + TypeScript.
- API SaaS pública: NestJS + TypeScript, único ponto de entrada público.
- Identidade: organizações, usuários, RBAC, sessões, API keys e auditoria.
- Dados: PostgreSQL com isolamento por tenant e migrações versionadas.
- Processamento: Redis + BullMQ.
- Arquivos: storage S3 compatível, URLs assinadas, validação e retenção.
- Motores privados: Java/Spring Boot para Regime Regular e Simples Nacional; Go para DANFSe.
- Observabilidade: OpenTelemetry, logs estruturados, métricas e tracing.
- IA: RAG sobre documentação legal/técnica versionada; não calcula tributos autonomamente.

## Adaptadores fiscais
Criar adaptadores independentes. Cada um valida contrato, chama o serviço privado, preserva requisição/resposta original, registra versões, normaliza apenas metadados necessários e mantém correlação/erros tipados. Testes de contrato usam fixtures não sensíveis. Não modificar upstream como atalho.

## Segurança multi-tenant
Toda consulta valida tenant e permissão no backend. API keys armazenadas como hash, exibidas uma única vez e com escopos/expiração. Webhooks assinados e idempotentes. Aplicar rate limits, quotas, limites de arquivo e proteção contra abuso. Serviços fiscais não são expostos diretamente à internet.

## Domínios iniciais
Organizações e permissões; empresas/clientes; cálculos e simulações; documentos; DANFSe; API keys e webhooks; auditoria; planos e cobrança; assistente explicativo rastreável.

## Fases
0. Auditoria upstream: clonar projetos, registrar SHA/licenças, ler OpenAPI/Dockerfiles/scripts, executar builds/testes isolados, verificar bancos/migrações, documentar portas/health checks/limites.
1. Fundação: monorepo, padrões, lint, testes e CI; API e frontend; PostgreSQL, organizações, RBAC, observabilidade e shell do dashboard.
2. Adaptadores: contratos versionados, testes de contrato/integração, registro de versão/parâmetros/resposta original.
3. Documentos: upload seguro, validação, storage, filas, DANFSe, histórico e webhooks.
4. SaaS comercial: clientes, API keys, quotas, billing, auditoria e suporte.
5. IA explicativa: RAG com fontes versionadas, citações e avaliação; bloquear respostas fiscais sem fonte.
6. Homologação: segurança, LGPD, carga, backup, homologação fiscal, termos, suporte e monitoramento.

## Critérios de aceite
Resultados dos adaptadores conferidos contra motores upstream; versões/parâmetros registrados; isolamento multi-tenant testado; logs sem dados sensíveis desnecessários; builds/testes em CI; falhas tratadas sem perda silenciosa.

## Pendências
Auditoria prévia foi documental. Builds, testes locais, contratos OpenAPI, SHAs e licenças individuais precisam ser verificados antes de homologação.