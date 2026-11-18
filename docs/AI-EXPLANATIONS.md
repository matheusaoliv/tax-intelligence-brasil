# Explicações assistidas por IA

## Limite funcional
O motor fiscal oficial continua sendo a única fonte de cálculo. A IA não pode calcular, corrigir, arredondar, completar ou reinterpretar tributos.

## Fluxo planejado
1. Buscar o cálculo e a resposta original no tenant autenticado.
2. Extrair estados, códigos de erro, mensagens oficiais, versão e SHA do motor.
3. Remover CPF, CNPJ, nomes, endereços, XML, identificadores e outros dados pessoais antes de qualquer envio externo.
4. Usar apenas fontes oficiais versionadas e respostas do motor.
5. Pedir ao modelo uma explicação em linguagem simples, com referências aos códigos e campos de origem.
6. Validar a saída contra schema; rejeitar números, alíquotas ou fundamentos que não estejam no conjunto de evidências.
7. Se faltarem dados ou fontes, responder que não há evidência suficiente.
8. Mostrar versão do motor, fontes, limitações e aviso de revisão humana.

## Regras obrigatórias
- Explicações não são parecer jurídico, contábil ou fiscal.
- Não enviar payloads fiscais completos para modelos externos por padrão.
- A integração com provedor de IA exige configuração, consentimento e política de retenção.
- Cada resposta deve ser rastreável ao cálculo, commit do motor e fontes.
- Qualquer alteração de regra tributária permanece fora do escopo da IA.
- A IA deve se abster quando a fonte oficial não cobrir a situação.

## Estado
A camada de cálculo, persistência e rastreabilidade já foi iniciada. A integração de modelo de linguagem permanece pendente de seleção de provedor, avaliação de privacidade, testes de alucinação e aprovação humana.
