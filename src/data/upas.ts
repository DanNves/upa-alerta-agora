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
};

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

export const UPAS_SEED: UPA[] = [
  {
    id: "upa-itapua",
    nome: "UPA Itapuã",
    endereco: "Rua das Pitangueiras, 452",
    bairro: "Itapuã",
    cidade: "Salvador",
    estado: "BA",
    cep: "41740-130",
    latitude: -12.9608,
    longitude: -38.3605,
    telefone: "(71) 3333-4444",
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
      { nota: 5, tempo_real_min: 15, comentario: "Levei meu filho e fomos super bem atendidos.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(63),
  },
  {
    id: "upa-pau-da-lima",
    nome: "UPA Pau da Lima",
    endereco: "Av. Luís Viana Filho, 4000",
    bairro: "Pau da Lima",
    cidade: "Salvador",
    estado: "BA",
    cep: "41250-020",
    latitude: -12.9107,
    longitude: -38.4034,
    telefone: "(71) 3333-1010",
    capacidade_max: 200,
    ocupacao_atual: 178,
    tempo_estimado: 55,
    aberta: true,
    referencia: "Ao lado do posto BR",
    servicos: ["Clínico Geral", "Ortopedia", "Raio-X", "Nebulização"],
    atualizado_em: new Date(Date.now() - 8 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 3, tempo_real_min: 60, comentario: "Demorado mas os médicos são bons.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(178),
  },
  {
    id: "upa-cajazeiras",
    nome: "UPA Cajazeiras",
    endereco: "Rua Dr. Mário A. T. de Freitas, s/n",
    bairro: "Cajazeiras",
    cidade: "Salvador",
    estado: "BA",
    cep: "41310-000",
    latitude: -12.8847,
    longitude: -38.4358,
    telefone: "(71) 3333-2020",
    capacidade_max: 180,
    ocupacao_atual: 54,
    tempo_estimado: 22,
    aberta: true,
    referencia: "Em frente ao Cajazeiras Shopping",
    servicos: ["Clínico Geral", "Pediatria", "Vacinação", "Exames", "Teste Rápido"],
    atualizado_em: new Date(Date.now() - 3 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 4, tempo_real_min: 25, comentario: "Instalações limpas, atendimento ok.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(54),
  },
  {
    id: "upa-mussurunga",
    nome: "UPA Mussurunga",
    endereco: "Av. Gal Costa, 3900",
    bairro: "Mussurunga",
    cidade: "Salvador",
    estado: "BA",
    cep: "41490-250",
    latitude: -12.8969,
    longitude: -38.3367,
    telefone: "(71) 3333-3030",
    capacidade_max: 160,
    ocupacao_atual: 32,
    tempo_estimado: 12,
    aberta: true,
    referencia: "Perto do Aeroporto de Salvador",
    servicos: ["Clínico Geral", "Pediatria", "Teste Rápido", "Vacinação"],
    atualizado_em: new Date(Date.now() - 2 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 5, tempo_real_min: 10, comentario: "Mais rápida que esperava!", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(32),
  },
  {
    id: "upa-periperi",
    nome: "UPA Periperi",
    endereco: "Largo de Periperi, s/n",
    bairro: "Periperi",
    cidade: "Salvador",
    estado: "BA",
    cep: "40730-000",
    latitude: -12.8483,
    longitude: -38.5226,
    telefone: "(71) 3333-4040",
    capacidade_max: 130,
    ocupacao_atual: 138,
    tempo_estimado: 70,
    aberta: true,
    referencia: "Na praça central de Periperi",
    servicos: ["Clínico Geral", "Ortopedia", "Exames", "Nebulização", "Raio-X"],
    atualizado_em: new Date(Date.now() - 11 * 60_000).toISOString(),
    avaliacoes: [
      { nota: 2, tempo_real_min: 90, comentario: "Muito cheia hoje, esperei bastante.", criado_em: new Date().toISOString() },
    ],
    historico: baseHist(138),
  },
];

export const EVENTOS_SEED: Evento[] = [
  {
    id: "ev-1",
    titulo: "Vacinação Infantil contra Sarampo",
    descricao: "Campanha de imunização para crianças de 6 meses a 5 anos. Leve a caderneta de vacinação.",
    data_inicio: "2025-06-01",
    data_fim: "2025-06-30",
    upa_ids: ["upa-itapua", "upa-cajazeiras", "upa-mussurunga", "upa-pau-da-lima"],
    icone: "💉",
  },
  {
    id: "ev-2",
    titulo: "Testagem Rápida de Dengue",
    descricao: "Testes gratuitos com resultado em 20 minutos. Atenda à campanha do verão.",
    data_inicio: "2025-05-15",
    data_fim: "2025-07-15",
    upa_ids: ["upa-cajazeiras", "upa-mussurunga"],
    icone: "🦟",
  },
  {
    id: "ev-3",
    titulo: "Dia D Outubro Rosa",
    descricao: "Mamografia gratuita e orientações de prevenção ao câncer de mama.",
    data_inicio: "2025-10-26",
    data_fim: "2025-10-26",
    upa_ids: ["upa-itapua", "upa-periperi"],
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

export function getStatus(ocupacao: number, capacidade: number): Status {
  const pct = Math.round((ocupacao / capacidade) * 100);
  if (pct <= 50) return { label: "Baixa", cor: "#22C55E", bg: "#22C55E", emoji: "🟢", pct, token: "success" };
  if (pct <= 79) return { label: "Moderada", cor: "#F59E0B", bg: "#F59E0B", emoji: "🟡", pct, token: "warning" };
  if (pct <= 100) return { label: "Alta", cor: "#EF4444", bg: "#EF4444", emoji: "🔴", pct, token: "danger" };
  return { label: "Superlotada", cor: "#7C3AED", bg: "#7C3AED", emoji: "🟣", pct, token: "emergency" };
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

export function melhorOpcao(upas: UPA[], loc: { lat: number; lng: number }) {
  return upas
    .filter((u) => u.aberta)
    .map((u) => {
      const d = distanciaKm(loc, { lat: u.latitude, lng: u.longitude });
      const pct = (u.ocupacao_atual / u.capacidade_max) * 100;
      const score = pct * 0.6 + d * 10 * 0.4;
      return { upa: u, distancia: d, pct, score };
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

export function mapsUrl(lat: number, lng: number, nome?: string) {
  const q = nome ? `&destination_place_id=${encodeURIComponent(nome)}` : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${q}`;
}
export function uberUrl(lat: number, lng: number) {
  return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;
}

// Default user location: centro de Salvador, ajustado para boa visualização
export const DEFAULT_USER_LOC = { lat: -12.92, lng: -38.42 };
