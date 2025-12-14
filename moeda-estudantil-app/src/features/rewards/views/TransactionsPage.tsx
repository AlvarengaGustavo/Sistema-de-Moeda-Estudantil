import type { FC } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Container,
  HeaderWrapper,
  StyledTableContainer,
  StyledTableHead,
  TableWrapper,
} from "./styles/TransactionsPage.styled";
import { useLoadTransactions } from "../hooks/useLoadTransactions";
import {
  TRANSACTION_TYPE_LABEL,
  TRANSACTIONS_PAGE_TEXT,
} from "../utils/transactionsConstants";
import { useLoginSlice } from "../../login/hooks/useLoginSlice";
import type { TUserRole } from "../../login/types/TUserRole";

const formatDate = (date: string) =>
  new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getChipColor = (type: string) => {
  switch (type) {
    case "DONATION":
      return "primary";
    case "RECHARGE":
      return "success";
    case "REWARD":
      return "warning";
    default:
      return "default";
  }
};

const isCredit = (type: string, role?: TUserRole) => {
  switch (type) {
    case "DONATION":
      return role === "STUDENT";
    case "RECHARGE":
      return true;
    case "REWARD":
      return false;
    default:
      return false;
  }
};

const TransactionsPage: FC = () => {
  const { data, isLoading, error, refetch } = useLoadTransactions();
  const { authenticatedUser } = useLoginSlice();
  const role = authenticatedUser?.role;
  const items = data?.transactions ?? [];
  const balance = data?.balance;

  return (
    <Container>
      <HeaderWrapper>
        <Typography variant="h5" fontWeight={700}>
          {TRANSACTIONS_PAGE_TEXT.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {TRANSACTIONS_PAGE_TEXT.subtitle}
        </Typography>

        {role !== "COMPANY" && data?.balance && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderColor: "divider",
            }}
          >
            <Stack>
              <Typography variant="subtitle2" color="text.secondary">
                Saldo disponível
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {`${balance} moedas`}
              </Typography>
            </Stack>
            <Chip
              label={role === "TEACHER" ? "Professor" : "Aluno"}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        )}
      </HeaderWrapper>

      <TableWrapper elevation={2}>
        {isLoading && (
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 2,
            }}
          >
            <CircularProgress size={20} /> Carregando...
          </Typography>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mx: 1, my: 1 }}
            action={
              <Typography
                component="button"
                onClick={() => refetch()}
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Tentar novamente
              </Typography>
            }
          >
            {TRANSACTIONS_PAGE_TEXT.error}
          </Alert>
        )}

        {!isLoading && items.length === 0 && !error && (
          <Typography sx={{ p: 2 }}>{TRANSACTIONS_PAGE_TEXT.empty}</Typography>
        )}

        {items.length > 0 && (
          <StyledTableContainer>
            <Table stickyHeader>
              <StyledTableHead>
                <TableRow>
                  <TableCell>
                    {TRANSACTIONS_PAGE_TEXT.columns.description}
                  </TableCell>
                  <TableCell>
                    {role === "TEACHER"
                      ? TRANSACTIONS_PAGE_TEXT.columns.student
                      : TRANSACTIONS_PAGE_TEXT.columns.teacher}
                  </TableCell>
                  <TableCell>{TRANSACTIONS_PAGE_TEXT.columns.type}</TableCell>
                  <TableCell>{TRANSACTIONS_PAGE_TEXT.columns.amount}</TableCell>
                  <TableCell>{TRANSACTIONS_PAGE_TEXT.columns.date}</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {items.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.description}</TableCell>
                    {role === "TEACHER" ? (
                      <TableCell>
                        {transaction.studentName ?? "-"}
                        {transaction.studentEmail && (
                          <Typography variant="body2" color="text.secondary">
                            {transaction.studentEmail}
                          </Typography>
                        )}
                      </TableCell>
                    ) : (
                      <TableCell>
                        {transaction.teacherName ?? "-"}
                        {transaction.teacherEmail && (
                          <Typography variant="body2" color="text.secondary">
                            {transaction.teacherEmail}
                          </Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        label={
                          TRANSACTION_TYPE_LABEL[transaction.type] ??
                          transaction.type
                        }
                        color={getChipColor(transaction.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Chip
                          label={
                            isCredit(transaction.type, role)
                              ? "Entrada"
                              : "Saída"
                          }
                          color={
                            isCredit(transaction.type, role)
                              ? "success"
                              : "error"
                          }
                          size="small"
                          variant="outlined"
                        />
                        <Typography
                          component="span"
                          color={
                            isCredit(transaction.type, role)
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight={700}
                        >
                          {`${isCredit(transaction.type, role) ? "+" : "-"}${
                            transaction.amount
                          }`}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </TableWrapper>
    </Container>
  );
};

export default TransactionsPage;
