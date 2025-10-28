import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function ExtratoAluno() {
  const [alunoId, setAlunoId] = useState("");
  const [extrato, setExtrato] = useState(null);

  const carregar = async () => {
    if (!alunoId) {
      toast.warn("Informe o ID do aluno");
      return;
    }
    try {
      const res = await api.get(`/extratos/alunos/${alunoId}`);
      setExtrato(res.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Erro ao carregar extrato");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Extrato do Aluno
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="ID do Aluno"
          value={alunoId}
          onChange={(e) => setAlunoId(e.target.value)}
        />
        <Button variant="contained" onClick={carregar}>
          Carregar
        </Button>
      </Box>
      {extrato && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1">
            Saldo Atual: {extrato.saldoAtual}
          </Typography>
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Data/Hora</TableCell>
                <TableCell>Professor</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Motivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {extrato.transacoes?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.dataHora).toLocaleString()}</TableCell>
                  <TableCell>{t.professorNome}</TableCell>
                  <TableCell>{t.valor}</TableCell>
                  <TableCell>{t.mensagem}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
