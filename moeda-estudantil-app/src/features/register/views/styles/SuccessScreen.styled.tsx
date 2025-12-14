import { Card, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CardBox = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  maxWidth: 500,
  margin: "auto",
  borderRadius: 16,
}));

export const IconWrapper = styled("div")<{ success?: boolean }>(
  ({ success }) => ({
    width: 110,
    height: 110,
    borderRadius: "50%",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: success ? "#e8f5e9" : "#eee",
    color: success ? "#43a047" : "#555",
    fontSize: 70,
  })
);

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

export const Message = styled("p")(({ theme }) => ({
  color: "#555",
  margin: `${theme.spacing(0)} 0 ${theme.spacing(3)}`,
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.4),
  fontSize: "1rem",
  borderRadius: 12,
}));
