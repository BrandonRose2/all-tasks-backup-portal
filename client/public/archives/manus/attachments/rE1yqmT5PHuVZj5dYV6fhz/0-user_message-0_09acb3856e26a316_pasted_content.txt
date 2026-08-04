---
name: credit-optimizer
description: >-
  Otimizador automático de créditos do Manus v5 - ZERO perda de qualidade
  (auditado em 22 cenários, 12 vulnerabilidades corrigidas). Usar SEMPRE antes
  de executar qualquer tarefa para analisar o prompt e decidir a melhor
  estratégia. Economia típica de 30-75% sem NENHUMA perda de qualidade. Aplica
  roteamento inteligente de modelo (Standard/Max), Smart Testing, seção por
  seção para conteúdo longo, detecção de tarefas mistas, detecção de output
  de arquivo, detecção de dados factuais, e context hygiene.
---

# Credit Optimizer v5 - ZERO Quality Loss (Audited)

Economia típica: 30-75% dos créditos, com ZERO perda de qualidade.
Auditado em 53 cenários (22 funcionais + 31 adversariais), 12 vulnerabilidades corrigidas.

## Princípio Fundamental

> Otimize o PROCESSO INTERNO (raciocínio, iterações, tokens de pensamento). O OUTPUT FINAL deve ter a qualidade e profundidade que a tarefa exige. Na dúvida, SEMPRE priorize qualidade.

## Workflow Principal

### Passo 1: Analisar o Prompt

Executar o script de análise:

```bash
python3 /home/ubuntu/skills/credit-optimizer/scripts/analyze_prompt.py "<prompt_do_usuario>"
```

O script retorna JSON com: intenção, complexidade, clareza, completude, tamanho do conteúdo, profundidade de raciocínio, detecção de tarefa mista, detecção de output de arquivo, detecção de dados factuais, detecção de ações que exigem Agent Mode, detecção de complexidade inerente, estratégia recomendada, modelo recomendado, e diretivas de eficiência.

### Passo 2: Aplicar a Estratégia

Seguir a estratégia retornada:

**CHAT_MODE** (0 créditos): APENAS para Q&A conceitual, brainstorming, traduções simples, comparações conceituais. NUNCA para: código, tarefas que precisam de arquivo, dados factuais/temporais, tarefas que precisam de SSH/execução/instalação.

**DIRECT_STANDARD**: Tarefa simples a média bem definida. Execução direta com Manus 1.6.

**BATCH_RESEARCH**: Pesquisa e perguntas factuais. Buscas inteligentes com 3 query variants. SEMPRE buscar online para dados factuais. Pesquisa complexa usa Max automaticamente.

**DECOMPOSE_CASCADE**: Tarefa complexa ou mista. Decompor em fases. Planejar no Chat Mode (gratuito). Executar com modelo adequado.

**REFINE_FIRST**: Prompt vago ou mídia sem detalhes. Coletar informações no Chat Mode (gratuito) antes de gastar créditos.

### Passo 3: Seguir o Modelo Recomendado

| Complexidade | Modelo | Quando |
|---|---|---|
| Baixa | Manus 1.6 Standard | Tarefas simples, scripts básicos |
| Média | Manus 1.6 Standard | Maioria das tarefas |
| Alta | Manus 1.6 Max | Sistemas complexos, pesquisa profunda, análise financeira, projetos inerentemente complexos (tipo Airbnb, Twitter, etc.) |

**IMPORTANTE**: Max é auto-selecionado para tarefas complexas (19.2% mais qualidade). NUNCA bloquear Max quando recomendado.

### Passo 4: Injetar Diretivas de Eficiência

Aplicar as diretivas retornadas pelo script. Ver catálogo completo em `references/efficiency_directives.md`.

## 10 Regras de Ouro v5 (Auditadas em 53 cenários)

1. **Output com profundidade adequada**: Concisão aplica-se APENAS ao raciocínio interno. O resultado entregue ao usuário deve ter a qualidade e extensão que a tarefa exige. NUNCA encurtar output para economizar.

2. **Código robusto desde o início**: Escreva código robusto, limpo e elegante. Evite over-engineering, mas NUNCA sacrifique robustez (validação, error handling). NÃO use "solução mais simples possível".

3. **Até 3 tentativas para código**: Se um teste falhar, corrija e re-teste. Máximo de 3 tentativas. Se persistir, informe o usuário sobre o problema específico. NUNCA entregue código quebrado.

4. **SEMPRE buscar online para dados factuais**: Para dados que mudam (preços, estatísticas, eventos, comparações atuais), SEMPRE busque online. Conhecimento interno serve apenas para conceitos estáveis e formulação de queries. Perguntas factuais simples (ex: "Qual a população do Brasil?") vão direto para busca, sem exigir completeness alta.

5. **Conteúdo longo = seção por seção**: Artigos, relatórios e apresentações com mais de 2000 palavras ou 10 slides devem ser gerados seção por seção para manter coerência e profundidade.

6. **Max auto-selecionado para complexidade alta**: Tarefas complexas usam Manus 1.6 Max automaticamente. NUNCA bloquear Max quando recomendado pelo script. Projetos inerentemente complexos (clones de plataformas, compiladores, jogos com IA) SEMPRE usam Max.

7. **Detecção de ação = Agent Mode obrigatório**: Se a tarefa precisa executar algo (SSH, instalar, configurar, gerar arquivo), SEMPRE usar Agent Mode. Chat Mode é APENAS para respostas textuais sem execução.

8. **Tarefas mistas = decomposição**: Se a tarefa tem múltiplos componentes (pesquisa + slides + gráficos), decompor em fases e aplicar melhores práticas de cada tipo.

9. **Context Hygiene para tarefas longas**: A cada módulo/fase concluída, salvar estado em arquivo e referenciar ao invés de manter no contexto. Isso MELHORA a qualidade.

10. **Mídia: coletar detalhes ANTES de gerar**: Para geração de imagem/vídeo, coletar estilo, dimensões, cores e referências ANTES de gerar. Uma tentativa precisa é melhor que várias vagas.

## Fontes de Economia SEGURAS (0% impacto na qualidade)

1. Chat Mode para Q&A/brainstorm/tradução (100% economia)
2. One-shot prompt completo para conteúdo curto (elimina follow-ups)
3. Batch queries (3 variants por busca, mesma cobertura)
4. Context compression (salvar em arquivos)
5. Markdown extraction (ao invés de scroll)
6. Planejamento no Chat Mode antes de executar (gratuito)
7. Raciocínio interno eficiente (menos tokens de pensamento)

## Regra de Veto

> Se qualquer diretiva de eficiência conflitar com a qualidade do resultado final, a qualidade SEMPRE vence. Economia de créditos é secundária à entrega de um resultado excelente.

## Referências

- Script de análise: `scripts/analyze_prompt.py`
- Diretivas de eficiência: `references/efficiency_directives.md`
- Matriz de estratégia: `references/strategy_matrix.md`
- Checklist de especificidade: `references/prompt_checklist.md`
- Template de one-shot prompt: `templates/one_shot_template.md`
