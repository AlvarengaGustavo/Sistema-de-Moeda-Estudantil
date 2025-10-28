import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function ExtratoAluno() {
  const [alunoId, setAlunoId] = useState("");
  const [extrato, setExtrato] = useState(null);
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/alunos", {
          params: { page: 0, size: 1000 },
        });
        setAlunos(res.data?.content || []);
      } catch (e) {
        toast.error("Erro ao carregar alunos");
      }
    })();
  }, []);

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
        <FormControl sx={{ minWidth: 280 }}>
          <InputLabel id="aluno-label">Aluno</InputLabel>
          <Select
            labelId="aluno-label"
            label="Aluno"
            value={alunoId}
            onChange={(e) => setAlunoId(e.target.value)}
          >
            <MenuItem value="">
              <em>Selecione</em>
            </MenuItem>
            {alunos.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.nome} ({a.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={carregar} disabled={!alunoId}>
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
