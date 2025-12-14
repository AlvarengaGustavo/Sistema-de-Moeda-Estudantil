import { styled } from "@mui/material/styles";
import { Box, Paper, TableContainer, TableHead } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  backgroundColor: theme.palette.background.default,
  height: "100vh",
}));

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  paddingBottom: "0.5rem",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const TableWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: 12,
  flex: 1,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}));

export const StyledTableContainer = styled(TableContainer)({
  flex: 1,
  overflow: "auto",
});

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  ["& .MuiTableCell-head"]: {
    backgroundColor: theme.palette.background.paper,
  },
}));
