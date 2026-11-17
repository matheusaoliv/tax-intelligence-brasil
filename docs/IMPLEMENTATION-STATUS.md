# Status de implementação

Atualizado em 17/11/2026. O trabalho está sendo publicado diretamente na branch principal pelo GitHub.

## Implementado no repositório

### Plataforma e interface
- [x] Monorepo pnpm/Turborepo com Next.js e NestJS.
- [x] Interface responsiva em português.
- [x] Cadastro, login e seleção de organização.
- [x] Sessão de navegador em cookie HttpOnly, logout e expiração.
- [x] Dashboard com empresas, cálculos, documentos, membros e auditoria.
- [x] Contratos Zod iniciais para as entradas dos motores fiscais.

### Identidade, organizações e segurança
- [x] Senhas com Argon2id.
- [x] Tokens aleatórios de sessão persistidos apenas em hash.
- [x] Organizações, membros e papéis OWNER, ADMIN, ACCOUNTANT, OPERATOR e VIEWER.
- [x] Guard de sessão, guard RBAC, rate limiting, Helmet e CORS por origem permitida.
- [x] Proteção Origin para mutações autenticadas por cookie.
- [x] CPF e CNPJ com verificação dos dígitos, incluindo CNPJ alfanumérico.
- [x] CPF/CNPJ cifrado com AES-256-GCM e fingerprint HMAC com chave derivada independente.
- [x] Relações compostas no PostgreSQL para impedir associação de empresa de outro tenant a cálculo ou documento.
- [x] Testes unitários iniciais de escopo multi-tenant, RBAC, criptografia, documentos e contratos de motores.

### Operação fiscal
- [x] Histórico de cálculos com payload e resposta originais.
- [x] Adaptador Regime Regular, com versão, commit e endpoint oficial fixados.
- [x] Adaptador Simples Nacional, com versão, commit e endpoint oficial fixados.
- [x] Preservação de metadados do motor, inclusive aviso de dados simulados.
- [x] Geração DANFSe via serviço oficial Go.
- [x] Armazenamento S3 compatível privado para XML e PDF e URLs assinadas de curta duração.
- [x] Histórico e trilha de auditoria por organização.
- [x] Dockerfiles dos três projetos upstream fixados por commit.
- [x] Docker Compose com PostgreSQL, Redis, API, web e perfis separados dos motores.

### Documentação
- [x] Arquitetura, skills de engenharia, setup, API, status e inventário dos motores.
- [x] Contratos HTTP e versões dos três repositórios oficiais documentados.
- [x] Identidade do produto como independente, sem alegar vínculo ou endosso da Receita Federal.

## Ainda não validado

- [ ] Instalação real de dependências e geração/commit do pnpm-lock.yaml.
- [ ] Prisma validate, geração do client, migração SQL e compatibilidade efetiva do schema.
- [ ] Typecheck, build, lint e execução de todos os testes.
- [ ] Build dos três Dockerfiles upstream e verificação de execução dos serviços.
- [ ] Teste de integração ponta a ponta com PostgreSQL e storage.
- [ ] Teste de regressão fiscal com fixtures oficiais em todos os cenários e vigências.
- [ ] Deploy web/API, domínio, banco e storage gerenciados.
- [ ] Revisão externa de segurança, LGPD, retenção, backup, recuperação de senha e verificação de e-mail.

## Situação do GitHub Actions

O workflow foi publicado e disparado por commits na branch principal. As execuções consultadas retornaram falha com `runner_id: 0` e `steps: []`, ou seja, o GitHub não iniciou um runner para executar os comandos. Isso não é evidência de falha de compilação do código nem de sucesso. A validação permanece pendente até que uma execução com runner e logs esteja disponível.

## Bloqueios externos para produção

1. A autorização de acesso ao time Vercel precisa ser aprovada para que seja possível inspecionar e configurar o projeto de hospedagem.
2. São necessárias credenciais de produção para PostgreSQL, bucket S3 compatível, domínio e chaves de criptografia. Nenhuma chave real deve ser gravada neste repositório.
3. O motor do Simples Nacional requer a URL oficial/autorizada de download do banco SQLite; o projeto não inventa esse endereço.
4. A execução fiscal em produção deve passar por homologação e revisão humana antes de ser disponibilizada a clientes.

## Próximas etapas técnicas

1. Obter execução verificável do CI e corrigir cada erro reportado.
2. Gerar e versionar o lockfile.
3. Validar e aplicar migrações em banco de teste.
4. Executar testes de isolamento com duas organizações reais no banco.
5. Construir e homologar os três serviços upstream.
6. Adicionar catálogos de referência, APIs comerciais e integrações externas.
7. Implementar IA explicativa com consentimento, minimização de dados e fontes versionadas. A IA não fará cálculos tributários.
8. Deploy de homologação, testes ponta a ponta e revisão de produção.

**Não considerar o produto pronto para produção até que os itens de validação e homologação estejam concluídos.**
