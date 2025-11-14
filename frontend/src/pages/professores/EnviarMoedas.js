import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
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

      // Try to send notification emails (if env vars are configured)
      try {
        const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
        const templateAluno = process.env.REACT_APP_EMAILJS_TEMPLATE_ALUNO_ID;
        const templateProfessor =
          process.env.REACT_APP_EMAILJS_TEMPLATE_PROFESSOR_ID;
        const userId = process.env.REACT_APP_EMAILJS_USER_ID;

        if (serviceId && userId && (templateAluno || templateProfessor)) {
          const prof = professores.find(
            (p) => String(p.id) === String(professorId)
          );
          const aluno = alunos.find((a) => String(a.id) === String(alunoId));
          const now = new Date().toLocaleString();

          // Shared template params (both templates may use these keys)
          const commonParams = {
            professor_name: prof?.nome || "",
            professor_email: prof?.email || "",
            aluno_name: aluno?.nome || "",
            aluno_email: aluno?.email || "",
            valor: String(valor),
            motivo: motivo,
            data: now,
          };

          // Send aluno email (if configured)
          if (templateAluno) {
            emailjs
              .send(serviceId, templateAluno, commonParams, userId)
              .then(() => {
                // optionally notify success silently
              })
              .catch((err) => {
                console.error("Erro ao enviar email para aluno", err);
                toast.warn("Falha ao enviar email para o aluno (não crítico)");
              });
          }

          // Send professor email (if configured)
          if (templateProfessor) {
            emailjs
              .send(serviceId, templateProfessor, commonParams, userId)
              .then(() => {
                // ok
              })
              .catch((err) => {
                console.error("Erro ao enviar email para professor", err);
                toast.warn(
                  "Falha ao enviar email para o professor (não crítico)"
                );
              });
          }
        } else {
          // env vars not configured — skip sending
        }
      } catch (emailErr) {
        console.error("Erro no envio de emails", emailErr);
      }
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
