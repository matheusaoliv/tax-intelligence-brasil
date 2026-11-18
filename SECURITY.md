# Política de segurança

O TAX INTELLIGENCE BRASIL processa informações fiscais e dados pessoais. Trate vulnerabilidades com prioridade.

## Reportar vulnerabilidades
Não publique detalhes de vulnerabilidades exploráveis em issues públicas. Utilize o recurso **Report a vulnerability** na aba Security do GitHub quando disponível, ou contate privadamente os mantenedores do repositório.

Inclua:
- componente e versão afetados;
- passos mínimos para reproduzir;
- impacto observado;
- evidências sem CPF, CNPJ, XML fiscal, tokens ou dados pessoais reais.

## Regras de segurança do projeto
- Nunca envie segredos, chaves ou dados fiscais reais para issues, commits ou logs.
- Não use dados reais em fixtures ou testes.
- Toda consulta de negócio deve derivar o tenant da sessão autenticada.
- Mudanças de cálculo fiscal exigem comparação com o motor oficial fixado e revisão humana.
- Dados fiscais não podem ser enviados a serviços de IA sem finalidade, base legal, transparência e consentimento/controles aplicáveis.
