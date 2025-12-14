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
  maxWidth: 800,
  borderRadius: 20,
  padding: "3rem 2.5rem",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
});

export const Title = styled(Typography)({
  marginBottom: "0.5rem",
});

export const Form = styled("form")({
  width: "100%",
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const SubmitButton = styled(Button)({
  marginTop: "1rem",
  padding: "0.75rem 0",
  fontWeight: 700,
});

export const BackButton = styled(Button)(({ theme }) => ({
  marginTop: "0.5rem",
  padding: "0.75rem 0",
  fontWeight: 700,
  color: theme.palette.text.secondary,
  borderColor: "#ccc",
}));
