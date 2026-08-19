# 03 — Requisitos

## Requisitos funcionais

| ID | Requisito | Ator | Status |
| --- | --- | --- | --- |
| RF01 | Exibir mapa com todas as UPAs cadastradas | Cidadão | OK |
| RF02 | Exibir, em cada pin, ocupação atual e capacidade | Cidadão | OK |
| RF03 | Exibir nível de ocupação (Baixa/Moderada/Alta/Superlotada) | Cidadão | OK |
| RF04 | Centralizar o mapa na unidade selecionada com aproximação | Cidadão | OK |
| RF05 | Exibir resumo da unidade em bottom sheet | Cidadão | OK |
| RF06 | Exibir tela de detalhes com serviços, endereço, CEP e telefone | Cidadão | OK |
| RF07 | Exibir histórico de ocupação das últimas 12 horas | Cidadão | OK |
| RF08 | Abrir rota no Google Maps da posição do usuário até a unidade | Cidadão | OK |
| RF09 | Abrir corrida no Uber para a unidade | Cidadão | OK |
| RF10 | Copiar endereço completo e telefone | Cidadão | OK |
| RF11 | Compartilhar a localização da unidade | Cidadão | OK |
| RF12 | Sugerir a unidade mais adequada no momento | Cidadão | OK |
| RF13 | Buscar unidades por nome, bairro ou serviço | Cidadão | OK |
| RF14 | Filtrar por unidades abertas, baixa ocupação e serviços | Cidadão | OK |
| RF15 | Ordenar por proximidade, ocupação, tempo ou avaliação | Cidadão | OK |
| RF16 | Listar campanhas/eventos com datas, status e unidades | Cidadão | OK |
| RF17 | Registrar avaliação com nota, tempo real e comentário | Cidadão | OK |
| RF18 | Acionar modo emergência com SAMU 192 e Bombeiros 193 | Cidadão | OK |
| RF19 | Restringir a área de gestão por login | Gestor | OK |
| RF20 | Atualizar ocupação, tempo estimado e abertura da unidade | Gestor | OK |
| RF21 | Criar e excluir campanhas selecionando unidades por nome e ID | Gestor | OK |
| RF22 | Listar avaliações recebidas | Gestor | OK |
| RF23 | Informar que os dados são simulados | Sistema | OK |

## Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF01 | Interface mobile-first, utilizável em telas a partir de 360 px |
| RNF02 | Toda cor, sombra e raio vem de tokens semânticos definidos em `src/styles.css` |
| RNF03 | Regras de negócio centralizadas em `src/data/regras.ts`, sem duplicação nas telas |
| RNF04 | Textos e rótulos em português do Brasil |
| RNF05 | Contraste e alvos de toque adequados; elementos interativos com rótulo acessível |
| RNF06 | Metadados de título e descrição próprios por rota |
| RNF07 | O mapa é renderizado apenas no cliente, sem quebrar a renderização no servidor |
| RNF08 | Nenhum dado pessoal de paciente é coletado ou armazenado |
| RNF09 | O app deixa claro que não substitui atendimento médico |
| RNF10 | Ação de emergência acessível em, no máximo, um toque a partir do mapa |

## Requisitos incorporados na consolidação do MVP

| ID | Requisito | Ator | Status |
| --- | --- | --- | --- |
| RF24 | Combinar livremente filtros de serviço, abertura, baixa ocupação e texto | Cidadão | OK |
| RF25 | Aplicar os mesmos filtros ao mapa e à busca, a partir de uma camada única | Cidadão | OK |
| RF26 | Exibir o critério de ordenação ativo e permitir limpar todos os filtros | Cidadão | OK |
| RF27 | Exibir a origem do dado de ocupação (Gestor / Simulado) em mapa, busca e detalhes | Cidadão | OK |
| RF28 | Preservar a ocupação informada pelo gestor contra a simulação automática | Gestor | OK |
| RF29 | Devolver a unidade ao modo de simulação automática | Gestor | OK |
| RF30 | Editar capacidade máxima e lista de serviços da unidade | Gestor | OK |
| RF31 | Criar campanha com datas, horário e informações adicionais | Gestor | OK |
| RF32 | Não exibir credenciais de acesso na interface do painel | Sistema | OK |
