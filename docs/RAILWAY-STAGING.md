# Railway staging

## Projeto provisionado

- Projeto: `tax-intelligence-brasil`
- Ambiente: `staging`
- Projeto Railway: `7c9d3209-69a6-4a24-bd3e-0024db080726`
- Ambiente Railway: `a64477e0-c0f0-4926-9fd2-d1f16e08cd10`
- Workspace: `MTS Cria's Projects`

## Recursos criados

| Recurso | Serviço / ID | Região | Estado observado |
|---|---|---|---|
| PostgreSQL | `Postgres` / `d0f3e2e9-1a48-42ad-bde8-96aebf726d67` | sfo | SUCCESS / Online |
| Redis | `Redis` / `dc87e155-246d-4b71-a878-f7e110e48ce7` | sfo | SUCCESS / Online |
| Object Storage | `tax-intelligence-documents` / `7433ccb5-bc24-477e-8561-e4ac8103ff8d` | iad | Provisionado |
| API | `tax-intelligence-api` / `91c30ed8-5e84-48b5-a311-85ad660aa2e9` | sfo | Criado, fonte ainda não conectada |
| Web | `tax-intelligence-web` / `db132e28-a915-46e4-b6ed-32ae134b3513` | sfo | Criado, fonte ainda não conectada |

## Domínios reservados

- API: https://tax-intelligence-api-staging.up.railway.app
- Web: https://tax-intelligence-web-staging.up.railway.app

Os domínios foram criados, mas não servem a aplicação enquanto os serviços API e Web não tiverem um deploy concluído.

## Configuração aplicada

- API configurada para Node 22 e porta 3001.
- Dockerfile da API: `apps/api/Dockerfile`.
- Health check da API: `/api/v1/health/ready`.
- Migrações Prisma configuradas como pre-deploy command.
- Frontend configurado para a URL pública da API e porta 3000.
- Dockerfile do frontend: `apps/web/Dockerfile`.
- Health check do frontend: `/`.
- PostgreSQL e Redis usam referências privadas Railway.
- Bucket usa referências de variáveis Railway, sem copiar credenciais para o repositório.
- Chave de criptografia de 32 bytes foi gerada e armazenada como variável secreta no serviço API.
- O SDK S3 foi ajustado para suportar virtual-host addressing, necessário para o endpoint do bucket Railway. MinIO local continua usando path-style por configuração.

## Bloqueio de conexão do código-fonte

Ao conectar `matheusaoliv/tax-intelligence-brasil` aos serviços API e Web, a Railway respondeu: `User does not have access to the repo`.

É necessário autorizar a integração GitHub da Railway para acessar este repositório. No GitHub, abra Settings → Applications → Installed GitHub Apps, localize Railway e conceda acesso ao repositório `matheusaoliv/tax-intelligence-brasil`. Se Railway ainda não estiver instalada, instale a aplicação GitHub Railway e selecione este repositório. Depois disso, reconectar a fonte dos serviços API e Web à branch `main`.

## Pendências antes da homologação

1. Autorizar Railway no repositório GitHub.
2. Conectar a fonte GitHub aos serviços API e Web.
3. Concluir builds e corrigir eventuais erros de compilação.
4. Criar e conectar os três serviços de motores fiscais oficiais.
5. Confirmar as variáveis de ambiente e conectividade interna.
6. Executar migrações e validar health checks.
7. Testar cadastro, login, isolamento multiempresa, cálculos e DANFSe com dados de homologação.
8. Não habilitar produção antes de revisão de segurança, fiscal e LGPD.

## Segurança e custos

Este ambiente é de homologação, não produção. PostgreSQL e Redis foram provisionados com volumes persistentes. Não foi criado proxy TCP público para o banco. Não armazenar dados reais de contribuintes nesta fase. A região do bucket está em iad e os serviços de aplicação/banco estão em sfo; avaliar latência e custo de transferência antes de produção.

Nenhum segredo é armazenado neste documento ou no repositório.
