import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
}));
