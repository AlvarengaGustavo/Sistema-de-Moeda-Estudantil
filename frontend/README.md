# Sistema de Moeda Estudantil - Frontend

Este projeto é o frontend React para o Sistema de Moeda Estudantil.

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o frontend:

```bash
npm start
```

Acesse em http://localhost:3000

## Comunicação com o backend

O frontend está configurado para consumir a API REST do backend em http://localhost:8080/api.

Certifique-se de que o backend Spring Boot esteja rodando antes de usar o frontend.

## Funcionalidades

- CRUD completo para Alunos e Empresas Parceiras
- Navegação entre páginas
- Feedback visual e notificações
- Interface responsiva com Material-UI

## Estrutura

- `/components`: Componentes reutilizáveis
- `/pages`: Páginas principais
- `/services`: Comunicação com a API

## Dependências principais
- React
- Material-UI
- Axios
- React Router DOM
- React Toastify
