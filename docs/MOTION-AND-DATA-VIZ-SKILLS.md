# Motion design, animação e gráficos animados

Pesquisa em 17/11/2026. Uma skill ensina o agente; a biblioteca/runtime executa a animação. Instalações não foram executadas neste commit.

## Direção para o produto
No dashboard fiscal, motion discreto e orientado a feedback. Exatidão, rastreabilidade e velocidade de leitura prevalecem.

## Skills e ferramentas

### Motion para React
- Projeto: https://github.com/motiondivision/motion
- AI Kit: https://github.com/motiondivision/ai-kit
- Setup para agente: npx motion-ai
- Uso: transições de estado, drawers, modais, tabs, feedback, layout transitions e microinterações.
- Runtime Motion é MIT. Escolha padrão para UI.

### GSAP Skills
- Projeto: https://github.com/greensock/gsap-skills
- Instalação: npx skills add https://github.com/greensock/gsap-skills
- Uso: timelines, sequências coordenadas e animações ligadas ao scroll.
- Opcional; usar quando Motion/CSS não forem suficientes. Conferir termos atuais do runtime.

### LottieFiles Motion Design Skill
- Projeto: https://github.com/LottieFiles/motion-design-skill
- Instalação: npx skills add LottieFiles/motion-design-skill
- Uso: timing, easing, coreografia e princípios clássicos adaptados a interfaces.
- Guia de qualidade, não substitui runtime.

### Data Animation Skills
- Projeto: https://github.com/iart-ai/data-animation-skills
- Instalação: npx skills add iart-ai/data-animation-skills
- Inclui chart-animation, animated-infographic e presentation-video.
- Uso: bar chart race, linhas/áreas, contadores, rankings, infográficos e vídeos de dados.
- Licença declarada: MIT. Melhor para vídeos/infográficos, não runtime de gráficos interativos.
- Em vídeo, valores devem derivar de função determinística do frame.

### Remotion Skills
- Projeto: https://github.com/remotion-dev/remotion/tree/main/packages/skills
- Instalação: npx skills add remotion-dev/skills
- Uso: vídeos explicativos, demonstrações, relatórios narrados e apresentações em React.
- Revisar licença e termos comerciais atuais antes de produção.

### Motion tools and skills
- Coleção: https://github.com/VisualxIntelligence/motion-tools-and-skills
- Referência para Three.js, GSAP, Remotion, Blender, Unreal e ComfyUI.
- Laboratório para experiências especiais, não dependência base. Revisar licença de cada item.

## Gráficos interativos do dashboard
Skill de motion graphics para vídeo não é biblioteca de gráficos em tempo real.
- Avaliar Apache ECharts para dashboards analíticos densos: linhas, barras, área, waterfall, heatmap e interações.
- Avaliar Recharts para integração React simples e gráficos convencionais.
- Manter camada de dados independente da biblioteca visual.
- Respeitar prefers-reduced-motion e oferecer tabela/resumo textual.
- Exibir período, unidade, legenda, origem e estado de atualização.
- Não esconder outliers nem mudar escalas silenciosamente.

## Mapa de uso
| Cenário | Escolha |
|---|---|
| Microinterações do dashboard | Motion |
| Sequências complexas/scroll | GSAP, se necessário |
| Princípios de motion | LottieFiles Motion Design Skill |
| Gráficos interativos em tempo real | ECharts ou Recharts após protótipo |
| Vídeos com dados reais | Remotion + Data Animation Skills |
| Animação vetorial ilustrativa | Lottie/dotLottie ou Rive |
| Experimentos 3D/WebGL | Three.js/R3F isolado do núcleo fiscal |

## Regras fiscais
1. Dados vêm da API ou fixtures marcadas como demonstração.
2. Nunca interpolar valores para criar falsa tendência.
3. Em mudança de filtro, indicar carregamento e período consultado.
4. Tooltip/tabela mostram valor exato; formatação ocorre apenas na apresentação.
5. Não arredondar antes de calcular percentuais ou totais.
6. Identificar estimativa, simulação, apuração e dado efetivo.
7. Movimento reduzido não pode remover informação.
8. Testar em dispositivos modestos e grandes séries.

## Instalação sugerida
Começar com Motion + Motion Design Skill. Adicionar Data Animation Skills quando houver demanda por vídeos/infográficos. GSAP e Remotion são opcionais.
~~~bash
npx motion-ai
npx skills add LottieFiles/motion-design-skill
# Opcionais
npx skills add https://github.com/greensock/gsap-skills
npx skills add iart-ai/data-animation-skills
npx skills add remotion-dev/skills
~~~

## Fontes
- https://github.com/motiondivision/motion
- https://github.com/motiondivision/ai-kit
- https://github.com/greensock/gsap-skills
- https://github.com/LottieFiles/motion-design-skill
- https://github.com/iart-ai/data-animation-skills
- https://github.com/remotion-dev/remotion/tree/main/packages/skills
- https://github.com/VisualxIntelligence/motion-tools-and-skills