# 09 — Testes

Os testes do protótipo são manuais, executados sobre a interface, com foco nos
requisitos funcionais e nas regras de negócio.

## Roteiro de testes

| # | Cenário | Passos | Resultado esperado |
| --- | --- | --- | --- |
| T01 | Carga do mapa | Abrir `/` | As 11 unidades aparecem com pin exibindo `atual/capacidade` |
| T02 | Nível Baixa | Unidade com 38/110 (35%) | Selo verde "Baixa" |
| T03 | Nível Moderada | Unidade com 78/120 (65%) | Selo amarelo "Moderada" |
| T04 | Nível Alta | Unidade com 121/140 (86%) | Selo vermelho "Alta" |
| T05 | Superlotação | No painel, definir ocupação acima da capacidade | Selo violeta "Superlotada" e percentual acima de 100% |
| T06 | Aproximação | Tocar em um pin | Mapa aproxima na coordenada exata da unidade |
| T07 | Sugestão | Observar o banner do mapa | Unidade com menor score, com aviso de não-recomendação médica |
| T08 | Unidade fechada | Marcar unidade como fechada no painel | Deixa de aparecer na sugestão e na busca |
| T09 | Busca textual | Buscar "Itapuã", "Pediatria", "Brotas" | Resultados coerentes com nome, serviço e bairro |
| T10 | Filtro por necessidade | Selecionar "Criança doente" | Apenas unidades com Pediatria |
| T11 | Detalhes | Abrir `/upa/upa-cabula` | Ocupação quantitativa, percentual, data/hora da atualização e origem do dado |
| T12 | Histórico | Rolar até o gráfico | 12 barras correspondentes às últimas 12 horas |
| T13 | Rota | Tocar em "Abrir no Google Maps" | Rota com origem na posição do usuário e destino nas coordenadas da unidade |
| T14 | Compartilhar | Tocar em "Compartilhar localização" | Compartilhamento nativo ou cópia com nome, endereço e link |
| T15 | Copiar | Tocar em copiar endereço e telefone | Conteúdo na área de transferência e confirmação visível |
| T16 | Avaliação | Enviar nota 4 e 30 min | Avaliação aparece na unidade e no painel do gestor |
| T17 | Emergência | Acionar modo emergência | Opções SAMU 192, Bombeiros 193 e rota para a unidade aberta mais próxima |
| T18 | Login do gestor | Acessar `/admin` sem sessão | Formulário de login dentro do layout do painel |
| T19 | Atualizar ocupação | Salvar nova ocupação | Mapa, busca e detalhes refletem o valor; data/hora é atualizada |
| T20 | Criar campanha | Criar evento com 3 unidades | Campanha listada em `/eventos` com status coerente às datas |
| T21 | Excluir campanha | Remover campanha | Deixa de aparecer na listagem |
| T22 | Avisos | Percorrer mapa, busca e detalhes | Aviso de dados simulados presente |
| T23 | Responsividade | Testar em 360 px e 768 px | Sem rolagem horizontal nem sobreposição da barra inferior |
| T24 | Metadados | Verificar cada rota | Título e descrição próprios da tela |

## Critérios de aceite

- Todos os cenários de T01 a T24 concluídos sem erro de console.
- Nenhum valor de ocupação exibido apenas em percentual, sem o par `atual/capacidade`.
- Nenhum limite de ocupação calculado fora de `src/data/regras.ts`.

## Cenários adicionais — filtros combinados e origem do dado

| ID | Cenário | Passos | Resultado esperado |
| --- | --- | --- | --- |
| T25 | Filtros combinados | Em `/buscar`, marcar "Abertas agora" + "Só baixa ocupação" + serviço "Pediatria" | Restam apenas unidades que satisfazem os três critérios ao mesmo tempo |
| T26 | Ordenação ativa | Alternar entre "Mais próxima de mim", "Menor ocupação", "Menor tempo" e "Melhor avaliação" | A ordem da lista muda e o critério ativo é exibido na tela |
| T27 | Limpar filtros | Tocar em "Limpar filtros" | Volta à ordenação "Sugestão" e às 11 unidades |
| T28 | Filtro no mapa | Aplicar filtro de serviço em `/` | Pins que não atendem ao filtro desaparecem do mapa |
| T29 | Prioridade do gestor | Alterar ocupação no painel e aguardar 1 min | O valor informado permanece; a origem passa a "Gestor" e a simulação não sobrescreve |
| T30 | Voltar à simulação | Tocar em "Voltar para simulação" | A origem volta a "Simulado" e a variação automática recomeça |
