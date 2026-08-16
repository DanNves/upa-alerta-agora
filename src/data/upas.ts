import {
  nivelOcupacao,
  percentualOcupacao,
  scoreRecomendacao,
  type NivelOcupacao,
  type OrigemDado,
} from "./regras";

export type Servico =

  | "Clínico Geral"
  | "Pediatria"
  | "Vacinação"
  | "Teste Rápido"
  | "Raio-X"
  | "Exames"
  | "Ortopedia"
  | "Nebulização";

export type UPA = {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
  telefone: string;
  capacidade_max: number;
  ocupacao_atual: number;
  tempo_estimado: number;
  aberta: boolean;
  referencia: string;
  servicos: Servico[];
  atualizado_em: string; // ISO
  /** Origem do dado de ocupação (RN09). Ausente = "simulada". */
  fonte_dados?: OrigemDado;
  foto?: string;
  avaliacoes: { nota: number; tempo_real_min: number; comentario: string; criado_em: string }[];
  historico: { hora: string; ocupacao: number }[]; // últimas 12h

};

export type Evento = {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  upa_ids: string[];
  icone: string; // emoji
  horario?: string;
  informacoes?: string;
};

/** Status do evento derivado das datas (RN10). */
export function statusEvento(ev: Evento): "Programado" | "Em andamento" | "Encerrado" {
  const hoje = new Date().toISOString().slice(0, 10);
  if (hoje < ev.data_inicio) return "Programado";
  if (hoje > ev.data_fim) return "Encerrado";
  return "Em andamento";
}

const horas12 = () =>
  Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() - (11 - i));
    return d.getHours().toString().padStart(2, "0") + "h";
  });

const baseHist = (target: number) => {
  const labels = horas12();
  return labels.map((hora, i) => {
    const peak = i >= 4 && i <= 8 ? 1 : 0.7;
    const jitter = (i * 13) % 17;
    return { hora, ocupacao: Math.max(10, Math.round(target * peak - 10 + jitter)) };
  });
};

export const SERVICOS_TODOS: Servico[] = [
  "Clínico Geral",
  "Pediatria",
  "Vacinação",
  "Teste Rápido",
  "Raio-X",
  "Exames",
  "Ortopedia",
  "Nebulização",
];

