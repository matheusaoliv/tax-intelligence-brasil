# Configuração do Codex para o TAX INTELLIGENCE BRASIL

Este guia configura o Codex e documenta as extensões recomendadas. As skills do repositório são carregadas pelo Codex quando o projeto é aberto localmente; plugins externos precisam ser instalados no ambiente Codex do usuário.

## 1. O que já está versionado neste repositório

- `AGENTS.md`: regras gerais de engenharia, segurança e qualidade.
- `.agents/skills/tax-engine-integrity/SKILL.md`: integridade dos motores fiscais.
- `.agents/skills/multi-tenant-security-review/SKILL.md`: isolamento e segurança multiempresa.
- `.agents/skills/fiscal-adapter-contract/SKILL.md`: contratos dos adapters fiscais.
- `.agents/skills/engineering-tdd/SKILL.md`: TDD, depuração e verificação.

O Codex procura skills de repositório em `.agents/skills/`. Ao abrir a raiz do repositório, confirme a descoberta usando `/skills`. Skills são carregadas sob demanda, portanto a presença no diretório não significa que todas estejam sempre ativas.

## 2. Superpowers

Superpowers reúne fluxos de brainstorming, planejamento, TDD, depuração sistemática e verificação antes de concluir.

1. Abra o Codex Desktop ou Codex CLI.
2. Abra o navegador de plugins com `/plugins`.
3. Procure **Superpowers**, confira o editor e a origem e instale.
4. Inicie uma nova sessão e confira as skills com `/skills`.

Repositório e instruções: https://github.com/obra/superpowers

## 3. Trail of Bits

O marketplace oficial do projeto documenta a compatibilidade com Codex. Adicione a fonte e confira o catálogo antes de instalar:

```bash
codex plugin marketplace add trailofbits/skills
codex plugin marketplace list
codex plugin list --available --json
```

Instale os plugins relevantes, usando os nomes publicados pelo marketplace:

```bash
codex plugin add audit-context-building@trailofbits
codex plugin add differential-review@trailofbits
codex plugin add dimensional-analysis@trailofbits
codex plugin add static-analysis@trailofbits
codex plugin add supply-chain-risk-auditor@trailofbits
codex plugin add post-patch-validation@trailofbits
codex plugin add property-based-testing@trailofbits
codex plugin add spec-to-code-compliance@trailofbits
```

Se algum nome não aparecer na lista `available`, não force a instalação: consulte o catálogo atualizado e instale apenas os itens efetivamente publicados.

Uso no projeto:
- `audit-context-building`: compreender a base antes de procurar defeitos.
- `differential-review`: revisão focada nas mudanças.
- `dimensional-analysis`: detectar inconsistências de unidades e fórmulas.
- `static-analysis`: apoiar análise estática.
- `supply-chain-risk-auditor`: examinar dependências e riscos da cadeia de suprimentos.
- `post-patch-validation`: procurar variantes e regressões após correções.
- `property-based-testing`: criar e revisar testes baseados em propriedades.
- `spec-to-code-compliance`: verificar aderência do código à especificação.

Repositório e catálogo: https://github.com/trailofbits/skills

**Licença:** o repositório Trail of Bits informa licença CC-BY-SA-4.0. Revise os termos antes de copiar, modificar ou redistribuir conteúdos dessas skills. A instalação de um plugin não transfere a licença do código do seu produto.

## 4. Skills do projeto

As skills em `.agents/skills/` são específicas do TAX INTELLIGENCE BRASIL e devem permanecer versionadas no Git. Não as copie para uma pasta pessoal, a menos que queira reutilizá-las em outros projetos.

Para invocar explicitamente:
- `$tax-engine-integrity`
- `$multi-tenant-security-review`
- `$fiscal-adapter-contract`
- `$engineering-tdd`

Para conferir as skills descobertas, use `/skills`. Se uma skill nova não aparecer, reinicie a sessão do Codex e confira se a pasta aberta é a raiz correta do repositório.

Documentação oficial de skills: https://learn.chatgpt.com/docs/build-skills

## 5. Regras obrigatórias para tarefas fiscais

1. Identifique repositório upstream, versão, commit/tag, licença e testes publicados.
2. Preserve o comportamento do motor upstream selecionado. Não altere regras fiscais por inferência.
3. Registre entrada e saída originais, versão do motor, parâmetros, timestamp e correlação, com controles de acesso e retenção.
4. Use fixtures oficiais ou casos de referência rastreáveis e compare resultados com o upstream.
5. Teste limites, arredondamento, precisão decimal, percentuais, datas, códigos e campos opcionais.
6. Diferencie erro de validação, indisponibilidade do motor e resultado fiscal válido.
7. Não use IA generativa para calcular, corrigir ou inventar valores tributários. A IA pode explicar resultados com fontes versionadas e deve se abster quando faltar evidência.
8. Não afirme conformidade, homologação ou equivalência sem evidências reproduzíveis e revisão humana.

## 6. Qualidade antes de concluir

Para cada alteração:
- escreva ou ajuste testes antes da implementação quando aplicável;
- execute testes focados e checks pertinentes de lint, tipos e build;
- revise diff, segurança, isolamento entre tenants, logs, dados pessoais, migrações e contratos;
- registre comandos executados, resultados e limitações;
- nunca declare que testes, builds, auditorias ou deploys passaram se não foram executados.

Mudanças em regras fiscais, segurança, dados pessoais, migrações e produção exigem revisão humana.

## 7. Verificação do ambiente

No terminal:

```bash
codex --version
codex plugin marketplace list
codex plugin list
```

Dentro da sessão Codex:

```text
/skills
/plugins
```

Peça ao Codex para informar quais skills do projeto foram descobertas, quais plugins externos estão instalados e quais não estão disponíveis. Faça primeiro uma alteração pequena e não fiscal para testar o fluxo.

## 8. Limites

Skills e plugins ajudam a padronizar o trabalho, mas não garantem ausência de defeitos, segurança absoluta ou correção tributária. A conclusão depende de testes executados, fontes confiáveis, versões identificadas e revisão técnica e fiscal.
