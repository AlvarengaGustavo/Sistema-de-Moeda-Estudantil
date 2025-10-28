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

export default function ExtratoProfessor() {
  const [professorId, setProfessorId] = useState("");
  const [extrato, setExtrato] = useState(null);

  const carregar = async () => {
    if (!professorId) {
      toast.warn("Informe o ID do professor");
      return;
    }
    try {
      const res = await api.get(`/professores/${professorId}/extrato`);
      setExtrato(res.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Erro ao carregar extrato");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Extrato do Professor
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="ID do Professor"
          value={professorId}
          onChange={(e) => setProfessorId(e.target.value)}
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
                <TableCell>Aluno</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Motivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {extrato.transacoes?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.dataHora).toLocaleString()}</TableCell>
                  <TableCell>{t.alunoNome}</TableCell>
                  <TableCell>-{t.valor}</TableCell>
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