// Lista oficial das UPAs 24h de Salvador-BA (Secretaria Municipal da Saúde).
// Coordenadas obtidas via referências de endereço público de cada unidade.
export const UPAS_SEED: UPA[] = [
  {
    id: "upa-itapua",
    nome: "UPA Itapuã - Dr. Hélio Machado",
    endereco: "Rua da Cacimba, s/n",
    bairro: "Itapuã",
    cidade: "Salvador",
    estado: "BA",
    cep: "41610-040",
    latitude: -12.95264,
    longitude: -38.36172,
    telefone: "(71) 3611-7118",
    capacidade_max: 150,
    ocupacao_atual: 63,
    tempo_estimado: 18,
    aberta: true,
    referencia: "Próximo à Orla de Itapuã",
    servicos: ["Clínico Geral", "Pediatria", "Raio-X", "Vacinação", "Exames"],
    atualizado_em: new Date(Date.now() - 5 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 5, tempo_real_min: 20, comentario: "Atendimento rápido e equipe atenciosa.", criado_em: new Date().toISOString() },
      { nota: 4, tempo_real_min: 35, comentario: "Bom, mas a recepção poderia ser mais ágil.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(63),
  },
  {
    id: "upa-periperi",
    nome: "UPA Periperi - Prof. Adroaldo Albergaria",
    endereco: "R. das Pedrinhas, 358",
    bairro: "Periperi",
    cidade: "Salvador",
    estado: "BA",
    cep: "40730-000",
    latitude: -12.84583,
    longitude: -38.51913,
    telefone: "(71) 3611-5718",
    capacidade_max: 140,
    ocupacao_atual: 121,
    tempo_estimado: 55,
    aberta: true,
    referencia: "Subúrbio Ferroviário",
    servicos: ["Clínico Geral", "Ortopedia", "Exames", "Nebulização", "Raio-X"],
    atualizado_em: new Date(Date.now() - 8 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 3, tempo_real_min: 60, comentario: "Demorado mas os médicos são bons.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(121),
  },
  {
    id: "upa-sao-cristovao",
    nome: "UPA São Cristóvão III Municipal",
    endereco: "Rua Arquiteto Marcos M. Solter, s/n",
    bairro: "São Cristóvão",
    cidade: "Salvador",
    estado: "BA",
    cep: "41510-000",
    latitude: -12.94124,
    longitude: -38.36037,
    telefone: "(71) 3273-4690",
    capacidade_max: 180,
    ocupacao_atual: 54,
    tempo_estimado: 22,
    aberta: true,
    referencia: "Próximo ao aeroporto",
    servicos: ["Clínico Geral", "Pediatria", "Vacinação", "Exames", "Teste Rápido"],
    atualizado_em: new Date(Date.now() - 3 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 4, tempo_real_min: 25, comentario: "Instalações limpas, atendimento ok.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(54),
  },
  {
    id: "upa-vale-barris",
    nome: "UPA Vale dos Barris",
    endereco: "Praça Dr. João Mangabeira, s/n",
    bairro: "Garcia",
    cidade: "Salvador",
    estado: "BA",
    cep: "40110-060",
    latitude: -12.98458,
    longitude: -38.51672,
    telefone: "(71) 3277-5493",
    capacidade_max: 120,
    ocupacao_atual: 78,
    tempo_estimado: 30,
    aberta: true,
    referencia: "Vale dos Barris / Centro",
    servicos: ["Clínico Geral", "Pediatria", "Raio-X", "Exames"],
    atualizado_em: new Date(Date.now() - 7 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 4, tempo_real_min: 30, comentario: "Boa estrutura no centro.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(78),
  },
  {
    id: "upa-piraja",
    nome: "UPA Pirajá / Santo Inácio",
    endereco: "R. Direta de Santo Inácio, s/n",
    bairro: "Jardim Santo Inácio",
    cidade: "Salvador",
    estado: "BA",
    cep: "40330-220",
    latitude: -12.90781,
    longitude: -38.48452,
    telefone: "(71) 3901-0010",
    capacidade_max: 160,
    ocupacao_atual: 142,
    tempo_estimado: 60,
    aberta: true,
    referencia: "Pirajá",
    servicos: ["Clínico Geral", "Ortopedia", "Raio-X", "Nebulização"],
    atualizado_em: new Date(Date.now() - 11 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 2, tempo_real_min: 90, comentario: "Muito cheia hoje, esperei bastante.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(142),
  },
  {
    id: "upa-paripe",
    nome: "UPA Paripe",
    endereco: "R. São Gonçalo de Paripe, 2-62",
    bairro: "Paripe",
    cidade: "Salvador",
    estado: "BA",
    cep: "40800-000",
    latitude: -12.83784,
    longitude: -38.51347,
    telefone: "(71) 3611-5400",
    capacidade_max: 130,
    ocupacao_atual: 47,
    tempo_estimado: 15,
    aberta: true,
    referencia: "Subúrbio Ferroviário",
    servicos: ["Clínico Geral", "Pediatria", "Vacinação", "Teste Rápido"],
    atualizado_em: new Date(Date.now() - 2 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 5, tempo_real_min: 12, comentario: "Atendimento excelente!", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(47),
  },
  {
    id: "upa-brotas",
    nome: "UPA Brotas",
    endereco: "R. Jardim Madalena, s/n",
    bairro: "Campinas de Brotas",
    cidade: "Salvador",
    estado: "BA",
    cep: "40279-180",
    latitude: -12.97993,
    longitude: -38.47782,
    telefone: "(71) 3044-0300",
    capacidade_max: 170,
    ocupacao_atual: 95,
    tempo_estimado: 35,
    aberta: true,
    referencia: "Campinas de Brotas",
    servicos: ["Clínico Geral", "Pediatria", "Raio-X", "Exames", "Nebulização"],
    atualizado_em: new Date(Date.now() - 6 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 4, tempo_real_min: 40, comentario: "Bem localizada, equipe atenciosa.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(95),
  },
  {
    id: "upa-valeria",
    nome: "UPA Valéria",
    endereco: "R. do Lavrador, s/n - Colégio Noemia Rego",
    bairro: "Valéria",
    cidade: "Salvador",
    estado: "BA",
    cep: "41280-000",
    latitude: -12.89113,
    longitude: -38.46358,
    telefone: "(71) 3273-4695",
    capacidade_max: 110,
    ocupacao_atual: 38,
    tempo_estimado: 12,
    aberta: true,
    referencia: "Valéria",
    servicos: ["Clínico Geral", "Pediatria", "Vacinação"],
    atualizado_em: new Date(Date.now() - 4 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 5, tempo_real_min: 10, comentario: "Rápido e tranquilo.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(38),
  },
  {
    id: "upa-san-martin",
    nome: "UPA San Martin",
    endereco: "R. do Forno, s/n",
    bairro: "Santa Mônica",
    cidade: "Salvador",
    estado: "BA",
    cep: "40325-300",
    latitude: -12.93962,
    longitude: -38.48072,
    telefone: "(71) 3611-5300",
    capacidade_max: 150,
    ocupacao_atual: 132,
    tempo_estimado: 50,
    aberta: true,
    referencia: "San Martin / Santa Mônica",
    servicos: ["Clínico Geral", "Ortopedia", "Raio-X", "Nebulização", "Exames"],
    atualizado_em: new Date(Date.now() - 9 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 3, tempo_real_min: 55, comentario: "Movimento alto, mas atendem bem.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(132),
  },
  {
    id: "upa-santo-antonio",
    nome: "UPA Santo Antônio",
    endereco: "Av. Dendezeiros do Bonfim, 1",
    bairro: "Roma",
    cidade: "Salvador",
    estado: "BA",
    cep: "40415-000",
    latitude: -12.92151,
    longitude: -38.50632,
    telefone: "(71) 3877-3900",
    capacidade_max: 140,
    ocupacao_atual: 84,
    tempo_estimado: 28,
    aberta: true,
    referencia: "Próximo à Cidade Baixa",
    servicos: ["Clínico Geral", "Pediatria", "Raio-X", "Vacinação"],
    atualizado_em: new Date(Date.now() - 5 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 4, tempo_real_min: 30, comentario: "Bom atendimento na cidade baixa.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(84),
  },
  {
    id: "upa-cabula",
    nome: "UPA Cabula",
    endereco: "1ª Travessa do Saboeiro, s/n",
    bairro: "Saboeiro",
    cidade: "Salvador",
    estado: "BA",
    cep: "41180-690",
    latitude: -12.93951,
    longitude: -38.45342,
    telefone: "(71) 3387-4763",
    capacidade_max: 160,
    ocupacao_atual: 71,
    tempo_estimado: 25,
    aberta: true,
    referencia: "Cabula / Saboeiro",
    servicos: ["Clínico Geral", "Pediatria", "Raio-X", "Exames", "Teste Rápido"],
    atualizado_em: new Date(Date.now() - 3 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 4, tempo_real_min: 28, comentario: "Atendimento eficiente.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(71),
  },
];

export const EVENTOS_SEED: Evento[] = [
  {
    id: "ev-1",
    titulo: "Vacinação Infantil contra Sarampo",
    descricao: "Campanha de imunização para crianças de 6 meses a 5 anos. Leve a caderneta de vacinação.",
    data_inicio: "2026-08-10",
    data_fim: "2026-08-31",
    horario: "08h às 17h",
    informacoes: "Levar caderneta de vacinação e documento da criança.",
    upa_ids: ["upa-itapua", "upa-sao-cristovao", "upa-paripe", "upa-valeria"],
    icone: "💉",
  },
  {
    id: "ev-2",
    titulo: "Testagem Rápida de Dengue",
    descricao: "Testes gratuitos com resultado em 20 minutos. Campanha de combate ao mosquito.",
    data_inicio: "2026-06-01",
    data_fim: "2026-07-31",
    horario: "07h às 16h",
    informacoes: "Campanha encerrada. Procure a unidade em caso de sintomas.",
    upa_ids: ["upa-sao-cristovao", "upa-cabula", "upa-brotas"],
    icone: "🦟",
  },
  {
    id: "ev-3",
    titulo: "Dia D Outubro Rosa",
    descricao: "Mamografia gratuita e orientações de prevenção ao câncer de mama.",
    data_inicio: "2026-10-24",
    data_fim: "2026-10-25",
    horario: "08h às 14h",
    informacoes: "Prioridade para mulheres acima de 40 anos. Levar cartão SUS.",
    upa_ids: ["upa-itapua", "upa-periperi", "upa-vale-barris"],
    icone: "🎀",
  },
];

export type Status = {
  label: "Baixa" | "Moderada" | "Alta" | "Superlotada";
  cor: string;
  bg: string;
  emoji: string;
  pct: number;
  token: "success" | "warning" | "danger" | "emergency";
};

const STATUS_MAP: Record<NivelOcupacao, Omit<Status, "pct">> = {
  baixa: { label: "Baixa", cor: "#22C55E", bg: "#22C55E", emoji: "🟢", token: "success" },
  moderada: { label: "Moderada", cor: "#F59E0B", bg: "#F59E0B", emoji: "🟡", token: "warning" },
  alta: { label: "Alta", cor: "#EF4444", bg: "#EF4444", emoji: "🔴", token: "danger" },
  superlotada: { label: "Superlotada", cor: "#7C3AED", bg: "#7C3AED", emoji: "🟣", token: "emergency" },
};

/** Indicador visual derivado das regras centralizadas (src/data/regras.ts). */
export function getStatus(ocupacao: number, capacidade: number): Status {
  const pct = percentualOcupacao(ocupacao, capacidade);
  return { ...STATUS_MAP[nivelOcupacao(pct)], pct };
}

/** Origem do dado de ocupação (RN09). Protótipo: manual ou simulada. */
export function origemDado(upa: UPA): OrigemDado {
  return upa.fonte_dados ?? "simulada";
}

// Haversine
export function distanciaKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/**
 * "Opção mais adequada agora" — recomendação computacional (RN06/RN14).
 * Não é recomendação médica e não garante atendimento mais rápido.
 */
export function melhorOpcao(upas: UPA[], loc: { lat: number; lng: number }) {
  return upas
    .filter((u) => u.aberta)
    .map((u) => {
      const d = distanciaKm(loc, { lat: u.latitude, lng: u.longitude });
      const pct = percentualOcupacao(u.ocupacao_atual, u.capacidade_max);
      return { upa: u, distancia: d, pct, score: scoreRecomendacao(pct, d) };
    })
    .sort((a, b) => a.score - b.score)[0];
}


export function tempoAtras(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "agora mesmo";
  if (m === 1) return "há 1 minuto";
  if (m < 60) return `há ${m} minutos`;
  const h = Math.round(m / 60);
  return h === 1 ? "há 1 hora" : `há ${h} horas`;
}

export function mapsUrl(
  lat: number,
  lng: number,
  _nome?: string,
  origin?: { lat: number; lng: number },
) {
  const base = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  return origin ? `${base}&origin=${origin.lat},${origin.lng}` : base;
}
export function uberUrl(lat: number, lng: number) {
  return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;
}

// Localização padrão: centro geográfico das UPAs de Salvador.
export const DEFAULT_USER_LOC = { lat: -12.925, lng: -38.46 };
