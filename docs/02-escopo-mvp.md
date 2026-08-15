# 02 — Escopo do MVP

## Dentro do MVP

| Item | Situação |
| --- | --- |
| Mapa com as 11 UPAs 24h de Salvador e pin com ocupação | Implementado |
| Ocupação quantitativa (`atual / capacidade`) + percentual + nível | Implementado |
| Tratamento de superlotação (acima de 100%) | Implementado |
| Bottom sheet com resumo da unidade | Implementado |
| Tela de detalhes (serviços, contato, CEP, histórico 12h) | Implementado |
| Rota no Google Maps a partir da posição do usuário | Implementado |
| Compartilhar localização da unidade | Implementado |
| Sugestão de "opção mais adequada agora" | Implementado |
| Busca por nome, bairro e serviço + filtro por necessidade | Implementado |
| Filtros (aberta, baixa ocupação, serviços, ordenação) | Implementado |
| Campanhas/eventos com datas, unidades e status | Implementado |
| Avaliação do atendimento (nota, tempo real, comentário) | Implementado |
| Modo emergência (SAMU 192, Bombeiros 193, rota imediata) | Implementado |
| Painel do gestor com login simples de demonstração | Implementado |
| Avisos de dados simulados e de não-recomendação médica | Implementado |

## Fora do MVP (justificativa)

| Item | Por que ficou fora |
| --- | --- |
| Integração com sistemas oficiais (SUS / SMS Salvador) | Depende de convênio e acesso a APIs não públicas |
| Autenticação real de gestores com perfis e auditoria | Exige backend e política de identidade; o protótipo usa login de demonstração |
| Persistência em banco de dados | O MVP roda com estado em memória para viabilizar a demonstração |
| Notificações push | Requer app nativo/registro de dispositivos |
| Triagem clínica ou classificação de risco | Fora do escopo legal e ético de um protótipo acadêmico |
| Rotas com trânsito em tempo real dentro do app | Delegado ao Google Maps / Uber |
| App nativo publicado nas lojas | O MVP é web responsivo, instalável como atalho |

## Critério de conclusão do MVP

O MVP é considerado concluído quando o cidadão consegue, sem treinamento prévio:
abrir o app, identificar a unidade mais adequada, ver ocupação quantitativa,
abrir a rota e registrar uma avaliação; e o gestor consegue atualizar a ocupação
de uma unidade e publicar uma campanha.
