import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import api from "../services/api";
import CircularProgress from "@mui/material/CircularProgress";

export default function VantagemForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    precoMoedas: "",
    fotoUrl: "",
    empresaParceiraId: null,
  });
  const [errors, setErrors] = useState({});
  const [empresas, setEmpresas] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingEmpresas(true);
      try {
        const res = await api.get("/empresas");
        setEmpresas(res.data);
      } catch (err) {
        setEmpresas([]);
      }
      setLoadingEmpresas(false);
    };
    load();
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setForm({
        titulo: initialData.titulo || "",
        descricao: initialData.descricao || "",
        precoMoedas: initialData.precoMoedas ?? "",
        fotoUrl: initialData.fotoUrl || "",
        empresaParceiraId: initialData.empresaId || null,
      });
    } else {
      setForm({
        titulo: "",
        descricao: "",
        precoMoedas: "",
        fotoUrl: "",
        empresaParceiraId: null,
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateAll = () => {
    const newErrors = {};
    if (!form.titulo || !form.titulo.trim())
      newErrors.titulo = "Título é obrigatório";
    if (form.precoMoedas === "" || form.precoMoedas === null)
      newErrors.precoMoedas = "Preço em moedas é obrigatório";
    else if (Number(form.precoMoedas) < 0)
      newErrors.precoMoedas = "Preço inválido";
    if (!form.empresaParceiraId)
      newErrors.empresaParceiraId = "Empresa parceira é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao?.trim(),
      precoMoedas: Number(form.precoMoedas),
      fotoUrl: form.fotoUrl?.trim() || null,
      empresaParceiraId: Number(form.empresaParceiraId),
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Editar Vantagem" : "Adicionar Vantagem"}
      </DialogTitle>
      <form onSubmit={submit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Título"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.titulo}
                helperText={errors.titulo}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Preço (moedas)"
                name="precoMoedas"
                value={form.precoMoedas}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
                error={!!errors.precoMoedas}
                helperText={errors.precoMoedas}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="URL da foto (opcional)"
                name="fotoUrl"
                value={form.fotoUrl}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="empresa-label">Empresa Parceira</InputLabel>
                {loadingEmpresas ? (
                  <div style={{ padding: 12 }}>
                    <CircularProgress size={24} />
                  </div>
                ) : (
                  <Select
                    labelId="empresa-label"
                    label="Empresa Parceira"
                    name="empresaParceiraId"
                    value={form.empresaParceiraId ?? ""}
                    onChange={handleChange}
                    error={!!errors.empresaParceiraId}
                  >
                    <MenuItem value="">Selecione</MenuItem>
                    {empresas.map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.nome}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {errors.empresaParceiraId && (
                  <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 6 }}>
                    {errors.empresaParceiraId}
                  </div>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {initialData ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
