# API e fluxos iniciais

Base local: `http://localhost:3001/api/v1`.

Documentação interativa: `/api/v1/docs`.

A autenticação de navegador usa cookie `tib_session` HttpOnly, SameSite=Lax e Secure em produção. Clientes de integração também podem enviar `Authorization: Bearer <token>`. Sessões expiram em oito horas e o servidor armazena apenas o hash SHA-256 do token.

## Autenticação
- `POST /auth/register`: cria usuário, organização inicial e sessão.
- `POST /auth/login`: autentica; se a conta participa de várias organizações, devolve as opções para seleção.
- `GET /auth/me`: consulta o contexto da sessão.
- `POST /auth/logout`: revoga a sessão atual.

A senha deve ter no mínimo 12 caracteres. Login e cadastro têm limite de cinco tentativas por minuto por IP.

## Organizações e permissões
- `GET /organizations/current`: organização ativa e papel atual.
- `GET /organizations/current/members`: lista membros.
- `POST /organizations/current/members`: associa uma conta já cadastrada à organização.
- Papéis: OWNER, ADMIN, ACCOUNTANT, OPERATOR e VIEWER.
- OWNER e ADMIN gerenciam membros; ADMIN não pode conceder papel ADMIN. Somente OWNER concede esse papel.

## Empresas
- `POST /companies`: cadastra razão social e CPF/CNPJ.
- `GET /companies`: lista empresas da organização.
- `GET /companies/:id`: consulta uma empresa da organização.
- CPF e CNPJ são validados por dígitos verificadores, incluindo o novo CNPJ alfanumérico de 12 caracteres alfanuméricos + 2 dígitos. A validação matemática não consulta nem confirma situação cadastral na Receita Federal. CPF/CNPJ é cifrado com AES-256-GCM; a deduplicação usa HMAC-SHA-256 com chave derivada independente. A API retorna apenas os últimos quatro dígitos.

## Cálculos
- `POST /calculations`: executa Regime Regular ou Simples Nacional.
- `GET /calculations`: lista os últimos 50 cálculos da organização.
- `GET /calculations/:id`: consulta um cálculo da organização.
- O corpo recebe `engine`, `companyId` opcional e `inputPayload` JSON. Os contratos completos de entrada e saída devem ser obtidos do Swagger do motor correspondente.
- Cada cálculo guarda o payload original, resposta original, metadados, versão e SHA do motor, estado e correlação. O adaptador não recalcula valores.

## Documentos DANFSe
- `POST /documents/danfse`: recebe XML da NFS-e nacional, `stc` opcional e `canhoto` opcional.
- `GET /documents`: lista os últimos 50 documentos.
- `GET /documents/:id/download`: gera URL assinada com validade de cinco minutos.
- Limite padrão de XML: 5 MiB; máximo configurável: 32 MiB. Se elevar o limite acima do padrão, ajuste também `JSON_BODY_LIMIT` para comportar o XML dentro do envelope JSON. DTD e declarações de entidades são rejeitados.
- XML original e PDF ficam em bucket privado S3 compatível, separados por organização. Configure criptografia em repouso e política de retenção no bucket.

## Dados fiscais de referência
Todas as consultas exigem sessão autenticada e são encaminhadas a endpoints fixos dos motores oficiais:
- `GET /reference-data/regime-regular/classificacoes-tributarias/cbs-ibs/class-trib/:code?data=AAAA-MM-DD`
- `GET /reference-data/regime-regular/fundamentacoes-legais?data=AAAA-MM-DD`
- `GET /reference-data/regime-regular/ncm?ncm=00000000&data=AAAA-MM-DD`
- `GET /reference-data/regime-regular/aliquota-uf?codigoUf=33&data=AAAA-MM-DD`
- `GET /reference-data/simples-nacional/atividades?data=AAAA-MM-DD`

O produto não mantém cópia independente nem altera vigências dos catálogos. Respostas e erros vêm do motor oficial.

## Auditoria
- `GET /audit?limit=50`: histórico da organização; limite entre 1 e 100.
- A leitura é permitida a OWNER, ADMIN e ACCOUNTANT.

## Segurança e implantação
- Todas as rotas de negócio exigem sessão.
- Consultas e gravações são sempre filtradas pelo `organizationId` derivado da sessão, nunca pelo corpo enviado pelo cliente.
- A relação composta de empresa e organização impede associar cálculos/documentos a empresa de outra organização.
- CORS aceita somente origens explicitamente configuradas em `WEB_ORIGIN`.
- Requisições autenticadas por cookie exigem cabeçalho Origin permitido em operações de escrita.
- Antes de produção: habilitar TLS, configurar secrets, bucket privado com criptografia, backups, monitoramento, verificação de e-mail, recuperação de senha, política de retenção e revisão independente de segurança.

## Exemplo de cadastro

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "displayName": "Pessoa Responsável",
  "organizationName": "Empresa Exemplo",
  "email": "admin@example.com",
  "password": "uma-senha-com-mais-de-12-caracteres"
}
```

O navegador recebe o cookie HttpOnly automaticamente. Para frontend e API em sites distintos, configure `SESSION_COOKIE_SAME_SITE=none`, HTTPS e uma lista `WEB_ORIGIN` exata. Não armazene token de sessão em localStorage ou sessionStorage.
