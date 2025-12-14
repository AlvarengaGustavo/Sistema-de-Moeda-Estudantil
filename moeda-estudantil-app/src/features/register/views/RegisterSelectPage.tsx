import { Typography } from "@mui/material";
import {
  Card,
  Container,
  OptionButton,
  OptionsWrapper,
  Title,
  BackButton,
} from "./styles/RegisterSelectPage.styled";
import { useNavigate } from "react-router-dom";
import { REGISTER_SELECT_PAGE_TEXTS } from "../utils/constants";

const RegisterSelectPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Card elevation={6}>
        <Title variant="h5" fontWeight={700} gutterBottom>
          {REGISTER_SELECT_PAGE_TEXTS.title}
        </Title>

        <Typography variant="body2" color="text.secondary" mb={3}>
          {REGISTER_SELECT_PAGE_TEXTS.subtitle}
        </Typography>

        <OptionsWrapper>
          <OptionButton
            variant="contained"
            onClick={() => navigate("/registro/aluno")}
            fullWidth
          >
            {REGISTER_SELECT_PAGE_TEXTS.studentButton}
          </OptionButton>

          <OptionButton
            variant="contained"
            onClick={() => navigate("/registro/empresa")}
            fullWidth
          >
            {REGISTER_SELECT_PAGE_TEXTS.companyButton}
          </OptionButton>

          <BackButton
            variant="outlined"
            onClick={() => navigate("/login")}
            fullWidth
          >
            {REGISTER_SELECT_PAGE_TEXTS.backButton}
          </BackButton>
        </OptionsWrapper>
      </Card>
    </Container>
  );
};

export default RegisterSelectPage;
