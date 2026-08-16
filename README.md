# UPA Radar

Está é minha ideia de APP, construa e crie ele completamente seguindo fielmente todos os dados, instruções detalhados e descritos no anexo. Lembre-se também de todos os aspectos de construção de um app, exemplo: usabilidade, escalabilidade responsividade, segurança, banco de dados e design moderno conforme o briefing enviado... entre muito mais. e garanta que toda a arquitetura siga as melhores práticas de mercado.

imagem anexada é so um esboço o mapa pode ser algo bom para o usuario usar e ao clicar abri o maps e levar ate o lugar.

Prompt de Desenvolvimento — App de UPAs em Tempo Real

CONTEXTO GERAL

Você vai desenvolver um aplicativo mobile completo chamado UPA Fácil (ou nome similar a definir). O objetivo do app é mostrar todas as Unidades de Pronto Atendimento (UPAs) de uma cidade brasileira em tempo real, permitindo que o cidadão tome a melhor decisão de atendimento com o mínimo de esforço possível.

O app deve ser desenvolvido em React Native com Expo, utilizando Supabase como backend (banco de dados + API + painel admin). O mapa deve usar o Google Maps SDK. O design deve ser limpo, moderno, com foco total em velocidade de leitura e decisão rápida.

STACK TÉCNICA

Frontend: React Native + Expo (funciona em iOS e Android)

Banco de dados e backend: Supabase (PostgreSQL + API REST automática)

Mapas: Google Maps SDK (react-native-maps)

Navegação GPS/Rota: Google Maps deeplink (maps.google.com/maps?daddr=...)

