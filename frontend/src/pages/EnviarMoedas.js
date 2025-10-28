import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function EnviarMoedas() {
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [professorId, setProfessorId] = useState("");
  const [alunoId, setAlunoId] = useState("");
  const [valor, setValor] = useState("");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profRes, alunosRes] = await Promise.all([
          api.get("/professores"),
          api.get("/alunos", { params: { page: 0, size: 1000 } }),
        ]);
        setProfessores(profRes.data || []);
        setAlunos(alunosRes.data?.content || []);
      } catch (e) {
        toast.error("Erro ao carregar dados");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleEnviar = async () => {
    if (!professorId || !alunoId || !valor || !motivo) {
      toast.warn("Preencha todos os campos");
      return;
    }
    try {
      await api.post(`/professores/${professorId}/enviar-moedas`, {
        alunoId: Number(alunoId),
        valor: Number(valor),
        motivo,
      });
      toast.success("Moedas enviadas com sucesso!");
      setValor("");
      setMotivo("");
    } catch (e) {
      const msg = e.response?.data?.message || "Erro ao enviar moedas";
      toast.error(msg);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Enviar Moedas
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                displayEmpty
                value={professorId}
                onChange={(e) => setProfessorId(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione o Professor
                </MenuItem>
                {professores.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nome} (saldo: {p.saldoMoedas})
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                displayEmpty
                value={alunoId}
                onChange={(e) => setAlunoId(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione o Aluno
                </MenuItem>
                {alunos.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.nome} ({a.email})
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                type="number"
                label="Valor"
                fullWidth
                inputProps={{ min: 1 }}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Motivo"
                fullWidth
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleEnviar}>
                Enviar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
