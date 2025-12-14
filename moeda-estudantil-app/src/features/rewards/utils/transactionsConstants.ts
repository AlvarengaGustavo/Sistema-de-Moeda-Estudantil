export const TRANSACTIONS_PAGE_TEXT = {
  title: "Extrato",
  subtitle: "Visualize suas movimentações de moedas.",
  columns: {
    description: "Descrição",
    student: "Aluno",
    teacher: "Professor",
    type: "Tipo",
    amount: "Valor",
    date: "Data",
  },
  empty: "Nenhuma transação encontrada.",
  error: "Não foi possível carregar o extrato. Tente novamente.",
};

export const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  DONATION: "Doação",
  RECHARGE: "Recarga",
  REWARD: "Resgate",
};
