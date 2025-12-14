import { Container } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { FC } from "react";

import {
  CardBox,
  IconWrapper,
  Message,
  Title,
  SubmitButton,
} from "./styles/SuccessScreen.styled";
import { FEEDBACK_SCREENS_TEXTS } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const SuccessScreen: FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <CardBox elevation={6}>
        <IconWrapper success>
          <CheckCircleIcon fontSize="inherit" />
        </IconWrapper>

        <Title variant="h5">{FEEDBACK_SCREENS_TEXTS.SUCCESS.TITLE}</Title>

        <Message>{FEEDBACK_SCREENS_TEXTS.SUCCESS.DESCRIPTION}</Message>

        <SubmitButton
          variant="contained"
          fullWidth
          onClick={() => navigate("/login")}
        >
          {FEEDBACK_SCREENS_TEXTS.SUCCESS.BUTTON}
        </SubmitButton>
      </CardBox>
    </Container>
  );
};

export default SuccessScreen;
