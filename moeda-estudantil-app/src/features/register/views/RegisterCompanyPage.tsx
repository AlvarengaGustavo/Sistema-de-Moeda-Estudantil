import { useState, type FC } from "react";
import { Typography, TextField, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Container,
  Form,
  SubmitButton,
  Title,
  BackButton,
} from "./styles/RegisterCompanyPage.styled";

import { REGISTER_COMPANY_PAGE_TEXTS } from "../utils/constants";
import { useCreateCompany } from "../hooks/useCreateCompany";
import {
  isValidEmail,
  isValidCnpj,
  formatCnpj,
} from "../../../shared/utils/helperFunctions";
import SuccessScreen from "./SuccessScreen";
import ErrorScreen from "./ErrorScreen";

const RegisterCompanyPage: FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: createCompany, isPending } = useCreateCompany();

  const [status, setStatus] = useState<"form" | "success" | "error">("form");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cnpj: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    let message = "";

    switch (field) {
      case "name":
        if (!value.trim()) message = "Nome é obrigatório.";
        break;

      case "email":
        if (!value.trim()) message = "Email é obrigatório.";
        else if (!isValidEmail(value)) message = "Email inválido.";
        break;

      case "password":
        if (value.length < 6)
          message = "A senha deve ter pelo menos 6 caracteres.";
        break;

      case "cnpj":
        if (!value) message = "CNPJ é obrigatório.";
        else if (!isValidCnpj(value)) message = "CNPJ inválido.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "cnpj") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, cnpj: onlyNumbers }));
      validateField("cnpj", onlyNumbers);
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Object.entries(form).forEach(([k, v]) => validateField(k, v));

    const hasErrors = Object.values(errors).some((e) => e);
    const hasEmpty = Object.values(form).some((v) => !v);

    if (hasErrors || hasEmpty) return;

    try {
      await createCompany(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Container>
        <SuccessScreen />
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container>
        <ErrorScreen />
      </Container>
    );
  }

  return (
    <Container>
      <Card elevation={6}>
        <Title variant="h5" fontWeight={700} gutterBottom>
          {REGISTER_COMPANY_PAGE_TEXTS.title}
        </Title>

        <Typography variant="body2" color="text.secondary" mb={3}>
          {REGISTER_COMPANY_PAGE_TEXTS.subtitle}
        </Typography>

        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nome"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="CNPJ"
                value={formatCnpj(form.cnpj)}
                onChange={(e) => handleChange("cnpj", e.target.value)}
                fullWidth
                required
                error={!!errors.cnpj}
                helperText={errors.cnpj}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Senha"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
          </Grid>

          <SubmitButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={isPending}
            sx={{ mt: 2 }}
          >
            {REGISTER_COMPANY_PAGE_TEXTS.submitButton}
          </SubmitButton>

          <BackButton
            variant="outlined"
            fullWidth
            onClick={() => navigate("/registro")}
            sx={{ mt: 1 }}
          >
            {REGISTER_COMPANY_PAGE_TEXTS.backButton}
          </BackButton>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterCompanyPage;
