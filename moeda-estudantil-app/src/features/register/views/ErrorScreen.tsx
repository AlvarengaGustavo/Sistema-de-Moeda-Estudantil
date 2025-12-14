import { Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import type { FC } from "react";

import {
  CardBox,
  IconWrapper,
  Message,
  Title,
  SubmitButton,
} from "./styles/ErrorScreen.styled";
import { FEEDBACK_SCREENS_TEXTS } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const ErrorScreen: FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <CardBox elevation={6}>
        <IconWrapper error>
          <ErrorOutlineIcon fontSize="inherit" />
        </IconWrapper>

        <Title variant="h5" error>
          {FEEDBACK_SCREENS_TEXTS.ERROR.TITLE}
        </Title>

        <Message>{FEEDBACK_SCREENS_TEXTS.ERROR.DESCRIPTION}</Message>

        <SubmitButton
          variant="contained"
          fullWidth
          onClick={() => navigate("/registro")}
        >
          {FEEDBACK_SCREENS_TEXTS.ERROR.BUTTON}
        </SubmitButton>
      </CardBox>
    </Container>
  );
};

export default ErrorScreen;
