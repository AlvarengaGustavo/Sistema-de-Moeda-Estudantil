import { Box, Button, Paper, styled, Typography } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  background: theme.palette.background.default,
}));

export const Card = styled(Paper)({
  width: "100%",
  maxWidth: 420,
  borderRadius: 20,
  padding: "3rem 2rem",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
});

export const Title = styled(Typography)({
  marginBottom: "0.5rem",
});

export const OptionsWrapper = styled(Box)({
  marginTop: "2rem",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const OptionButton = styled(Button)({
  padding: "0.75rem 0",
  fontWeight: 700,
  fontSize: "1rem",
});

export const BackButton = styled(Button)(({ theme }) => ({
  padding: "0.75rem 0",
  fontWeight: 700,
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  borderColor: "#ccc",
}));
