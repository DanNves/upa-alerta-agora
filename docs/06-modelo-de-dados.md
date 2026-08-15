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
