# Documentação — UPA+

Protótipo funcional (MVP) desenvolvido como parte de Trabalho de Conclusão de Curso.
Objetivo: reduzir o tempo de decisão do cidadão na escolha de uma Unidade de Pronto
Atendimento (UPA) em Salvador/BA, exibindo ocupação, capacidade, tempo estimado,
distância, serviços e campanhas de saúde.

> **Aviso importante:** todos os dados de ocupação exibidos no protótipo são
> **simulados**, para fins acadêmicos e de demonstração. O aplicativo **não**
> substitui orientação médica nem os canais oficiais de emergência (SAMU 192).

## Índice

| Documento | Conteúdo |
| --- | --- |
| [01-visao-geral.md](./01-visao-geral.md) | Problema, justificativa, objetivos, público-alvo |
| [02-escopo-mvp.md](./02-escopo-mvp.md) | O que está no MVP, o que ficou fora e por quê |
| [03-requisitos.md](./03-requisitos.md) | Requisitos funcionais e não funcionais |
| [04-regras-de-negocio.md](./04-regras-de-negocio.md) | Regras RN01+ e onde estão no código |
| [05-arquitetura.md](./05-arquitetura.md) | Stack, camadas, estrutura de pastas |
| [06-modelo-de-dados.md](./06-modelo-de-dados.md) | Entidades, campos e tipos |
| [07-telas-e-fluxos.md](./07-telas-e-fluxos.md) | Telas, navegação e fluxos de uso |
| [08-algoritmo-recomendacao.md](./08-algoritmo-recomendacao.md) | Score, pesos, limitações |
| [09-testes.md](./09-testes.md) | Roteiro de testes manuais e critérios de aceite |
| [10-limitacoes-e-futuro.md](./10-limitacoes-e-futuro.md) | Limitações conhecidas e evolução |
| [11-glossario.md](./11-glossario.md) | Termos usados no projeto |

## Como executar

```bash
bun install
bun run dev
```

A aplicação sobe em `http://localhost:8080`.
