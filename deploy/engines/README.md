# Contêineres dos motores fiscais

Os Dockerfiles fazem checkout dos commits oficiais fixados em `docs/UPSTREAM-ENGINES.md`. Eles não copiam nem modificam a lógica fiscal dos projetos upstream.

## Regime Regular
A imagem gera a base SQLite a partir dos scripts Flyway versionados no repositório oficial e executa o perfil offline na porta 8080.

## Simples Nacional
A imagem compila a aplicação oficial. O perfil offline baixa o banco SQLite quando ele não existe localmente. Antes de executar, configure `DB_DOWNLOAD_URL` com a URL base autorizada do arquivo `calculadora-pro.db`. O repositório upstream documenta essa variável, mas não publica no README um endereço de download universal. Não inventar nem presumir essa URL.

## DANFSe
A imagem compila o serviço Go oficial e expõe a API HTTP na porta 8080. O endpoint de geração recebe XML e devolve PDF.

## Segurança
- Não publicar as portas dos motores diretamente na internet.
- Permitir acesso somente pela rede privada da API.
- Não registrar XML, dados fiscais, PDFs ou tokens nos logs.
- Atualizações de SHA exigem revisão de licença, changelog, contratos, fixtures e testes de regressão.
