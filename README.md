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

## Execução

Back-end (Spring Boot): porta 8080

- H2 Console: `/h2-console` (habilitado por padrão)
- JPA: `ddl-auto=update`

Front-end (React): porta 3000

## Endpoints (Release 2 - Lab04S01)

- Professores

  - GET `/api/professores` — lista professores (com saldo atualizado por cota semestral)
  - POST `/api/professores/{professorId}/enviar-moedas` — body `{ alunoId, valor, motivo }`
  - GET `/api/professores/{professorId}/extrato` — saldo + transações de envio

- Alunos
  - GET `/api/alunos` — já existente (paginação)
  - GET `/api/extratos/alunos/{alunoId}` — saldo + transações de recebimento/troca

## Modelo de dados (novidades)

- Instituição (`instituicoes`): professores e alunos referenciam uma instituição via chave estrangeira
- Professor: possui saldo acumulável por semestre (cota de 1000 moedas/semestre)
- Transação: registra ENVIO (professor -> aluno) e futuramente TROCA

## Cotas semestrais

- A cada semestre, 1000 moedas são adicionadas ao saldo do professor
- Créditos acumulam entre semestres (se não gastar, soma na próxima)
- Atribuição automática ocorre ao listar professores, enviar moedas e consultar extrato

## Notificações por email

- Ao receber moedas, o aluno é notificado
- Ambiente de desenvolvimento: envio de email simulado no console (sem SMTP)

---
