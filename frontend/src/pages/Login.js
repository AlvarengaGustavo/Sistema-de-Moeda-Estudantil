import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Imports do Material-UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

// Ícones do Material-UI
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loading: authLoading } = useAuth(); // Adicionado loading do hook

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const result = await login(email, senha);

      if (result === true) {
        toast.success('Login realizado com sucesso!');
      } else {
        toast.error(result || "Falha no login. Verifique as suas credenciais.");
      }
    } catch (err) {
      // Um catch de segurança, embora o 'login' já trate os erros
      toast.error('Erro inesperado ao fazer login. Tente novamente.');
      console.error("Erro no handleLogin:", err);
    } 
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
        borderRadius: 2 // Cantos arredondados
      }}>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src="/logo_login.png"
            alt="Sistema de moedas"
            style={{ maxHeight: 300 }}
          />
        </Box>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            // 6. Todos os campos atualizados para 'senha'
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
            {/* Botão de login com indicador de carregamento */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={authLoading} // Usar o loading do hook
              sx={{ py: 1.5 }} // Botão um pouco mais alto
            >
              Entrar
            </Button>
            {authLoading && ( // Usar o loading do hook
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
