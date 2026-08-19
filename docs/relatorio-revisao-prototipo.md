# Relatório da rodada de revisão e consolidação — UPA+

Documento de fechamento da rodada de correções do protótipo, para anexo ao TCC.

## Corrigido

| Item | Situação anterior | Correção aplicada |
| --- | --- | --- |
| Filtros sem efeito real | Cada tela filtrava por conta própria e algumas seleções não alteravam a lista | Criada a camada única `src/data/filtros.ts`; mapa e busca consomem `aplicarFiltros` |
| Ocupação apenas percentual | Algumas telas mostravam só o percentual | Toda exibição usa `atual / capacidade` + percentual (`OcupacaoInfo`) |
| Superlotação travada em 100% | O indicador saturava | Acima de 100% o nível é "Superlotada" e o percentual real é exibido |
| Simulação sobrescrevia o gestor | O valor informado no painel era substituído em segundos | A simulação ignora unidades com origem `manual` |
| Origem do dado invisível | O cidadão não sabia de onde vinha o número | Origem (Gestor / Simulado) e data/hora exibidas em mapa, busca e detalhes |
| Credenciais na interface | O painel exibia usuário e senha de demonstração | Texto removido da tela |
| Campanhas incompletas | Sem horário nem informações adicionais | Formulário com datas, horário e informações; validação de período |

## Mantido

- Stack TanStack Start + React + Tailwind com tokens semânticos em `src/styles.css`.
- Regras quantitativas centralizadas em `src/data/regras.ts`.
- Mapa Leaflet renderizado somente no cliente.
- Navegação principal com três abas (Mapa, Busca, Eventos); `/admin` e `/avaliar` fora da navegação.
- Avisos de dados simulados e de não-recomendação médica.

## Ajustado

- Ordenações disponíveis: sugestão (score 60% ocupação / 40% distância), proximidade, menor ocupação, menor tempo e melhor avaliação.
- Painel do gestor permite editar ocupação, capacidade máxima, tempo estimado, abertura e serviços.
- Seleção de unidades nas campanhas por nome e ID.
- Documentação de requisitos (RF24–RF32), regras (RN17–RN22) e testes (T25–T30) ampliada.

## Futuro (fora do MVP)

- Persistência em banco e histórico real de ocupação.
- Autenticação de gestores com perfis por unidade e auditoria.
- Integração com fontes oficiais da rede municipal.
- Tempo de deslocamento real por modal e notificações.

## Pendências conhecidas

- Estado em memória: recarregar a página restaura os dados iniciais.
- Login do gestor é de demonstração, sem perfis nem recuperação de senha.
- Sem auditoria formal de acessibilidade assistiva.