Uber: Deeplink nativo (uber://)

Notificações: Expo Notifications

Estado global: Zustand ou Context API

Ícones: React Native Vector Icons (MaterialCommunityIcons ou Ionicons)

BANCO DE DADOS (SUPABASE)

Crie as seguintes tabelas com os campos exatos abaixo:

Tabela: upas

codeCode

id              UUID PRIMARY KEY DEFAULT uuid_generate_v4()
nome            TEXT NOT NULL
endereco        TEXT NOT NULL
cep             TEXT NOT NULL
bairro          TEXT NOT NULL
cidade          TEXT NOT NULL
estado          TEXT NOT NULL
latitude        FLOAT NOT NULL
longitude       FLOAT NOT NULL
telefone        TEXT
capacidade_max  INTEGER NOT NULL DEFAULT 150
ocupacao_atual  INTEGER NOT NULL DEFAULT 0
tempo_estimado  INTEGER (em minutos)
aberta          BOOLEAN DEFAULT true
fotos           TEXT[] (array de URLs de imagens)
referencia      TEXT (ex: "Próximo ao Shopping Iguatemi")
criado_em       TIMESTAMP DEFAULT now()
atualizado_em   TIMESTAMP DEFAULT now()

Tabela: servicos

codeCode

id    UUID PRIMARY KEY
nome  TEXT NOT NULL (ex: "Pediatria", "Raio-X", "Teste Rápido COVID", "Vacinação")
icone TEXT (nome do ícone a renderizar)

Tabela: upa_servicos

codeCode

id         UUID PRIMARY KEY
upa_id     UUID REFERENCES upas(id)
servico_id UUID REFERENCES servicos(id)

Tabela: eventos

codeCode

id           UUID PRIMARY KEY
titulo       TEXT NOT NULL
descricao    TEXT
data_inicio  DATE NOT NULL
data_fim     DATE
upa_ids      UUID[] (array com IDs das UPAs participantes)
icone        TEXT
ativo        BOOLEAN DEFAULT true

Tabela: historico_ocupacao

codeCode

id          UUID PRIMARY KEY
upa_id      UUID REFERENCES upas(id)
ocupacao    INTEGER
registrado_em TIMESTAMP DEFAULT now()

Tabela: avaliacoes

codeCode

id                UUID PRIMARY KEY
upa_id            UUID REFERENCES upas(id)
nota              INTEGER (1 a 5)
tempo_real_min    INTEGER (tempo real de espera que o usuário esperou)
comentario        TEXT
criado_em         TIMESTAMP DEFAULT now()

LÓGICA DE STATUS DE OCUPAÇÃO

Calcule automaticamente com base em ocupacao_atual / capacidade_max:

PercentualStatusCorEmoji0% a 50%Baixa#22C55E🟢51% a 79%Moderada#F59E0B🟡80% a 100%Alta#EF4444🔴> 100%Superlotada#7C3AED🟣

Função utilitária a criar:

codeJs

function getStatus(ocupacao, capacidade) {
  const pct = Math.round((ocupacao / capacidade) * 100)
  if (pct <= 50) return { label: 'Baixa', cor: '#22C55E', emoji: '🟢', pct }
  if (pct <= 79) return { label: 'Moderada', cor: '#F59E0B', emoji: '🟡', pct }
  if (pct <= 100) return { label: 'Alta', cor: '#EF4444', emoji: '🔴', pct }
  return { label: 'Superlotada', cor: '#7C3AED', emoji: '🟣', pct }
}

TELAS DO APLICATIVO

1. TELA DE SPLASH / ONBOARDING

Logo do app centralizado

Animação de entrada suave

Solicitar permissão de localização ao usuário

Botão "Começar" leva direto ao Mapa

2. TELA PRINCIPAL — MAPA INTELIGENTE

Esta é a tela mais importante do app. Deve funcionar assim:

Mapa de fundo:

Mapa Google Maps ocupando 100% da tela

Botão de localizar usuário (canto inferior direito)

Barra de busca flutuante no topo (buscar UPA pelo nome ou bairro)

Pins personalizados no mapa:
Cada UPA no mapa deve ter um pin customizado (não o pin padrão do Google). O pin deve mostrar diretamente:

codeCode

[  🟢  ]
[ 42%  ]

Círculo colorido com a cor do status

Percentual de ocupação em texto branco dentro do círculo

Ao clicar no pin: abre um card flutuante (bottom sheet parcial)

Card Flutuante ao clicar no pin (Bottom Sheet — 40% da tela):

codeCode

━━━━━━━━━━━━━━━━━━━━━━
🏥  UPA Itapuã
📍  Rua das Pitangueiras, 452 — Itapuã
━━━━━━━━━━━━━━━━━━━━━━
🟢 42% ocupada    |    ⏱ ~18 min
80 / 150 pessoas  |    Aberta agora
━━━━━━━━━━━━━━━━━━━━━━
Serviços: Clínico Geral · Pediatria · Raio-X
━━━━━━━━━━━━━━━━━━━━━━
[  Ver detalhes  ]   [  📍 Como chegar  ]
━━━━━━━━━━━━━━━━━━━━━━

Banner superior fixo "Melhor opção agora":

codeCode

📍 Melhor opção agora: UPA Pitangueiras · 🟢 42% · ⏱ 18 min · 2,3 km

Deve calcular automaticamente cruzando: menor % de ocupação + menor distância do usuário

Clicável (abre detalhes da UPA recomendada)

Botões de ação no rodapé do mapa:

codeCode

[🎯 Filtrar]   [📊 Ordenar]   [🚨 Emergência]

3. TELA DE DETALHES DA UPA

Aberta ao clicar em "Ver detalhes" no card flutuante. Layout em scroll vertical:

Header:

Foto da UPA (carrossel horizontal se houver mais de uma foto)

Nome em destaque

Status atual em badge colorido

Botão de fechar/voltar

Bloco de Status em Tempo Real:

codeCode

┌──────────────────────────────┐
│  🟢  42% Ocupada             │
│  80 / 150 pessoas            │
│  ⏱ Tempo estimado: ~18 min  │
│  Atualizado há 5 minutos     │
└──────────────────────────────┘

Bloco de Informações:

codeCode

📍 Rua das Pitangueiras, 452 — Bairro Itapuã
🗺 CEP: 41500-000              [Copiar CEP]
📞 (71) 3333-4444              [Ligar]
🏷 Referência: Próximo ao Colégio Estadual
🕐 Funcionamento: 24 horas

Serviços Disponíveis:
Grid 3 colunas com ícone + nome:

codeCode

[🩺 Clínico]  [👶 Pediatria]  [💉 Vacinação]
[🔬 Raio-X]   [🧪 Teste Rápido] [🩸 Exames]

Botões de Ação:

codeCode

[📍 Abrir no Google Maps]
[🚗 Chamar Uber]
[📋 Copiar endereço completo]

Seção de Avaliações:

Média de estrelas

Últimas 3 avaliações dos usuários

Botão "Avaliar esta UPA"

Histórico de Ocupação (gráfico simples):

Gráfico de linha mostrando ocupação nas últimas 12 horas

Identifica horários de pico

4. FILTROS E ORDENAÇÃO (Bottom Sheet ou Modal)

Ordenar por:

Mais próxima de mim

Menor ocupação

Menor tempo estimado

Melhor avaliação

Filtrar por serviço disponível:

Clínico Geral

Pediatria

Vacinação

Testes Rápidos (COVID, dengue, etc.)

Raio-X

Exames laboratoriais

Filtrar por status:

Mostrar apenas abertas agora

Mostrar apenas com baixa ocupação (≤ 50%)

Botões: [Limpar filtros] [Aplicar]

5. TELA DE BUSCA POR NECESSIDADE

Acesso via ícone de busca na barra superior.

O usuário seleciona o que precisa (cards selecionáveis):

codeCode

[🤒 Febre/Gripe]   [🤕 Dor/Trauma]
[👶 Criança]        [🧪 Teste Rápido]
[💉 Vacinação]      [🩸 Exame]
[🚑 Urgência]       [🫁 Respiração]

Ao selecionar um ou mais cards, o app filtra e recomenda as UPAs que atendem aquela necessidade, ordenadas por ocupação + distância. Mostra resultado em lista com os mesmos badges de status.

6. TELA DE EVENTOS E CAMPANHAS

Lista de eventos ativos da prefeitura:

Cada card de evento:

codeCode

┌──────────────────────────────────────┐
│ 💉 Vacinação Infantil contra Sarampo │
│ 📅 Até 30/06/2025                    │
│ 🏥 4 UPAs participando               │
│ [Ver UPAs participantes →]           │
└──────────────────────────────────────┘

Ao clicar: abre detalhes do evento com lista das UPAs participantes (com status em tempo real de cada uma).

7. MODO EMERGÊNCIA

Ativado pelo botão vermelho 🚨 na tela do mapa.

Tela simples, tela cheia, fundo vermelho escuro:

codeCode

┌─────────────────────────────────┐
│         🚨 EMERGÊNCIA           │
│                                 │
│   [📞 Ligar para SAMU — 192]    │
│   [📞 Ligar para Bombeiros]     │
│   [📞 Ligar para Polícia]       │
│                                 │
│   UPA mais próxima agora:       │
│   🏥 UPA Itapuã — 1,2 km       │
│   🟢 42% ocupada · 18 min      │
│   [📍 Rota imediata]            │
└─────────────────────────────────┘

Botão flutuante "X" para fechar o modo emergência.

8. TELA DE AVALIAÇÃO

Após atendimento (ou a qualquer momento):

Selecionar a UPA visitada

Dar nota de 1 a 5 estrelas

Informar tempo real de espera (input numérico em minutos)

Campo de texto opcional para comentário

Botão "Enviar avaliação"

9. PAINEL ADMINISTRATIVO (WEB — Supabase ou tela web separada)

Interface web simples para a prefeitura/gestores atualizarem os dados:

Funcionalidades:

Listar todas as UPAs com status atual

Editar ocupação atual de cada UPA (campo numérico + botão salvar)

Editar tempo estimado de atendimento

Marcar UPA como aberta/fechada

Criar/editar/remover eventos e campanhas

Ver histórico de ocupação por UPA

Ver avaliações dos usuários

NAVEGAÇÃO DO APP

Use React Navigation com a seguinte estrutura:

codeCode

Stack Navigator (raiz)
├── Splash Screen
├── Tab Navigator (telas principais)
│   ├── Tab 1: Mapa (ícone: map-marker)
│   ├── Tab 2: Busca (ícone: magnify)
│   ├── Tab 3: Eventos (ícone: bullhorn)
│   └── Tab 4: Sobre/Info (ícone: information)
└── Stack screens (abertas por cima)
    ├── Detalhes da UPA
    ├── Avaliação
    └── Modo Emergência

INTEGRAÇÕES EXTERNAS

Google Maps (rota)

codeJs

const abrirMaps = (lat, lng, nome) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${nome}`
  Linking.openURL(url)
}

Uber (deeplink)

codeJs

const chamarUber = (lat, lng) => {
  const url = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`
  Linking.canOpenURL(url).then(supported => {
    if (supported) Linking.openURL(url)
    else Linking.openURL(`https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`)
  })
}

