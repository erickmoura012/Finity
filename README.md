# Finity

Sistema de gerenciamento de tarefas no estilo Kanban, feito com HTML, CSS e JavaScript puro.
Os dados ficam salvos no LocalStorage do navegador.

## Funcionalidades

- Criar, editar e excluir tarefas
- Mover as tarefas entre as colunas (A Fazer, Em andamento e Concluído) arrastando os cards
- Pesquisar por título ou descrição
- Filtrar por prioridade e por categoria
- Indicadores com o total de tarefas, pendentes, em andamento e concluídas
- Página "Meus projetos", com as tarefas agrupadas por categoria e o progresso de cada uma
- Criar novos projetos (categorias) e adicionar tarefas direto neles
- Lista com todas as tarefas e outra só com as concluídas
- Destaque em vermelho para tarefas atrasadas
- Layout responsivo (no celular o menu vira uma gaveta e o quadro rola para o lado)

## Como rodar

Basta abrir o `index.html` no navegador. Também dá pra usar a extensão **Live Server** do VS Code.

Na primeira vez que o sistema abre, ele cria algumas tarefas de exemplo. Para começar do zero,
é só abrir o DevTools (F12) > Application > Local Storage e apagar as chaves `finity_tarefas`
e `finity_categorias`.

## Estrutura de pastas

```
Finity/
├── index.html
├── css/
│   └── style/
│       ├── base.css          variáveis de cores, reset, botões, campos e tags
│       ├── layout.css        menu lateral, topo, filtros e páginas
│       ├── componentes.css   indicadores, quadro, cards, tabela, projetos, modal e toast
│       └── responsivo.css    ajustes para tablet e celular
└── js/
    └── script/
        ├── utils.js          funções de ajuda (datas, porcentagem, escapar HTML)
        ├── tarefas.js        status, prioridades, categorias, filtros e validação
        ├── api.js            salvar e buscar os dados (hoje usa o LocalStorage)
        ├── interface.js      funções que montam o HTML na tela
        └── app.js            eventos, navegação, modais e drag and drop
```

## Formato de uma tarefa

```json
{
  "id": "1759600000000123",
  "titulo": "Configurar servidor com Express",
  "descricao": "Criar as primeiras rotas da API",
  "prioridade": "media",
  "categoria": "Desenvolvimento",
  "dataLimite": "2026-10-11",
  "status": "a_fazer",
  "dataCriacao": "2026-10-04T15:30:00.000Z"
}
```

- `prioridade`: `alta`, `media` ou `baixa`
- `status`: `a_fazer`, `em_andamento` ou `concluido`

## Próximos passos

A ideia é transformar o projeto em full stack:

- [ ] Backend com Node.js e Express
- [ ] API REST
- [ ] Banco de dados PostgreSQL
- [ ] Cadastro e login de usuários

Toda a parte de dados está no `js/script/api.js` (`listarTarefas`, `criarTarefa`,
`atualizarTarefa` e `excluirTarefa`). Essas funções já são `async`, então quando a API existir é só
trocar o LocalStorage por `fetch` dentro delas, sem mexer no resto do código.

Rotas que pretendo criar:

| Método | Rota               | O que faz                 |
| ------ | ------------------ | ------------------------- |
| GET    | /api/tarefas       | Lista as tarefas          |
| POST   | /api/tarefas       | Cria uma tarefa           |
| PUT    | /api/tarefas/:id   | Edita uma tarefa          |
| DELETE | /api/tarefas/:id   | Exclui uma tarefa         |
| GET    | /api/categorias    | Lista os projetos         |
| POST   | /api/categorias    | Cria um projeto           |
| POST   | /api/auth/login    | Login do usuário          |
| POST   | /api/auth/cadastro | Cadastro de novo usuário  |
