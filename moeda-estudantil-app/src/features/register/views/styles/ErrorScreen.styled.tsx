import { Card, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CardBox = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  maxWidth: 500,
  margin: "auto",
  borderRadius: 16,
}));

export const IconWrapper = styled("div")<{ error?: boolean }>(({ error }) => ({
  width: 110,
  height: 110,
  borderRadius: "50%",
  margin: "0 auto 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: error ? "#ffebee" : "#eee",
  color: error ? "#d32f2f" : "#555",
  fontSize: 70,
}));

export const Title = styled(Typography)<{ error?: boolean }>(({ error }) => ({
  fontWeight: 700,
  marginBottom: 8,
  color: error ? "#d32f2f" : "inherit",
}));

export const Message = styled("p")(({ theme }) => ({
  color: "#555",
  margin: `0 0 ${theme.spacing(3)} 0`,
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.4),
  fontSize: "1rem",
  borderRadius: 12,
}));
