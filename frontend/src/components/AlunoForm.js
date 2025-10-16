import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function AlunoForm({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    rg: '',
    endereco: '',
    instituicaoDeEnsino: '',
    curso: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData, senha: '' }); // don't show password
    } else {
      setForm({
        nome: '', email: '', senha: '', cpf: '', rg: '', endereco: '', instituicaoDeEnsino: '', curso: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // live clear error for this field
    setErrors(prev => ({ ...prev, [name]: undefined }));
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
    payload.instituicaoDeEnsino = form.instituicaoDeEnsino.trim();
    payload.curso = form.curso.trim();
    // optional fields: only include if non-empty
    if (form.senha && form.senha.trim().length > 0) payload.senha = form.senha;
    if (form.rg && form.rg.trim().length > 0) payload.rg = form.rg.trim();
    if (form.endereco && form.endereco.trim().length > 0) payload.endereco = form.endereco.trim();
    onSubmit(payload);
  };

  // helpers and validation
  const [errors, setErrors] = useState({});

  const normalizeDigits = (s) => (s || '').replace(/\D/g, '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(name, value) {
    value = value ?? '';
    switch (name) {
      case 'nome':
        if (!value.trim()) return 'Nome é obrigatório';
        if (value.trim().length < 2) return 'Nome muito curto';
        if (value.trim().length > 100) return 'Nome muito longo';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Email é obrigatório';
        if (!emailRegex.test(value.trim())) return 'Formato de email inválido';
        return undefined;
      case 'senha':
        if (!initialData && !value) return 'Senha é obrigatória';
        if (value && value.length > 0 && value.length < 6) return 'Senha deve ter ao menos 6 caracteres';
        return undefined;
      case 'cpf': {
        const digits = normalizeDigits(value);
        if (!digits) return 'CPF é obrigatório';
        if (digits.length !== 11) return 'CPF deve ter 11 dígitos';
        return undefined;
      }
      case 'rg':
        if (value && value.length > 20) return 'RG muito longo';
        return undefined;
      case 'endereco':
        if (value && value.length > 200) return 'Endereço muito longo';
        return undefined;
      case 'instituicaoDeEnsino':
        if (!value.trim()) return 'Instituição de ensino é obrigatória';
        if (value.trim().length > 150) return 'Nome da instituição muito longo';
        return undefined;
      case 'curso':
        if (!value.trim()) return 'Curso é obrigatório';
        if (value.trim().length > 100) return 'Nome do curso muito longo';
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
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen}>
      <DialogTitle>{initialData ? 'Editar Aluno' : 'Adicionar Aluno'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Nome" name="nome" value={form.nome} onChange={handleChange} onBlur={handleBlur} required fullWidth error={!!errors.nome} helperText={errors.nome} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} required fullWidth type="email" error={!!errors.email} helperText={errors.email} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Senha" name="senha" value={form.senha} onChange={handleChange} onBlur={handleBlur} required={!initialData} fullWidth type="password" error={!!errors.senha} helperText={errors.senha || (initialData ? 'Deixe em branco para manter a senha atual' : '')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputMask mask="999.999.999-99" value={form.cpf} onChange={handleChange} onBlur={handleBlur}>
                {() => <TextField label="CPF" name="cpf" required fullWidth error={!!errors.cpf} helperText={errors.cpf || 'Formato: 000.000.000-00'} />}
              </InputMask>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="RG" name="rg" value={form.rg} onChange={handleChange} onBlur={handleBlur} fullWidth helperText={errors.rg} error={!!errors.rg} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} onBlur={handleBlur} fullWidth error={!!errors.endereco} helperText={errors.endereco} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField label="Instituição de Ensino" name="instituicaoDeEnsino" value={form.instituicaoDeEnsino} onChange={handleChange} onBlur={handleBlur} required fullWidth error={!!errors.instituicaoDeEnsino} helperText={errors.instituicaoDeEnsino} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Curso" name="curso" value={form.curso} onChange={handleChange} onBlur={handleBlur} required fullWidth error={!!errors.curso} helperText={errors.curso} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading || Object.keys(errors).some(k => errors[k])}>{initialData ? 'Salvar' : 'Cadastrar'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
