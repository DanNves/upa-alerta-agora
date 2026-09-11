/**
 * Cliente do banco de dados próprio do projeto UPA+ (Supabase independente).
 *
 * Este é o banco usado pelo app em produção: contém as 11 UPAs de Salvador,
 * serviços, campanhas, histórico de ocupação e avaliações.
 * A chave abaixo é publishable/anon (pública por design) e o acesso é limitado
 * pelas políticas de segurança do próprio banco.
 *
 * NENHUMA regra de negócio vive aqui — cálculo de ocupação, cores e score de
 * recomendação continuam exclusivamente em `src/data/regras.ts`.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://tdybgdbldhoirjjmxaxn.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeWJnZGJsZGhvaXJqam14YXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMDc1NTQsImV4cCI6MjEwNDY4MzU1NH0.kjNLARVWcYHpc87NCMHRfMpjvdb4Z7IurU1msZ0bRb4";

function criar() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: undefined,
    },
  });
}

let _client: ReturnType<typeof criar> | undefined;

/** Cliente compartilhado (criado sob demanda, seguro em SSR). */
export const db = new Proxy({} as ReturnType<typeof criar>, {
  get(_, prop, receiver) {
    if (!_client) _client = criar();
    return Reflect.get(_client, prop, receiver);
  },
});
