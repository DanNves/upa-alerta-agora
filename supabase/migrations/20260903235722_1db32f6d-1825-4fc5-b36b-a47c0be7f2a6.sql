GRANT SELECT ON public.upas TO anon, authenticated;
GRANT SELECT ON public.servicos TO anon, authenticated;
GRANT SELECT ON public.upa_servicos TO anon, authenticated;
GRANT SELECT ON public.eventos TO anon, authenticated;
GRANT SELECT, INSERT ON public.avaliacoes TO anon, authenticated;
GRANT SELECT, INSERT ON public.historico_ocupacao TO anon, authenticated;
GRANT UPDATE (ocupacao_atual, tempo_estimado, aberta, atualizado_em) ON public.upas TO anon, authenticated;
GRANT ALL ON public.upas TO service_role;
GRANT ALL ON public.servicos TO service_role;
GRANT ALL ON public.upa_servicos TO service_role;
GRANT ALL ON public.eventos TO service_role;
GRANT ALL ON public.avaliacoes TO service_role;
GRANT ALL ON public.historico_ocupacao TO service_role;

CREATE POLICY "Atualizacao publica de ocupacao upas"
  ON public.upas FOR UPDATE
  USING (true) WITH CHECK (true);