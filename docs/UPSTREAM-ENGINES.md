# Inventário dos motores fiscais upstream

Este documento registra os projetos oficiais consultados em 17/11/2026. Os SHAs abaixo foram lidos diretamente da referência `main` de cada repositório e coincidem com os SHAs iniciais indicados na Portaria COTEC nº 342/2026.

| Motor | Repositório | Versão identificada | Commit de referência |
|---|---|---:|---|
| Regime Regular | https://github.com/ReceitaFederal/calculadora-rtc-regime-regular | 1.6.1 | `150cccbe414d4a5edea703e4f7a424af5aa222c7` |
| Simples Nacional | https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional | 0.0.6 | `c5b0f01c8351c3f0d0795cc617b29d233e9f98df` |
| Gerador DANFSe | https://github.com/ReceitaFederal/calculadora-rtc-gerador-danfse | 1.0.0 | `8d79e6b2f7fad6375340afcb51c85ed370c64a14` |

## Contratos HTTP observados

### Regime Regular
- Runtime: Java 21+, Spring Boot 3.5.16.
- Endpoint de cálculo observável: `POST /api/calculadora/observabilidade/regime-geral`.
- Catálogo de erros: `GET /api/calculadora/observabilidade/erros?codigo=...`.
- A API informa o cabeçalho `x-warning-dados-simulados` quando aplicável.
- O README upstream documenta também o Swagger em `/api/swagger-ui.html`.

### Simples Nacional
- Runtime: Java 21+, Spring Boot 3.5.16.
- Endpoint de cálculo observável: `POST /api/calculadora/observabilidade/simples-nacional`.
- Catálogo de erros: `GET /api/calculadora/observabilidade/simples-nacional/erros?codigo=...`.
- Consulta de atividades exige data de referência: `GET /api/calculadora/simples-nacional/atividades?data=AAAA-MM-DD`.

### DANFSe
- Runtime: Go 1.27+.
- Geração: `POST /api/danfse`, corpo XML e resposta PDF.
- Parâmetros opcionais: `stc` e `canhoto`.
- Limite padrão de XML documentado: 5 MiB; teto configurável documentado: 32 MiB.
- Health checks: `GET /health/live` e `GET /health/ready`.

## Regras de integração

1. Os motores são executados como serviços privados dentro da infraestrutura do produto; não presumir endpoints públicos hospedados pela Receita.
2. Preservar os payloads originais, os metadados de resposta e a identificação do commit executado.
3. Não recalcular, corrigir ou normalizar valores tributários no adaptador.
4. Não tratar respostas de dados simulados como valores definitivos. Expor o cabeçalho de aviso ao consumidor.
5. DANFSe produz PDF binário e deve usar fluxo documental/storage, não ser forçado para o modelo JSON de cálculos.
6. Antes de liberar produção, validar contratos completos, fixtures e resultados com os binários/serviços upstream fixados nesses commits.

## Licença e independência

Os três repositórios indicam licença MIT. A utilização deve preservar os avisos de copyright e licença de cada projeto e de suas dependências. TAX INTELLIGENCE BRASIL é produto independente, sem vínculo, endosso ou certificação da Receita Federal.

A publicação dos projetos upstream não representa garantia de suporte, manutenção ou validação de usos externos. A responsabilidade pela operação e homologação da integração é do mantenedor do TAX INTELLIGENCE BRASIL.
