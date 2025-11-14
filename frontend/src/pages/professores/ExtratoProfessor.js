import React, { useEffect, useState } from "react";
import api from "../../services/api";
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

export default function ExtratoProfessor() {
  const [professorId, setProfessorId] = useState("");
  const [extrato, setExtrato] = useState(null);
  const [professores, setProfessores] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/professores");
        setProfessores(res.data || []);
      } catch (e) {
        toast.error("Erro ao carregar professores");
      }
    })();
  }, []);

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
        <FormControl sx={{ minWidth: 280 }}>
          <InputLabel id="prof-label">Professor</InputLabel>
          <Select
            labelId="prof-label"
            label="Professor"
            value={professorId}
            onChange={(e) => setProfessorId(e.target.value)}
          >
            <MenuItem value="">
              <em>Selecione</em>
            </MenuItem>
            {professores.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nome} (saldo: {p.saldoMoedas})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={carregar} disabled={!professorId}>
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
