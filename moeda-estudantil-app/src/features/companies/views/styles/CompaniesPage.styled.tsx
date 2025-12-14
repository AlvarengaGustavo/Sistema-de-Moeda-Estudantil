import { styled } from "@mui/material/styles";
import {
  Box,
  Paper,
  TableContainer,
  TableHead,
  TextField,
} from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  backgroundColor: theme.palette.background.default,
  height: "100vh",
}));

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  paddingBottom: "1rem",
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
}));

export const HeaderTop = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const HeaderBottom = styled(Box)({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
});

export const SearchField = styled(TextField)(({ theme }) => ({
  width: 320,
  backgroundColor: theme.palette.background.paper,
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
