# 06 — Modelo de dados

As entidades estão declaradas em `src/data/upas.ts`. O modelo foi mantido
compatível com um futuro banco relacional (uma tabela por entidade).

## UPA

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | texto | Identificador único, usado nas rotas e nas campanhas (ex.: `upa-itapua`) |
| nome | texto | Nome oficial da unidade |
| endereco | texto | Logradouro e número |
| bairro | texto | Bairro |
| cidade | texto | Município (Salvador) |
| estado | texto | UF (BA) |
| cep | texto | CEP |
| latitude | número | Coordenada geográfica |
| longitude | número | Coordenada geográfica |
| telefone | texto | Telefone público da unidade |
| capacidade_max | inteiro | Capacidade máxima de atendimento simultâneo |
| ocupacao_atual | inteiro | Pessoas presentes no momento (pode exceder a capacidade) |
| tempo_estimado | inteiro | Tempo estimado de espera, em minutos |
| aberta | booleano | Se a unidade está em funcionamento |
| referencia | texto | Ponto de referência para localização |
| servicos | lista | Serviços disponíveis na unidade |
| atualizado_em | data/hora | Momento da última atualização de ocupação |
| avaliacoes | lista | Avaliações recebidas |
| historico | lista | Ocupação por hora nas últimas 12 horas |

## Serviço (valores possíveis)

Clínico Geral, Pediatria, Vacinação, Teste Rápido, Raio-X, Exames, Ortopedia, Nebulização.

## Avaliação

| Campo | Tipo | Descrição |
| --- | --- | --- |
| nota | inteiro 1–5 | Nota atribuída ao atendimento |
| tempo_real_min | inteiro | Tempo de espera efetivamente enfrentado |
| comentario | texto | Comentário livre |
| criado_em | data/hora | Momento do envio |

## Evento (campanha)

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | texto | Identificador único |
| titulo | texto | Nome da campanha |
| descricao | texto | Detalhamento |
| data_inicio | data | Início |
| data_fim | data | Encerramento |
| horario | texto (opcional) | Faixa de horário de atendimento |
| informacoes | texto (opcional) | Informações adicionais e requisitos |
| upa_ids | lista | Unidades participantes |
| icone | texto | Emoji ilustrativo |

## Histórico de ocupação

| Campo | Tipo | Descrição |
| --- | --- | --- |
| hora | texto | Hora no formato `14h` |
| ocupacao | inteiro | Pessoas presentes naquela hora |

## Unidades cadastradas (11 UPAs 24h de Salvador/BA)

Itapuã (Dr. Hélio Machado), Periperi (Prof. Adroaldo Albergaria),
São Cristóvão III, Vale dos Barris, Pirajá / Santo Inácio, Paripe, Brotas,
Valéria, San Martin, Santo Antônio e Cabula.

## Estado atual dos dados (referência: 2026)

No MVP os dados vivem em memória (`src/data/upas.ts`) e são carregados no
estado global (Zustand). Não há banco de dados provisionado. As campanhas
seed usam datas de 2026 e cobrem os três status derivados pela regra RN10:

| Campanha | Período | Status derivado |
| --- | --- | --- |
| Testagem Rápida de Dengue | 01/06/2026 – 31/07/2026 | Encerrado |
| Vacinação Infantil contra Sarampo | 10/08/2026 – 31/08/2026 | Em andamento |
| Dia D Outubro Rosa | 24/10/2026 – 25/10/2026 | Programado |

## Esquema relacional de referência (evolução pós-MVP)

Modelo previsto para a migração do estado em memória para PostgreSQL.

```sql
create type nivel_ocupacao as enum ('baixa','moderada','alta','superlotada');

create table upa (
  id             text primary key,
  nome           text        not null,
  endereco       text        not null,
  bairro         text        not null,
  cidade         text        not null default 'Salvador',
  estado         char(2)     not null default 'BA',
  cep            text,
  latitude       double precision not null,
  longitude      double precision not null,
  telefone       text,
  capacidade_max integer     not null check (capacidade_max > 0),
  ocupacao_atual integer     not null default 0 check (ocupacao_atual >= 0),
  tempo_estimado integer     not null default 0,
  aberta         boolean     not null default true,
  referencia     text,
  atualizado_em  timestamptz not null default now()
);

create table servico (
  id   serial primary key,
  nome text unique not null
);

create table upa_servico (
  upa_id     text    not null references upa(id) on delete cascade,
  servico_id integer not null references servico(id) on delete cascade,
  primary key (upa_id, servico_id)
);

create table avaliacao (
  id             uuid primary key default gen_random_uuid(),
  upa_id         text    not null references upa(id) on delete cascade,
  nota           smallint not null check (nota between 1 and 5),
  tempo_real_min integer  check (tempo_real_min >= 0),
  comentario     text,
  criado_em      timestamptz not null default now()
);

create table ocupacao_historico (
  id        bigserial primary key,
  upa_id    text    not null references upa(id) on delete cascade,
  hora      timestamptz not null,
  ocupacao  integer not null check (ocupacao >= 0),
  unique (upa_id, hora)
);

create table evento (
  id          text primary key,
  titulo      text not null,
  descricao   text not null,
  data_inicio date not null,
  data_fim    date not null check (data_fim >= data_inicio),
  horario     text,
  informacoes text,
  icone       text
);

create table evento_upa (
  evento_id text not null references evento(id) on delete cascade,
  upa_id    text not null references upa(id) on delete cascade,
  primary key (evento_id, upa_id)
);

create table gestor_upa (
  usuario_id uuid not null,
  upa_id     text not null references upa(id) on delete cascade,
  primary key (usuario_id, upa_id)
);

create index on avaliacao (upa_id, criado_em desc);
create index on ocupacao_historico (upa_id, hora desc);
```

Regras de acesso previstas: leitura pública de `upa`, `servico`, `upa_servico`,
`evento` e `evento_upa`; escrita de ocupação e campanhas restrita ao gestor
vinculado em `gestor_upa`; `avaliacao` aceita inserção pública e leitura
agregada. O nível de ocupação (`nivel_ocupacao`) permanece derivado em
`src/data/regras.ts`, não persistido.
