# 04 — Regras de negócio

Todas as regras abaixo estão centralizadas em `src/data/regras.ts` e são
consumidas pelas telas e componentes. Nenhuma tela recalcula limites por conta própria.

| ID | Regra | Implementação |
| --- | --- | --- |
| RN01 | Percentual de ocupação = arredondamento de (ocupação atual ÷ capacidade máxima) × 100 | `percentualOcupacao()` |
| RN02 | Até 50% → nível **Baixa** (verde) | `LIMITES_OCUPACAO.baixa` |
| RN03 | 51% a 79% → nível **Moderada** (amarelo) | `LIMITES_OCUPACAO.moderada` |
| RN04 | 80% a 100% → nível **Alta** (vermelho) | `LIMITES_OCUPACAO.alta` |
| RN05 | Acima de 100% → nível **Superlotada** (violeta); o percentual real é exibido, sem travar em 100% | `nivelOcupacao()` |
| RN06 | A ocupação é sempre apresentada em formato quantitativo `atual / capacidade pessoas`, acompanhada do percentual | `OcupacaoInfo` |
| RN07 | Unidades fechadas não entram na sugestão automática nem nos resultados de busca | filtro `aberta` |
| RN08 | Score de sugestão = (percentual × peso de ocupação) + (distância em km × 10 × peso de distância); menor score é a melhor opção | `scoreRecomendacao()` |
| RN09 | Pesos padrão: ocupação 0,6 e distância 0,4 | `PESOS_RECOMENDACAO` |
| RN10 | O status de uma campanha é derivado das datas: Programado, Em andamento ou Encerrado | `statusEvento()` |
| RN11 | A distância é calculada pela fórmula de Haversine, em linha reta, a partir da posição do usuário | `distanciaKm()` |
| RN12 | Toda tela que exibe ocupação deve informar que os dados são simulados | `AVISO_DADOS_SIMULADOS` |
| RN13 | A sugestão de unidade não é recomendação médica e deve exibir aviso | `AVISO_RECOMENDACAO` |
| RN14 | A área de gestão só é acessível após login e não aparece na navegação principal | `FEATURE_FLAGS` + gate em `/admin` |
| RN15 | Toda alteração de ocupação pelo gestor atualiza a data/hora da unidade | `updateUpa()` |
| RN16 | A avaliação exige nota de 1 a 5 e tempo real de espera em minutos | tela `/avaliar` |

## Origem do dado

Cada unidade indica a origem da informação de ocupação exibida:

- **Gestor** — informado manualmente pela unidade no painel.
- **Simulado** — gerado pelo protótipo para demonstração.
- **Estimado** — derivado do histórico quando não há atualização recente.
