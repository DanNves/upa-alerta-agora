# 05 — Arquitetura

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | TanStack Start (React 19) com roteamento por arquivos |
| Build | Vite |
| Estilo | Tailwind CSS v4 com tokens semânticos em `src/styles.css` |
| Mapa | Leaflet + React-Leaflet, tiles CartoDB (sem chave de API) |
| Estado global | Zustand |
| Ícones | lucide-react |
| Notificações | sonner |

> O briefing original previa React Native + Expo com Supabase e Google Maps SDK.
> O protótipo foi construído como aplicação web responsiva para viabilizar a
> demonstração sem chaves de API pagas e sem backend, mantendo a mesma
> arquitetura de dados e as mesmas regras de negócio.

## Camadas

```text
Telas (src/routes)         -> apresentação e interação
Componentes (src/components) -> UI reutilizável (mapa, badge, sheets, nav)
Regras (src/data/regras.ts) -> limites, pesos, avisos, feature flags
Dados (src/data/upas.ts)    -> tipos, seed das unidades, funções utilitárias
Estado (src/data/store.ts)  -> store Zustand: unidades, eventos, filtros, ações
```

Fluxo: a tela lê o estado do store, o store guarda as entidades, e qualquer
cálculo de nível, percentual ou score passa obrigatoriamente por `regras.ts`.

## Estrutura de pastas

```text
src/
  components/
    BottomNav.tsx          navegação inferior (Mapa, Busca, Eventos)
    EmergencyModal.tsx     modo emergência
    FilterSheet.tsx        filtros e ordenação
    OcupacaoInfo.tsx       exibição quantitativa da ocupação
    StatusBadge.tsx        selo de nível de ocupação
    UPAMap.tsx             mapa Leaflet e pins customizados
    UpaBottomSheet.tsx     resumo da unidade selecionada
  data/
    regras.ts              regras de negócio centralizadas
    store.ts               estado global (Zustand)
    upas.ts                tipos, seed e utilitários
  routes/
    __root.tsx             layout raiz e metadados globais
    index.tsx              mapa (tela inicial)
    buscar.tsx             busca e comparação
    eventos.tsx            campanhas de saúde
    avaliar.tsx            avaliação do atendimento
    upa.$id.tsx            detalhes da unidade
    admin.tsx              painel do gestor (login simples)
  styles.css               tokens de design e animações
docs/                      documentação do TCC
```

## Decisões de arquitetura

1. **Regras centralizadas.** Mudar um limite de ocupação exige editar um único arquivo.
2. **Estado em memória.** Sem backend, o protótipo é autocontido e reproduzível.
3. **Mapa apenas no cliente.** Leaflet depende de `window`; o componente é carregado após a hidratação.
4. **Tokens semânticos.** Nenhuma cor fixa nos componentes, o que permite tema e ajustes globais.
5. **Área de gestão separada.** O painel fica fora da navegação principal do cidadão.