Copiar CEP/Endereço

codeJs

import * as Clipboard from 'expo-clipboard'
const copiarCEP = async (cep) => {
  await Clipboard.setStringAsync(cep)
  // Mostrar toast: "CEP copiado!"
}

Ligação telefônica

codeJs

const ligar = (telefone) => {
  Linking.openURL(`tel:${telefone}`)
}

ALGORITMO "MELHOR OPÇÃO AGORA"

codeJs

function melhorOpcaoAgora(upas, localizacaoUsuario) {
  return upas
    .filter(upa => upa.aberta)
    .map(upa => {
      const distancia = calcularDistanciaKm(localizacaoUsuario, { lat: upa.latitude, lng: upa.longitude })
      const pct = (upa.ocupacao_atual / upa.capacidade_max) * 100
      // Score: menor é melhor (peso 60% ocupação + 40% distância normalizada)
      const score = (pct * 0.6) + (distancia * 10 * 0.4)
      return { ...upa, distancia, pct, score }
    })
    .sort((a, b) => a.score - b.score)[0]
}

IDENTIDADE VISUAL

Paleta de cores:

codeCode

Primária:       #1D4ED8  (azul saúde)
Sucesso/Baixa:  #22C55E  (verde)
Atenção/Média:  #F59E0B  (âmbar)
Perigo/Alta:    #EF4444  (vermelho)
Emergência:     #7C3AED  (roxo)
Fundo:          #F8FAFC  (cinza muito claro)
Texto:          #0F172A  (quase preto)
Texto secundário: #64748B

