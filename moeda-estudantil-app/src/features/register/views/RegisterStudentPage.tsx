import { useState, useEffect, type FC } from "react";
import {
  Typography,
  TextField,
  Grid,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Container,
  Form,
  SubmitButton,
  Title,
  BackButton,
} from "./styles/RegisterStudentPage.styled";

import { REGISTER_STUDENT_PAGE_TEXTS } from "../utils/constants";
import { useLoadInstitutions } from "../../institutions/hooks/useLoadInstitutions";

import {
  isValidCpf,
  isValidEmail,
  formatCpf,
} from "../../../shared/utils/helperFunctions";

import SuccessScreen from "./SuccessScreen";
import ErrorScreen from "./ErrorScreen";
import { useCreateStudent } from "../hooks/useCreateStudent";

const RegisterStudentPage: FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: createStudent, isPending } = useCreateStudent();

  const [status, setStatus] = useState<"form" | "success" | "error">("form");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    address: "",
    course: "",
    institutionId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [institutionSearch, setInstitutionSearch] = useState("");

  const page = 1;
  const limit = 20;

  const {
    data: institutionsData,
    isLoading,
    refetch,
  } = useLoadInstitutions(
    page,
    limit,
    institutionSearch.length >= 3 ? institutionSearch : undefined
  );

  useEffect(() => {
    if (institutionSearch.length >= 3) refetch();
  }, [institutionSearch, refetch]);

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

      case "cpf":
        if (!value) message = "CPF é obrigatório.";
        else if (!isValidCpf(value)) message = "CPF inválido.";
        break;

      case "address":
        if (!value.trim()) message = "Endereço é obrigatório.";
        break;

      case "course":
        if (!value.trim()) message = "Curso é obrigatório.";
        break;

      case "institutionId":
        if (!value) message = "Selecione uma instituição.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "cpf") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, cpf: onlyNumbers }));
      validateField("cpf", onlyNumbers);
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
      await createStudent(form);
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
          {REGISTER_STUDENT_PAGE_TEXTS.title}
        </Title>

        <Typography variant="body2" color="text.secondary" mb={3}>
          {REGISTER_STUDENT_PAGE_TEXTS.subtitle}
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
                label="Email"
                type="email"
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="CPF"
                value={formatCpf(form.cpf)}
                onChange={(e) => handleChange("cpf", e.target.value)}
                fullWidth
                required
                error={!!errors.cpf}
                helperText={errors.cpf}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Endereço"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                fullWidth
                required
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Curso"
                value={form.course}
                onChange={(e) => handleChange("course", e.target.value)}
                fullWidth
                required
                error={!!errors.course}
                helperText={errors.course}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Autocomplete
                loadingText="Carregando..."
                options={institutionsData?.items || []}
                getOptionLabel={(option) => option.name}
                noOptionsText={"Instituição não encontrada"}
                loading={isLoading}
                onInputChange={(_, value) => setInstitutionSearch(value)}
                onChange={(_, value) => {
                  const id = value?.id || "";
                  handleChange("institutionId", id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Instituição"
                    fullWidth
                    required
                    error={!!errors.institutionId}
                    helperText={errors.institutionId}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoading ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
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
            {REGISTER_STUDENT_PAGE_TEXTS.submitButton}
          </SubmitButton>

          <BackButton
            variant="outlined"
            fullWidth
            onClick={() => navigate("/registro")}
            sx={{ mt: 1 }}
          >
            {REGISTER_STUDENT_PAGE_TEXTS.backButton}
          </BackButton>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterStudentPage;
