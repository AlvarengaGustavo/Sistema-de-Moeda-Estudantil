# Histórias de Usuário — Sistema de Moeda Estudantil (Markdown)

> Documento em **Markdown** contendo as User Stories (US) completas, coesas e prontas para uso no backlog. Cada história traz: **Como / Quero / Para**, **Critérios de Aceite (GIVEN/WHEN/THEN)**, **Pré / Pós**, **Notas técnicas / Casos de borda**, **Prioridade** e **Story Points (SP)**.

---

## Sumário

- [Epic: Onboarding &amp; Auth](#epic-onboarding--auth)
  - US01 — Cadastro do Aluno
  - US02 — Login / Autenticação
  - US03 — Pré-cadastro de Professores e Instituições (Admin)
- [Epic: Gestão de Moedas](#epic-gestão-de-moedas)
  - US04 — Crédito semestral automático para Professores
  - US05 — Enviar moedas (Professor → Aluno)
- [Epic: Transações &amp; Extrato](#epic-transações--extrato)
  - US06 — Visualizar Extrato (Aluno / Professor)
  - US07 — Histórico Detalhado e Auditoria
- [Epic: Vantagens &amp; Resgates](#epic-vantagens--resgates)
  - US08 — Cadastro de Empresa Parceira + Vantagens (CRUD)
  - US09 — Resgatar Vantagem (Aluno)
  - US10 — Conferência de Cupom pelo Parceiro
- [Epic: Notificações &amp; Emails](#epic-notificações--emails)
  - US11 — Email de Notificação ao Receber Moeda
  - US12 — Email de Cupom e Notificação ao Parceiro
- [Epic: Administração / Painel](#epic-administração--painel)
  - US13 — Painel Admin (Gestão de Instituições, Relatórios)
- [Confiabilidade / Segurança / Não-funcionais](#confiabilidade--segurança--não-funcionais)
  - US14 — Tratamento de Concorrência em Resgates/Envios
  - US15 — Privacidade e Proteção de Dados (CPF, RG)
  - US16 — Testes e Apresentação (requisitos da entrega)

---

# Epic: Onboarding & Auth

### US01 — Cadastro do Aluno

**Como** aluno interessado
**Quero** fazer cadastro com nome, email, CPF, RG, endereço, instituição (selecionar entre instituições pré-cadastradas) e curso
**Para que** eu possa participar do sistema de mérito e receber moedas.

**Critérios de aceite**

- GIVEN página de cadastro com campos obrigatóriosWHEN eu submeter dados válidos e email únicoTHEN cadastro é criado e recebo confirmação por email (link de ativação opcional).
- GIVEN CPF ou email já existente
  WHEN eu tentar cadastrar
  THEN o sistema rejeita e mostra mensagem adequada.

**Pré:** instituições pré-cadastradas.
**Pós:** usuário aluno criado com status (ativo/pendente).
**Notas técnicas / casos de borda:** validar CPF (algoritmo), validar email, criptografar senha (bcrypt/argon2), mascarar dados sensíveis em logs, checar duplicidade por CPF/email.
**Prioridade:** MUST — **5 SP**

---

### US02 — Login / Autenticação (Alunos / Professores / Empresas)

**Como** usuário (aluno, professor, empresa)
**Quero** logar com meu login e senha
**Para que** eu acesse funcionalidades restritas.

**Critérios de aceite**

- GIVEN credenciais corretasWHEN eu submeter login/senhaTHEN sou autenticado e recebo token de sessão (JWT ou server-side).
- GIVEN credenciais incorretas
  WHEN tentativa de login
  THEN erro genérico “credenciais inválidas” e contador de tentativas para bloqueio temporário.

**Notas:** senhas mínimas, hash seguro, recuperação de senha via email com token expirável, sessões expiram, 2FA opcional.
**Prioridade:** MUST — **3 SP**

---

### US03 — Pré-cadastro de Professores e Instituições (Admin)

**Como** administrador / instituição parceira
**Quero** enviar lista de professores (nome, CPF, departamento) para pré-cadastro
**Para que** professores já existam no sistema no momento da parceria.

**Critérios de aceite**

- GIVEN arquivo CSV/planilha válido ou UI de upload
  WHEN eu subir a lista
  THEN professores são criados, vinculados à instituição, e recebem email com instruções para ativar senha.

**Notas técnicas:** checar duplicidade por CPF, gerar senha provisória, logs do upload, retornar resumo de erros.
**Prioridade:** HIGH — **3 SP**

---

# Epic: Gestão de Moedas

### US04 — Crédito semestral automático para Professores

**Como** sistema (job agendado)
**Quero** creditar 1.000 moedas para cada professor no início de cada semestre e somar ao saldo existente
**Para que** professores tenham saldo acumulável.

**Critérios de aceite**

- GIVEN início do semestre (data agendada)
  WHEN o job CRON rodar
  THEN 1.000 moedas são creditadas no saldo de cada professor e transação registrada (idempotente por semestre).

**Notas técnicas:** marcar semestre como creditado, transação tipo `CREDITO_SEMESTRE`, job idempotente, possibilidade de reprocessamento seguro.
**Prioridade:** MUST — **5 SP**

---

### US05 — Enviar moedas (Professor → Aluno)

**Como** professor
**Quero** enviar X moedas a um aluno indicando o motivo (mensagem aberta obrigatória)
**Para que** eu reconheça méritos do aluno.

**Critérios de aceite**

- GIVEN saldo do professor >= XWHEN enviar moedas com motivo preenchidoTHEN débito do saldo do professor, crédito do saldo do aluno, geração de transação com motivo, e envio de email ao aluno notificando o recebimento.
- GIVEN saldo insuficiente
  WHEN tentativa de envio
  THEN operação rejeitada com mensagem “saldo insuficiente”.

**Pré:** professor autenticado; aluno selecionado.
**Notas técnicas / casos de borda:** operação ACID com lock (optimista/pessimista), registrar justificativa, Idempotency-Key para prevenir duplicação, log com idTx, tratar envios concorrentes.
**Prioridade:** MUST — **5 SP**

---

# Epic: Transações & Extrato

### US06 — Visualizar Extrato (Aluno / Professor)

**Como** usuário (aluno ou professor)
**Quero** consultar meu extrato com saldo atual e lista de transações (filtrável)
**Para que** eu acompanhe entradas/saídas.

**Critérios de aceite**

- GIVEN usuário autenticado
  WHEN acessar “Extrato”
  THEN ver saldo atual e listagem paginada de transações (data, tipo, valor, contraparte, motivo/código) e poder filtrar por período/tipo.

**Notas:** export CSV/PDF futura, paginação, ordenação.
**Prioridade:** MUST — **3 SP**

---

### US07 — Histórico Detalhado e Auditoria

**Como** auditor / suporte
**Quero** ver histórico detalhado de transação (logs, IP, operador, reversões)
**Para que** eu possa investigar problemas.

**Critérios:** cada transação tem identificador único, status e histórico de alterações; logs imutáveis e rastreáveis.
**Notas:** retenção legal, mascaramento de dados em UI de suporte.
**Prioridade:** MED — **2 SP**

---

# Epic: Vantagens & Resgates

### US08 — Cadastro de Empresa Parceira + Vantagens (CRUD)

**Como** empresa parceira
**Quero** cadastrar a empresa e cadastrar vantagens com descrição, foto e custo em moedas
**Para que** alunos possam resgatar essas vantagens.

**Critérios de aceite**

- GIVEN dados válidos
  WHEN cadastro submetido
  THEN empresa criada e pode cadastrar vantagens (nome, descrição, custo >0, foto).

**Notas:** validação de imagens (tamanho/resolução), status ativa/inativa para vantagem.
**Prioridade:** MUST — **4 SP**

---

### US09 — Resgatar Vantagem (Aluno)

**Como** aluno
**Quero** selecionar uma vantagem e resgatá-la pagando em moedas
**Para que** eu obtenha o cupom para uso presencial.

**Critérios de aceite**

- GIVEN aluno autenticado e saldo >= custoWHEN confirmar resgateTHEN débito do saldo do aluno, geração de cupom com código único, envio de email ao aluno com cupom e envio de email ao parceiro com o mesmo código.
- GIVEN saldo insuficiente
  WHEN tentar resgatar
  THEN operação rejeitada com mensagem “saldo insuficiente”.

**Notas técnicas / casos de borda:** idempotência (Idempotency-Key), código alfanumérico único (12–16 chars), validade do cupom, cupom consumível apenas uma vez, registrar status `GERADO` → `USADO` → `ESTORNADO`.
**Prioridade:** MUST — **5 SP**

---

### US10 — Conferência de Cupom pelo Parceiro

**Como** atendente do parceiro
**Quero** verificar e marcar cupom como utilizado (informar local/atendente)
**Para que** eu confirme o resgate presencial e evite reuso de cupom.

**Critérios:** parceiro autentica, busca por código do cupom e confirma uso; cupom marcado como consumido e grava quem validou e quando.
**Notas:** possibilidade de estorno manual via suporte; checar validade/duplicidade.
**Prioridade:** HIGH — **2 SP**

---

# Epic: Notificações & Emails

### US11 — Email de Notificação ao Receber Moeda

**Como** aluno
**Quero** receber email quando receber moedas
**Para que** eu saiba por quem e por qual motivo recebi reconhecimento.

**Critérios:** email inclui remetente (professor), quantidade, motivo, data e saldo atual.
**Prioridade:** MUST — **1 SP**

---

### US12 — Email de Cupom e Notificação ao Parceiro (quando resgatar)

**Como** sistema
**Quero** enviar cupom ao aluno e notificar o parceiro com um código gerado pelo sistema ao resgatar
**Para que** haja conferência presencial.

**Critérios:** ambos os emails contêm código seguro e dados da transação; logs registram envio/falha e retry configurado.
**Notas técnicas:** fila para envio (Rabbit/Kafka), retry/backoff em falhas, DLQ para erros persistentes.
**Prioridade:** MUST — **2 SP**

---

# Epic: Administração / Painel

### US13 — Painel Admin (Gestão de Instituições, Relatórios)

**Como** administrador do sistema
**Quero** gerenciar instituições, ver relatórios de uso (moedas emitidas, resgates por parceiro)
**Para que** eu acompanhe adoção e performance.

**Critérios:** filtros por período, export CSV, ranking de alunos/professores por moedas e uso de parceiros.
**Notas:** controle de permissões/roles, logs de auditoria.
**Prioridade:** MED — **3 SP**

---

# Confiabilidade / Segurança / Não-funcionais

### US14 — Tratamento de Concorrência em Resgates/Envios

**Como** engenheiro
**Quero** evitar condições de corrida (double-spend) quando operações tentam debitar o mesmo saldo
**Para que** não ocorram débitos negativos ou resgates duplicados.

**Critérios:** operações financeiras dentro de transação ACID; lock otimista + retry; testes de carga para garantir comportamento.
**Prioridade:** MUST — **3 SP**

---

### US15 — Privacidade e Proteção de Dados (CPF, RG)

**Como** responsável legal
**Quero** que CPF/RG sejam armazenados de forma segura e apenas exibidos parcialmente quando necessário
**Para que** atendamos requisitos de privacidade.

**Critérios:** criptografia em repouso para dados sensíveis; mascaramento na UI; logs sem dados completos.
**Prioridade:** MUST — **2 SP**

---

### US16 — Testes e Apresentação (requisitos da entrega)

**Como** time de desenvolvimento / alunos
**Quero** ter protótipo, documentação e slides comparando com especificação
**Para que** possamos apresentar e demonstrar conformidade com o Lab.

**Critérios:** protótipo funcional, repositório com UML, código, documentação de decisões arquiteturais e roteiro de apresentação (~20 min).
**Prioridade:** MUST — **2 SP**

---

# Exemplo (Gherkin) — US05 (Enviar moedas)

```gherkin
Cenário: Professor envia moedas com saldo suficiente
  Dado que o professor P está autenticado e tem saldo 1500
  E o aluno A existe e está ativo
  Quando o professor P envia 100 moedas para A com motivo "participação"
  Então o saldo do professor deve ser 1400
  E o saldo do aluno A deve aumentar em 100
  E deve existir uma transação com motivo "participação"
  E o aluno A recebe email de notificação
```
