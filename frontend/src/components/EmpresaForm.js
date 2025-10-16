import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';

export default function EmpresaForm({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    email: '',
    senha: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, senha: '' });
    } else {
      setForm({ nome: '', cnpj: '', email: '', senha: '' });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateAll();
    if (!validation.valid) return;
    const payload = {
      ...form,
      nome: form.nome.trim(),
      email: form.email.trim(),
      cnpj: (form.cnpj || '').replace(/\D/g, ''),
    };
    onSubmit(payload);
  };

  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const normalizeDigits = (s) => (s || '').replace(/\D/g, '');

  function validateField(name, value) {
    value = value ?? '';
    switch (name) {
      case 'nome':
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.trim().length > 150) return 'Nome muito longo';
        return undefined;
      case 'cnpj': {
        const d = normalizeDigits(value);
        if (!d) return 'CNPJ é obrigatório';
        if (d.length !== 14) return 'CNPJ deve ter 14 dígitos';
        return undefined;
      }
      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        if (!emailRegex.test(value.trim())) return 'Formato de email inválido';
        return undefined;
      case 'senha':
        if (!initialData && !value) return 'Senha é obrigatória';
        if (value && value.length > 0 && value.length < 6) return 'Senha deve ter ao menos 6 caracteres';
        return undefined;
      default:
        return undefined;
    }
  }

  function validateAll() {
    const newErrors = {};
    Object.keys(form).forEach(k => {
      const err = validateField(k, form[k]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Empresa' : 'Adicionar Empresa'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Nome" name="nome" value={form.nome} onChange={handleChange} onBlur={handleBlur} required fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputMask mask="99.999.999/9999-99" value={form.cnpj} onChange={handleChange} onBlur={handleBlur}>
                {(maskProps) => (
                  <TextField
                    {...maskProps}
                    label="CNPJ"
                    name="cnpj"
                    required
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 18 }}
                    error={!!errors.cnpj}
                    helperText={errors.cnpj || 'Formato: 00.000.000/0000-00'}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} required fullWidth margin="normal" type="email" error={!!errors.email} helperText={errors.email} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Senha" name="senha" value={form.senha} onChange={handleChange} onBlur={handleBlur} required={!initialData} fullWidth margin="normal" type="password" error={!!errors.senha} helperText={errors.senha || (initialData ? 'Deixe em branco para manter a senha atual' : '')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading || Object.keys(errors).some(k => errors[k])}>{initialData ? 'Salvar' : 'Cadastrar'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
