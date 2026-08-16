# 08 — Algoritmo de sugestão de unidade

## Objetivo

Apontar, entre as unidades abertas, aquela que combina menor lotação com menor
deslocamento. A sugestão é informativa e **não** é recomendação médica.

## Fórmula

```text
percentual = arredondar((ocupacao_atual / capacidade_max) * 100)
distancia  = haversine(posicao_do_usuario, posicao_da_unidade)   // km

score = (percentual * PESO_OCUPACAO) + (distancia * 10 * PESO_DISTANCIA)

PESO_OCUPACAO  = 0,6
PESO_DISTANCIA = 0,4
```

A unidade com **menor score** é apresentada como "opção mais adequada agora".

## Por que multiplicar a distância por 10

O percentual varia de 0 a mais de 100, enquanto a distância urbana em Salvador
fica tipicamente entre 0 e 25 km. O fator 10 aproxima as duas escalas, evitando
que a ocupação domine integralmente o resultado.

## Exemplo

| Unidade | Ocupação | Percentual | Distância | Score |
| --- | --- | --- | --- | --- |
| A | 47/130 | 36% | 8,0 km | 36×0,6 + 80×0,4 = 53,6 |
| B | 121/140 | 86% | 1,5 km | 86×0,6 + 15×0,4 = 57,6 |
| C | 54/180 | 30% | 4,0 km | 30×0,6 + 40×0,4 = **34,0** |

A unidade C é sugerida.

## Pré-condições e filtros

1. Somente unidades com `aberta = verdadeiro` participam.
2. Quando o cidadão seleciona uma necessidade, apenas unidades que oferecem os
   serviços correspondentes entram no cálculo.
3. Empates são resolvidos pela ordem de cadastro (comportamento estável).

## Limitações

- A distância é em linha reta; não considera trânsito, topografia nem sentido de vias.
- O algoritmo não pondera gravidade do caso, especialidade necessária, nem fila por classificação de risco.
- A qualidade da sugestão depende da atualidade do dado de ocupação informado pela unidade.
- No protótipo, a ocupação é simulada, portanto a sugestão serve para demonstrar o mecanismo, não para orientar decisão real.

## Evolução prevista

Incluir tempo de deslocamento real por rota, avaliação média da unidade,
histórico de ocupação por faixa horária e peso configurável pela gestão.
