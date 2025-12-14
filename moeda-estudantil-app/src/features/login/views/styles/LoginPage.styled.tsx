import { Box, Button, Paper, styled } from "@mui/material";

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
  maxWidth: 460,
  borderRadius: 20,
  padding: "3rem 2.5rem",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const LogoArea = styled(Box)({
  width: "100%",
  marginBottom: "1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const Logo = styled("img")({
  maxHeight: 120,
});

export const Form = styled("form")({
  width: "100%",
  marginTop: "0.5rem",
});

export const SubmitButton = styled(Button)({
  marginTop: "1.5rem",
  padding: "0.75rem 0",
  fontWeight: 700,
});