Tipografia: Sistema nativo (San Francisco no iOS, Roboto no Android). Hierarquia clara: nome da UPA em 20px bold, informações secundárias em 14px regular.

Ícones: MaterialCommunityIcons (já incluso no Expo).

DADOS DE EXEMPLO (SEED DATA)

Insira ao menos 5 UPAs fictícias com dados realistas para Salvador/BA para desenvolvimento e apresentação:

codeJSON

[
  {
    "nome": "UPA Itapuã",
    "endereco": "Rua das Pitangueiras, 452",
    "bairro": "Itapuã",
    "cep": "41740-130",
    "latitude": -12.9608,
    "longitude": -38.3305,
    "capacidade_max": 150,
    "ocupacao_atual": 63,
    "tempo_estimado": 18,
    "referencia": "Próximo à Orla de Itapuã"
  },
  {
    "nome": "UPA Pau da Lima",
    "endereco": "Av. Luís Viana Filho, 4000",
    "bairro": "Pau da Lima",
    "cep": "41250-020",
    "latitude": -12.9107,
    "longitude": -38.4034,
    "capacidade_max": 200,
    "ocupacao_atual": 178,
    "tempo_estimado": 55,
    "referencia": "Ao lado do posto BR"
  },
  {
    "nome": "UPA Cajazeiras",
    "endereco": "Rua Dr. Mário Augusto Teixeira de Freitas, s/n",
    "bairro": "Cajazeiras",
    "cep": "41310-000",
    "latitude": -12.8847,
    "longitude": -38.4358,
    "capacidade_max": 180,
    "ocupacao_atual": 54,
    "tempo_estimado": 22,
    "referencia": "Em frente ao Cajazeiras Shopping"
  },
  {
    "nome": "UPA Mussurunga",
    "endereco": "Av. Gal Costa, 3900",
    "bairro": "Mussurunga",
    "cep": "41490-250",
    "latitude": -12.8969,
    "longitude": -38.3367,
    "capacidade_max": 160,
    "ocupacao_atual": 32,
    "tempo_estimado": 12,
    "referencia": "Perto do Aeroporto de Salvador"
  },
  {
    "nome": "UPA Periperi",
    "endereco": "Largo de Periperi, s/n",
    "bairro": "Periperi",
    "cep": "40730-000",
    "latitude": -12.8483,
    "longitude": -38.5226,
    "capacidade_max": 130,
    "ocupacao_atual": 130,
    "tempo_estimado": 70,
    "referencia": "Na praça central de Periperi"
  }
]

