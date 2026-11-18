# Guia de implantação

Este guia descreve a implantação técnica. Nenhuma credencial de produção é armazenada no Git.

## Variáveis obrigatórias da API
- `DATABASE_URL`: PostgreSQL de produção.
- `DATA_ENCRYPTION_KEY`: 32 bytes aleatórios em Base64, armazenados em secret manager.
- `WEB_ORIGIN`: origem HTTPS exata do frontend; aceita lista separada por vírgula.
- `SESSION_COOKIE_SAME_SITE`: `lax` para mesmo site; `none` quando frontend e API estiverem em sites distintos. `none` exige HTTPS.
- `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`: bucket privado compatível com S3.
- `REGIME_REGULAR_ENGINE_URL`, `SIMPLES_NACIONAL_ENGINE_URL`, `DANFSE_ENGINE_URL`: endereços internos dos motores.

## Chaves
Gere uma chave de criptografia nova para cada ambiente, faça backup seguro e planeje rotação. Não reutilize a chave de desenvolvimento. A perda da chave impede a recuperação dos identificadores fiscais cifrados.

## Banco
1. Provisione PostgreSQL gerenciado com TLS, backups automáticos, PITR e monitoramento.
2. Aplique `pnpm --filter @tax-intelligence/api db:migrate:deploy`.
3. Restrinja o acesso de rede ao banco à API e aos operadores autorizados.
4. Teste restauração antes de armazenar documentos reais.

## Storage
1. Crie bucket privado com criptografia em repouso.
2. Bloqueie acesso público e configure lifecycle/retention conforme política jurídica.
3. Permita à API apenas operações necessárias de leitura e escrita.
4. Use URLs assinadas curtas para download.

## Motores fiscais
- Construa imagens a partir dos Dockerfiles em `deploy/engines`.
- Fixe e registre os commits upstream aprovados.
- Mantenha as portas dos motores somente na rede privada.
- Configure `SIMPLES_DB_DOWNLOAD_URL` com endereço oficial/autorizado do banco SQLite. Não use URL presumida.
- Execute testes de regressão e homologação antes de expor os endpoints.

## Frontend
Configure `NEXT_PUBLIC_API_BASE_URL` como URL pública HTTPS da API, com prefixo `/api/v1`. Configure `WEB_ORIGIN` no backend com a origem exata do frontend.

## Produção
Antes de liberar clientes, conclua revisão de segurança, LGPD, recuperação de senha, verificação de e-mail, observabilidade, alertas, retenção, testes de isolamento, homologação fiscal e plano de resposta a incidentes.
