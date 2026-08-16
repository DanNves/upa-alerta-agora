# 07 — Telas e fluxos

## Telas

| Rota | Tela | Função |
| --- | --- | --- |
| `/` | Mapa | Tela inicial: mapa das unidades, sugestão da opção mais adequada, filtros, modo emergência |
| `/buscar` | Busca | Busca por nome, bairro ou serviço; seleção por necessidade; lista comparativa |
| `/eventos` | Eventos | Campanhas de saúde com datas, status e unidades participantes; acesso à área do gestor |
| `/upa/$id` | Detalhes | Ocupação quantitativa, tempo, distância, serviços, contato, CEP, histórico de 12h, ações |
| `/avaliar` | Avaliação | Nota de 1 a 5, tempo real de espera e comentário |
| `/admin` | Painel do gestor | Login simples, edição de ocupação, criação de campanhas, leitura de feedbacks |

## Navegação

A barra inferior expõe apenas as três abas do cidadão: **Mapa**, **Busca** e
**Eventos**. A avaliação é acessada a partir dos detalhes da unidade, e o painel
do gestor a partir do rodapé da tela de eventos.

## Fluxo principal — escolher uma unidade

```text
Abrir o app
  -> mapa carrega com a posição de referência do usuário
  -> banner apresenta a "opção mais adequada agora"
  -> usuário toca em um pin (mostra atual/capacidade)
  -> bottom sheet exibe resumo: nível, ocupação, tempo, distância, serviços
  -> "Ver detalhes" abre a tela completa
  -> "Ir agora" abre a rota no Google Maps a partir da posição do usuário
```

## Fluxo — busca por necessidade

```text
Aba Busca
  -> digitar nome/bairro/serviço ou selecionar cards de necessidade
  -> lista ordenada pelos critérios disponíveis (ocupação + distância)
  -> cada item mostra atual/capacidade, percentual, nível, bairro e distância
  -> abrir detalhes ou traçar rota
```

## Fluxo — emergência

```text
Mapa -> botão de emergência
  -> ligar para SAMU 192
  -> ligar para Bombeiros 193
  -> abrir rota imediata para a unidade aberta mais próxima
```

## Fluxo — avaliação

```text
Detalhes da unidade -> Avaliar atendimento
  -> escolher nota de 1 a 5
  -> informar tempo real de espera em minutos
  -> comentário opcional
  -> enviar; a avaliação passa a constar na unidade e no painel do gestor
```

## Fluxo — gestor

```text
Eventos -> Área do gestor
  -> login de demonstração
  -> aba UPAs: ajustar ocupação, tempo estimado e abertura (atualiza data/hora)
  -> aba Campanhas: criar/excluir campanha escolhendo unidades por nome e ID
  -> aba Feedbacks: ler avaliações enviadas pelos cidadãos
```
