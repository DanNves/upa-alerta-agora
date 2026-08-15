# 01 — Visão geral

## Problema

Em Salvador/BA, o cidadão que precisa de atendimento de urgência escolhe a UPA
por proximidade ou por indicação informal. Não há informação pública, unificada e
em tempo próximo ao real sobre lotação das unidades. O resultado é desequilíbrio
de demanda: unidades superlotadas ao lado de unidades com folga, deslocamentos
desnecessários e espera prolongada.

## Justificativa

Informação de ocupação, capacidade, serviços disponíveis e distância, reunida em
uma única interface móvel, permite ao cidadão decidir melhor e ajuda a distribuir
a demanda entre unidades. Do ponto de vista da gestão, o mesmo canal serve para
divulgar campanhas de saúde e coletar percepção de atendimento.

## Objetivo geral

Desenvolver um protótipo funcional de aplicação móvel (web responsiva) que
apresente, de forma clara e acessível, a situação das UPAs 24h de Salvador e
apoie o cidadão na escolha da unidade mais adequada.

## Objetivos específicos

1. Mapear as UPAs 24h de Salvador com endereço, bairro, CEP, telefone e coordenadas.
2. Exibir ocupação de forma quantitativa (pessoas atuais / capacidade) e qualitativa (nível).
3. Calcular e apresentar uma sugestão de unidade a partir de ocupação e distância.
4. Permitir busca por nome, bairro e serviço.
5. Divulgar campanhas e eventos de saúde por unidade.
6. Coletar avaliações do cidadão (nota, tempo real de espera, comentário).
7. Oferecer área de gestor para atualizar ocupação e publicar campanhas.
8. Deixar explícito, na interface, que os dados são simulados.

## Público-alvo

- **Cidadão** de Salvador que busca atendimento de urgência ou informação sobre serviços.
- **Gestor / operador de unidade**, responsável por atualizar ocupação e campanhas.

## Delimitação

O protótipo não se integra a sistemas oficiais de saúde, não realiza triagem
clínica, não agenda atendimento e não armazena dados pessoais de pacientes.
