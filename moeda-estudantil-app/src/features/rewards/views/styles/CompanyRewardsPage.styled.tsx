import { styled } from "@mui/material/styles";
import { Box, Paper, Grid, TextField, Card, CardContent } from "@mui/material";

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

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
}));

export const CardsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const RewardCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));

export const RewardCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));