Serviços a inserir: Clínico Geral, Pediatria, Vacinação, Teste Rápido COVID, Raio-X, Exames Laboratoriais, Ortopedia, Nebulização.

COMPORTAMENTO OFFLINE

Cachear a última lista de UPAs localmente com AsyncStorage

Ao abrir sem internet, exibir os últimos dados com aviso: "Dados offline — última atualização: [hora]"

Mapa não funciona offline, exibir mensagem clara nesse caso

ACESSIBILIDADE

Todos os botões com accessibilityLabel descritivo

Cores de status nunca são o único indicador — sempre acompanham texto e ícone

Tamanhos de fonte mínimos: 14px para informações secundárias, 16px para primárias

Contraste mínimo 4.5:1 em todos os textos

ESTRUTURA DE PASTAS

codeCode

/src
  /components
    MapPin.tsx
    UpaCard.tsx
    StatusBadge.tsx
    ServicoChip.tsx
    BottomSheet.tsx
    EmergencyModal.tsx
  /screens
    SplashScreen.tsx
    MapScreen.tsx
    UpaDetailScreen.tsx
    SearchScreen.tsx
    EventsScreen.tsx
    RatingScreen.tsx
    EmergencyScreen.tsx
  /services
    supabase.ts
    location.ts
    maps.ts
  /utils
    status.ts
    distance.ts
    formatters.ts
  /store
    upaStore.ts
  /types
    index.ts

OBSERVAÇÕES FINAIS PARA O DESENVOLVEDOR

O app deve funcionar como um MVP funcional com dados reais cadastrados manualmente via Supabase

A atualização de ocupação será manual pelo gestor via painel admin nesta versão — prepare o sistema para futuramente receber uma API da prefeitura

Prioridade máxima: velocidade de decisão do usuário — o número de cliques até chegar à rota deve ser no máximo 2

O botão de emergência deve estar sempre visível na tela do mapa

Todos os dados sensíveis (chaves de API) devem ficar em variáveis de ambiente .env

Implemente loading skeletons enquanto os dados carregam (nunca tela em branco)

Mensagens de erro amigáveis em português (nunca exibir erros técnicos ao usuário)

O app se destina a apresentação de TCC, então deve ter qualidade de produção visual desde o início.


quero um app facil de usar nos dias atuais, completo e moderno.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://upa-alerta-agora.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8ff2715d-789f-4c61-a6be-dad795619ba2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
