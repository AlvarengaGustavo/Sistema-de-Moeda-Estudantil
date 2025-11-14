import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputMask from "react-input-mask";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import api from "../services/api";

export default function ProfessorForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
}) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    departamento: "",
    instituicao: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, senha: "" }); // don't show password
    } else {
      setForm({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
        departamento: "",
        instituicao: "",
      });
    }
  }, [initialData, open]);

  // carregar instituições para dropdown
  const [instituicoes, setInstituicoes] = useState([]);
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await api.get("/instituicoes");
        setInstituicoes(res.data || []);
      } catch (e) {
        // fallback: mantém lista vazia; campo ainda permite digitação se necessário
        setInstituicoes([]);
      }
    })();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // live clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateAll();
    if (!validation.valid) return;
    // trim and normalize before submit
    const payload = {};
    // always include required fields
    payload.nome = form.nome.trim();
    payload.email = form.email.trim();
    payload.cpf = normalizeDigits(form.cpf);
    payload.departamento = form.departamento.trim();
    payload.instituicao = form.instituicao.trim();
    // optional fields: only include if non-empty
    if (form.senha && form.senha.trim().length > 0) payload.senha = form.senha;
    onSubmit(payload);
  };

  // helpers and validation
  const [errors, setErrors] = useState({});

  const normalizeDigits = (s) => (s || "").replace(/\D/g, "");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(name, value) {
    value = value ?? "";
    switch (name) {
      case "nome":
        if (!value.trim()) return "Nome é obrigatório";
        if (value.trim().length < 2) return "Nome muito curto";
        if (value.trim().length > 100) return "Nome muito longo";
        return undefined;
      case "email":
        if (!value.trim()) return "Email é obrigatório";
        if (!emailRegex.test(value.trim())) return "Formato de email inválido";
        return undefined;
      case "senha":
        if (!initialData && !value) return "Senha é obrigatória";
        if (value && value.length > 0 && value.length < 6)
          return "Senha deve ter ao menos 6 caracteres";
        return undefined;
      case "cpf": {
        const digits = normalizeDigits(value);
        if (!digits) return "CPF é obrigatório";
        if (digits.length !== 11) return "CPF deve ter 11 dígitos";
        return undefined;
      }
      case "departamento":
        if (!value.trim()) return "Departamento é obrigatório";
        if (value.trim().length < 2) return "Departamento muito curto";
        if (value.trim().length > 100) return "Departamento muito longo";
        return undefined;
      default:
        return undefined;
    }
  }

  function validateAll() {
    const newErrors = {};
    Object.keys(form).forEach((k) => {
      const err = validateField(k, form[k]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>
        {initialData ? "Editar Professor" : "Adicionar Professor"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                fullWidth
                error={!!errors.nome}
                helperText={errors.nome}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                fullWidth
                type="email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Senha"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                onBlur={handleBlur}
                required={!initialData}
                fullWidth
                type="password"
                error={!!errors.senha}
                helperText={
                  errors.senha ||
                  (initialData
                    ? "Deixe em branco para manter a senha atual"
                    : "")
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputMask
                mask="999.999.999-99"
                value={form.cpf}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {() => (
                  <TextField
                    label="CPF"
                    name="cpf"
                    required
                    fullWidth
                    error={!!errors.cpf}
                    helperText={errors.cpf || "Formato: 000.000.000-00"}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                error={!!errors.instituicao}
              >
                <InputLabel id="instituicao-label">
                  Instituição de Ensino
                </InputLabel>
                <Select
                  labelId="instituicao-label"
                  label="Instituição de Ensino"
                  name="instituicao"
                  value={form.instituicao}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {instituicoes.map((i) => (
                    <MenuItem key={i.id} value={i.nome}>
                      {i.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Departamento"
                name="departamento"
                value={form.departamento}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                helperText={errors.departamento}
                error={!!errors.departamento}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || Object.keys(errors).some((k) => errors[k])}
          >
            {initialData ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
