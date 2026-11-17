# Configuração do Codex para o TAX INTELLIGENCE BRASIL

Este guia configura o OpenAI Codex como ambiente de desenvolvimento do projeto. As skills complementam o `AGENTS.md`; não substituem testes, revisão humana, documentação oficial nem validação dos motores fiscais.

## 1. Preparação

1. Instale/atualize o Codex (aplicativo ou CLI) e o Git.
2. Clone o repositório e abra a pasta raiz no Codex:
   `git clone https://github.com/matheusaoliv/tax-intelligence-brasil.git`
3. Confirme que o Codex está na raiz do repositório e que leu `AGENTS.md`, `README.md`, `DESIGN.md` e os documentos em `docs/`.
4. Antes de instalar plugins de terceiros, confira seus repositórios, licenças, permissões e dependências.

## 2. Superpowers: fluxo de engenharia

Superpowers fornece workflows para brainstorming, planejamento, TDD, depuração sistemática e verificação antes de concluir.

**Codex Desktop:** abra Plugins, procure **Superpowers** na seção de ferramentas de programação e instale.

**Codex CLI:** execute `/plugins`, procure **Superpowers** e siga a instalação apresentada pelo Codex.

Após instalar, reinicie/abra uma nova sessão e confirme que as skills aparecem com `/skills`. Use explicitamente os workflows relevantes, por exemplo brainstorming, writing-plans, test-driven-development, systematic-debugging e verification-before-completion.

Fonte: https://github.com/obra/superpowers

## 3. Trail of Bits: segurança e auditoria

Adicione o marketplace:

```bash
codex plugin marketplace add trailofbits/skills
codex plugin list
```

Instale os plugins recomendados individualmente:

```bash
codex plugin add differential-review@trailofbits
codex plugin add supply-chain-risk-auditor@trailofbits
codex plugin add static-analysis@trailofbits
codex plugin add post-patch-validation@trailofbits
codex plugin add dimensional-analysis@trailofbits
```

Uso previsto:
- `differential-review`: revisar alterações e seu impacto.
- `supply-chain-risk-auditor`: examinar dependências e riscos de cadeia de suprimentos.
- `static-analysis`: apoiar análise estática de segurança.
- `post-patch-validation`: validar correções de segurança e regressões.
- `dimensional-analysis`: revisar cálculos com unidades, escalas e conversões, especialmente valores monetários, percentuais e bases decimais.

Se um nome não estiver disponível na versão atual do marketplace, consulte `codex plugin list` e a documentação do marketplace. Não substitua silenciosamente por um plugin de nome parecido.

Fonte: https://github.com/trailofbits/skills

## 4. Skills nativas e skills do repositório

O Codex reconhece skills em `.agents/skills/` no repositório e também skills pessoais em `~/.agents/skills/`. Uma skill contém um `SKILL.md` com frontmatter `name` e `description`. O Codex pode ativá-la por correspondência com a tarefa ou por chamada explícita usando `$nome-da-skill`.

As skills específicas deste projeto ficam versionadas em `.agents/skills/`, para que todos os colaboradores usem as mesmas regras. Skills globais ficam na pasta pessoal e não devem conter regras exclusivas do TAX INTELLIGENCE BRASIL.

Verifique as skills reconhecidas com:

```text
/skills
```

Se alguma skill recém-instalada não aparecer, reinicie o Codex.

Documentação oficial: https://learn.chatgpt.com/docs/build-skills

## 5. Regras obrigatórias para tarefas fiscais

Ao trabalhar em qualquer cálculo, adapter ou integração fiscal:

1. Identifique o repositório upstream, versão, commit/tag e licença aplicável.
2. Preserve o comportamento do motor oficial adotado. Não altere regras fiscais por inferência nem crie uma segunda implementação silenciosa.
3. Registre entrada original, saída original, versão do motor, parâmetros, data/hora e correlação da execução, respeitando minimização e proteção de dados.
4. Use fixtures oficiais ou casos de referência rastreáveis. Compare resultados com o motor upstream.
5. Teste limites, arredondamento, precisão decimal, percentuais, datas, códigos e campos opcionais.
6. Diferencie claramente erro de validação, indisponibilidade do motor e resultado fiscal.
7. Não use IA generativa para calcular, corrigir ou inventar valores tributários. A IA pode explicar resultados com base em fontes versionadas e deve declarar quando não houver evidência suficiente.
8. Nunca afirme conformidade, homologação ou equivalência sem evidências reproduzíveis e revisão humana.

## 6. Qualidade antes de concluir

Para cada alteração, o Codex deve:
- escrever/ajustar testes antes da implementação quando aplicável;
- executar testes focados e os checks pertinentes de lint, tipos e build;
- revisar diff, segurança, isolamento entre tenants, logs, dados pessoais, migrações e contratos;
- registrar comandos executados, resultados e limitações;
- não declarar que testes, builds, auditorias ou deploys passaram se não foram executados.

Mudanças em regras fiscais, segurança, dados pessoais, migrações e produção exigem revisão humana.

## 7. Comandos de verificação

Depois da instalação:

```bash
codex plugin list
```

No Codex:

```text
/skills
```

Peça ao Codex para listar as skills disponíveis, informar quais são globais e quais pertencem ao repositório e resumir quando cada uma deve ser acionada. Em seguida, faça uma tarefa pequena e não fiscal para verificar o fluxo antes de iniciar alterações no motor tributário.

## 8. Limites

Skills reduzem omissões e padronizam processos, mas não garantem código sem defeitos, segurança absoluta ou correção tributária. O resultado depende da qualidade das fontes, dos testes, das versões utilizadas e da revisão técnica e fiscal.
