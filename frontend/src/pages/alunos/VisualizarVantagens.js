import React, { useState, useEffect } from "react";
import api from "../../services/api"; // O seu 'services/api.js'
import { useAuth } from "../../context/AuthContext"; // O nosso AuthContext
import emailjs from "@emailjs/browser"; // [NOVO] Importar o EmailJS
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, CircularProgress, Dialog, DialogTitle,
  DialogActions, Typography, Box, Alert
} from "@mui/material";
import { toast } from "react-toastify";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const generateRedemptionCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


export default function VisualizarVantagens() {
  const [vantagens, setVantagens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [resgateItem, setResgateItem] = useState(null);
  const [resgateDialogOpen, setResgateDialogOpen] = useState(false);
  const [loadingResgate, setLoadingResgate] = useState(false);

  const { user, updateUser } = useAuth();

  const fetchVantagens = async () => {
    setLoading(true);
    try {
      const res = await api.get("/vantagens");
      setVantagens(res.data);
    } catch (err) {
      toast.error("Erro ao carregar vantagens");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVantagens();
  }, []);

  const handleResgatar = (vantagem) => {
    if (user.saldoMoedas < vantagem.precoMoedas) {
      toast.error("Saldo insuficiente para resgatar esta vantagem.");
      return;
    }
    setResgateItem(vantagem);
    setResgateDialogOpen(true);
  };

  /**
   * [NOVO] Função de envio de e-mail (adaptada do seu EnviarMoedas.jsx)
   */
  const sendRedemptionEmail = (vantagem, aluno, codigo) => {
    try {
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_RESGATE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_RESGATE;
      const userId = process.env.REACT_APP_EMAILJS_USER_RESGATE_ID;

      if (serviceId && templateId && userId) {
        // Parâmetros para o seu novo template de resgate
        const templateParams = {
          aluno_name: aluno.nome,
          aluno_email: aluno.email,
          vantagem_titulo: vantagem.titulo,
          vantagem_preco: String(vantagem.precoMoedas),
          codigo_resgate: codigo, // O código gerado!
          data: new Date().toLocaleString(),
        };

        emailjs.send(serviceId, templateId, templateParams, userId)
          .then(() => {
            // toast.success("E-mail de resgate enviado!");
          })
          .catch((err) => {
            console.error("Erro ao enviar email de resgate", err);
            toast.warn("Vantagem resgatada, mas falha ao enviar o e-mail.");
          });
      } else {
        console.warn("EmailJS (Resgate) não configurado. Saltando envio de e-mail.");
        toast.info("Resgate efetuado (envio de e-mail não configurado).");
      }
    } catch (emailErr) {
      console.error("Erro no envio de email de resgate", emailErr);
    }
  };

  // Confirma e executa o resgate
  const confirmResgate = async () => {
    if (!resgateItem) return;

    setLoadingResgate(true);
    try {
      const res = await api.post(`/alunos/resgatar/${resgateItem.id}`);
      const alunoAtualizado = res.data;
      
      // Atualiza o saldo no AuthContext
      updateUser({ ...user, saldoMoedas: alunoAtualizado.saldoMoedas });

      toast.success("Vantagem resgatada com sucesso!");
      
      // --- [LÓGICA DE E-MAIL ADICIONADA] ---
      // 1. Gerar o código
      const codigo = generateRedemptionCode();
      sendRedemptionEmail(resgateItem, user, codigo);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao resgatar vantagem");
    }
    setLoadingResgate(false);
    setResgateDialogOpen(false);
    setResgateItem(null);
  };

  return (
    <div className="container">
      <Typography variant="h4" gutterBottom>
        Loja de Vantagens
      </Typography>
      
      <Alert 
        icon={<AccountBalanceWalletIcon fontSize="inherit" />} 
        severity="info" 
        sx={{ mb: 3, maxWidth: 'sm' }}
      >
        <Typography variant="h6">
          Seu Saldo: {user.saldoMoedas} moedas
        </Typography>
      </Alert>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vantagem</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço (moedas)</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vantagens.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.titulo}</TableCell>
                  <TableCell>
                    {v.descricao
                      ? v.descricao.length > 80
                        ? v.descricao.substring(0, 77) + "..."
                        : v.descricao
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      color={user.saldoMoedas < v.precoMoedas ? 'error' : 'primary'}
                      fontWeight="bold"
                    >
                      {v.precoMoedas}
                    </Typography>
                  </TableCell>
                  <TableCell>{v.empresaNome || (v.empresaParceira ? v.empresaParceira.nome : 'N/A')}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleResgatar(v)}
                      disabled={user.saldoMoedas < v.precoMoedas}
                    >
                      Resgatar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo de Confirmação de Resgate */}
      <Dialog
        open={resgateDialogOpen}
        onClose={() => setResgateDialogOpen(false)}
      >
        <DialogTitle>
          Confirmar Resgate?
        </DialogTitle>
        <Box sx={{ p: 2, paddingLeft: 3, paddingRight: 3 }}>
           <Typography>
             Vantagem: <strong>{resgateItem?.titulo}</strong>
           </Typography>
           <Typography>
             Custo: <strong>{resgateItem?.precoMoedas} moedas</strong>
           </Typography>
           <Typography sx={{ mt: 1 }}>
             Seu saldo após o resgate será: 
             <strong> {user.saldoMoedas - (resgateItem?.precoMoedas || 0)} moedas</strong>
           </Typography>
        </Box>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResgateDialogOpen(false)} disabled={loadingResgate}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmResgate} 
            color="primary" 
            variant="contained"
            disabled={loadingResgate}
          >
            {loadingResgate ? <CircularProgress size={24} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}