import React, { useState, useEffect, createContext, useContext } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, CircularProgress, Dialog, DialogTitle,
  DialogActions, Typography, Box, Alert
} from "@mui/material";
import { toast } from "react-toastify";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Ícone para "Resgatar"
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function VisualizarVantagens() {
  const [vantagens, setVantagens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Para o diálogo de confirmação de resgate
  const [resgateItem, setResgateItem] = useState(null); // (vantagem a ser resgatada)
  const [resgateDialogOpen, setResgateDialogOpen] = useState(false);
  const [loadingResgate, setLoadingResgate] = useState(false);

  // Pega o 'user' (para o saldo) e a função 'updateUser' do AuthContext
  const { user, updateUser } = useAuth();

  const fetchVantagens = async () => {
    setLoading(true);
    try {
      // Endpoint para o aluno ver as vantagens
      // (Assumindo que /vantagens é público ou /vantagens/aluno)
      const res = await api.get("/vantagens"); // Agora usa o mock
      setVantagens(res.data);
    } catch (err) {
      toast.error("Erro ao carregar vantagens");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVantagens();
  }, []);

  // Abre o diálogo de confirmação
  const handleResgatar = (vantagem) => {
    if (user.saldoMoedas < vantagem.precoMoedas) {
      toast.error("Saldo insuficiente para resgatar esta vantagem.");
      return;
    }
    setResgateItem(vantagem);
    setResgateDialogOpen(true);
  };

  // Confirma e executa o resgate
  const confirmResgate = async () => {
    if (!resgateItem) return;

    setLoadingResgate(true);
    try {
      // Chama o novo endpoint do AlunoController
      // (O backend sabe qual aluno está logado pelo token)
      const res = await api.post(`/alunos/resgatar/${resgateItem.id}`); // Agora usa o mock
      
      // O endpoint retorna o Aluno atualizado
      const alunoAtualizado = res.data; 
      
      // Atualiza o 'user' no AuthContext (e localStorage) com o novo saldo
      // Usamos o 'updateUser' do AuthContext
      updateUser({ ...user, saldoMoedas: alunoAtualizado.saldoMoedas });

      toast.success("Vantagem resgatada com sucesso!");
      // (Opcional) Atualizar a lista de vantagens, caso haja limite de stock
      // fetchVantagens(); 

    } catch (err) {
      // O 'BusinessException' (Saldo Insuficiente) do backend cairá aqui (400)
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
      
      {/* Mostra o saldo atual do aluno */}
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
                  <TableCell>{v.empresaNome}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleResgatar(v)}
                      // Desabilita se o aluno não tiver saldo
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