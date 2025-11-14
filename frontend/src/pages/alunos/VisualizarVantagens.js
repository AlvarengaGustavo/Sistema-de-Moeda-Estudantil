import React, { useState, useEffect } from "react";
import api from "../../services/api";
import VantagemForm from "../../components/VantagemForm";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { toast } from "react-toastify";

export default function GerenciarVantagens() {
  const [vantagens, setVantagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/vantagens/${deleteId}`);
      toast.success("Vantagem excluída com sucesso!");
      fetchVantagens();
    } catch (err) {
      toast.error("Erro ao excluir vantagem");
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleFormSubmit = async (form) => {
    try {
      if (editItem) {
        await api.put(`/vantagens/${editItem.id}`, form);
        toast.success("Vantagem atualizada com sucesso!");
      } else {
        await api.post("/vantagens", form);
        toast.success("Vantagem cadastrada com sucesso!");
      }
      setModalOpen(false);
      fetchVantagens();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao salvar vantagem");
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Vantagens</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Adicionar Nova Vantagem
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço (moedas)</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vantagens.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.id}</TableCell>
                  <TableCell>{v.titulo}</TableCell>
                  <TableCell>
                    {v.descricao
                      ? v.descricao.length > 80
                        ? v.descricao.substring(0, 77) + "..."
                        : v.descricao
                      : ""}
                  </TableCell>
                  <TableCell>{v.precoMoedas}</TableCell>
                  <TableCell>{v.empresaNome}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(v)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(v.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <VantagemForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editItem}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Você tem certeza que deseja excluir esta vantagem?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
