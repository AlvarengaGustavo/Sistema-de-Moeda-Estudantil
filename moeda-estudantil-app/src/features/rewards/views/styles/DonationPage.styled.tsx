import { styled } from "@mui/material/styles";
import { Box, Paper, Typography, TextField } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  paddingBottom: "0.5rem",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const Title = styled(Typography)({
  fontWeight: 700,
});

export const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const ContentRow = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: theme.spacing(2),
  alignItems: "stretch",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const HelperCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
}));

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1.5),
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

