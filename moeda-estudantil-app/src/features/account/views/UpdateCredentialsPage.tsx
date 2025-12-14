import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import api from "../../../shared/api/Api";
import { API_ROUTES } from "../../../shared/api/API_ROUTES";
import { useLoginSlice } from "../../login/hooks/useLoginSlice";
import type { IUser } from "../../login/types/IUser";

function UpdateCredentialsPage() {
  const { authenticatedUser, setAuthenticatedUser } = useLoginSlice();
  const [email, setEmail] = useState(authenticatedUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(API_ROUTES.UPDATE_CREDENTIALS, {
        email,
        currentPassword,
        newPassword,
      });
      return res.data;
    },
    onSuccess: (data: IUser) => {
      setAuthenticatedUser(data);
      setCurrentPassword("");
      setNewPassword("");
    },
  });

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value) setErrors((e) => ({ ...e, email: "Informe um e-mail" }));
    else if (!isValidEmail(value))
      setErrors((e) => ({ ...e, email: "E-mail inválido" }));
    else setErrors((e) => ({ ...e, email: "" }));
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (!value) setErrors((e) => ({ ...e, newPassword: "" }));
    else if (value.length < 6)
      setErrors((e) => ({
        ...e,
        newPassword: "Senha deve ter pelo menos 6 caracteres",
      }));
    else if (value === currentPassword)
      setErrors((e) => ({
        ...e,
        newPassword: "Nova senha deve ser diferente da atual",
      }));
    else setErrors((e) => ({ ...e, newPassword: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.email || errors.newPassword) return;
    mutation.mutate();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={2}
    >
      <Card sx={{ width: "100%", maxWidth: 500 }}>
        <CardContent>
          <Typography variant="h6" mb={3}>
            Alterar e-mail e senha
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Novo e-mail"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                label="Senha atual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
              />
              <TextField
                label="Nova senha"
                type="password"
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                fullWidth
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={
                  mutation.isPending ||
                  Boolean(errors.email || errors.newPassword)
                }
              >
                {mutation.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>

              {mutation.isSuccess && (
                <Typography color="success.main">
                  Dados atualizados com sucesso.
                </Typography>
              )}
              {mutation.isError && (
                <Typography color="error.main">
                  Falha ao atualizar. Tente novamente.
                </Typography>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UpdateCredentialsPage;
