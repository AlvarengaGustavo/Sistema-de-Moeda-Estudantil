# Sistema de Moeda Estudantil

Este repositório contém a implementação e documentação do **Sistema de Moeda Estudantil**, desenvolvido como parte das atividades da disciplina de **Laboratório de Engenharia de Software**.

O sistema tem como objetivo **reconhecer o mérito acadêmico dos alunos** por meio de uma moeda digital distribuída pelos professores.
Com essas moedas, os estudantes podem resgatar **vantagens** em empresas parceiras.

---

## 👥 Integrantes do Grupo

- **André Leôncio Jales**
- **Gustavo Alvarenga Ribeiro Carvalho**
- **Gustavo Pereira Felix**

---

## 📌 Objetivo do Trabalho

O projeto foi elaborado em etapas (sprints), contemplando desde a análise de requisitos até a implementação de protótipos funcionais.

As entregas incluem:

- Modelagem UML (Casos de Uso, Classes, Componentes, Modelo ER).
- Definição de Histórias de Usuário.
- Implementação de protótipo do sistema.
- Apresentação comparativa entre requisitos e solução desenvolvida.

---

## 📂 Estrutura de Documentação

- [`Histórias-de-Usuário.md`](./Histórias-de-Usuário.md): backlog de user stories.
- Diagramas UML.
- Código-fonte do protótipo.

---

## 📊 Diagramas

### Diagrama de Casos de Uso

<img width="776" height="1096" alt="image" src="https://github.com/user-attachments/assets/4e7b1e04-1492-487a-8174-f24c15e5d949" />

---

### Diagrama de Classes

<img width="1727" height="1014" alt="image" src="https://github.com/user-attachments/assets/78d73ce7-c55d-4958-87aa-4b7d6e1ce2e5" />

---

### Diagrama de Componentes

<img width="2203" height="1127" alt="image" src="https://github.com/user-attachments/assets/ccd9852e-626c-45a8-82a6-a036a2a45f45" />

---

### Modelo ER

<img width="640" height="894" alt="image" src="https://github.com/user-attachments/assets/f251f6bb-dada-4fd1-b336-e906d50a4b1c" />

---

### Diagramas de Sequência

![WhatsApp Image 2025-11-06 at 16 44 05(1)](https://github.com/user-attachments/assets/d9b2a965-d27a-4e91-b140-f834ddae21aa)

![WhatsApp Image 2025-11-06 at 16 44 05](https://github.com/user-attachments/assets/f7aebe73-27c0-408b-91b8-fa56455cb3cc)

---

## Execução

### Backend (API - NestJS + Prisma)

- Pré-requisitos: Node.js 20+, Docker, Docker Compose.
- Configure `.env` em `moeda-estudantil-api` (DATABASE_URL, JWT_SECRET, SMTP, etc.).

Passos para rodar localmente:

1. Subir banco via Docker Compose:

```bash
cd moeda-estudantil-api
docker compose -f compose.yml up -d
```

2. Instalar deps e preparar Prisma:

```bash
npm install
npx prisma migrate dev
npx prisma generate
```

3. Iniciar a API em dev:

```bash
npm run start:dev
```

Healthcheck: http://localhost:3000/api/health

### Frontend (Vite + React)

- Pré-requisitos: Node.js 20+.
- Configure `VITE_API_URL` no `.env.local` do app para apontar para a API.

Rodar localmente:

```bash
cd moeda-estudantil-app
npm install
npm run dev
```

App em: http://localhost:5173

## Endpoints

Base: http://localhost:3000

- GET /health — status da aplicação

Auth (/auth):

- POST /auth/login — login e emissão de JWT
- GET /auth/me — dados do usuário autenticado
- POST /auth/update — atualiza perfil autenticado

Users (/users):

- POST /users/student — criar estudante
- PUT /users/student/:id — atualizar estudante
- GET /users/student — listar estudantes
- GET /users/student/:id — detalhar estudante
- POST /users/company — criar empresa
- GET /users/company — listar empresas
- GET /users/company/:id — detalhar empresa
- PUT /users/company/:id — atualizar empresa

Teachers (/teachers):

- POST /teachers — criar professor
- GET /teachers — listar professores
- GET /teachers/:id — detalhar professor
- PUT /teachers/:id — atualizar professor

Institutions (/institutions):

- GET /institutions — listar instituições
- GET /institutions/:id — detalhar instituição
- POST /institutions — criar instituição
- PUT /institutions/:id — atualizar instituição

Rewards (/rewards):

- POST /rewards/donate — doar moedas
- GET /rewards/transactions — listar transações
- POST /rewards/redeem — resgatar recompensa
- GET /rewards — listar recompensas
- GET /rewards/institution-students — listar estudantes da instituição

Company Rewards (/company/rewards):

- POST /company/rewards — criar recompensa da empresa
- PATCH /company/rewards/:id — atualizar recompensa da empresa
- GET /company/rewards — listar recompensas da empresa

## Cotas semestrais

- A cada semestre, 1000 moedas são adicionadas ao saldo do professor
- Créditos acumulam entre semestres (se não gastar, soma na próxima)
- Atribuição automática ocorre ao listar professores, enviar moedas e consultar extrato

## Notificações por email

Implementadas no módulo `email` da API (`moeda-estudantil-api/src/email`). O envio usa um provedor SMTP configurável por variáveis de ambiente. Templates residem em `moeda-estudantil-api/src/email/templates` e são renderizados conforme o evento (ex.: aprovação de empresa, confirmação de cadastro, resgate de recompensa). Serviços de domínio (como `company-rewards.service.ts`) disparam emails assíncronos após operações de negócio.

## Publicação

- Frontend: publicado na Vercel.
- Backend (API) e Banco: executam em contêineres Docker dentro de uma VM.
- Automação: a Action do GitHub realiza build, migrações Prisma e deploy.

Aplicação publicada: https://moedas.andrejales.com.br

Login administrador (produção):

- Email: admin@email.com
- Senha: 123456

---
