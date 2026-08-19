# 10 — Limitações e evolução

## Limitações conhecidas

1. **Dados simulados.** A ocupação não vem de sistema oficial; é semeada e variada pelo protótipo ou informada manualmente no painel.
2. **Sem persistência.** O estado vive em memória; ao recarregar, os dados voltam ao valor inicial.
3. **Login de demonstração.** O acesso do gestor não representa autenticação real, não tem perfis, auditoria nem recuperação de senha.
4. **Distância em linha reta.** Não há tempo de deslocamento real, trânsito ou transporte público.
5. **Sem triagem clínica.** O app não classifica risco nem substitui avaliação profissional.
6. **Web responsivo.** Não há app nativo publicado, notificações push ou uso offline completo.
7. **Cobertura geográfica.** Apenas as UPAs 24h de Salvador/BA.
8. **Acessibilidade.** Foram observados contraste, rótulos e alvos de toque, mas não houve auditoria assistiva formal.

## Roteiro de evolução

### Curto prazo
- Persistência dos dados em banco, com histórico real de ocupação.
- Autenticação de gestores com perfis por unidade e registro de auditoria.
- Painel de indicadores: ocupação média por faixa horária e avaliação média por unidade.

### Médio prazo
- Integração com fontes oficiais da rede municipal de saúde.
- Tempo de deslocamento real por rota e por modal.
- Notificações de campanhas e de queda de lotação na unidade favorita.
- Expansão para outras cidades e para hospitais e unidades básicas.

### Longo prazo
- Aplicativo nativo com uso offline dos dados essenciais.
- Previsão de lotação por aprendizado de máquina sobre o histórico.
- Painel público de transparência para a gestão municipal.

## Observações da última rodada de consolidação

- Filtros, busca e ordenação passaram a ser resolvidos por uma camada única (`src/data/filtros.ts`), eliminando divergência entre mapa e busca.
- A ocupação informada pelo gestor tem prioridade sobre a simulação automática; a origem do dado é sempre exibida ao cidadão.
- Credenciais de demonstração deixaram de ser exibidas na interface do painel.
