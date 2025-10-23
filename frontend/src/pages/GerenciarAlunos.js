import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import AlunoForm from '../components/AlunoForm';
import LoadingError from '../components/LoadingError';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { toast } from 'react-toastify';

export default function GerenciarAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAluno, setEditAluno] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/alunos');
      setAlunos(res.data.content);
    } catch (err) {
      toast.error('Erro ao carregar alunos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleAdd = () => {
    setEditAluno(null);
    setModalOpen(true);
  };

  const handleEdit = (aluno) => {
    setEditAluno(aluno);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/alunos/${deleteId}`);
      toast.success('Aluno excluído com sucesso!');
      fetchAlunos();
    } catch (err) {
      toast.error('Erro ao excluir aluno');
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleFormSubmit = async (form) => {
    try {
      if (editAluno) {
        await api.put(`/alunos/${editAluno.id}`, form); 
        toast.success('Aluno atualizado com sucesso!');
      } else {
        await api.post('/alunos', form);
        toast.success('Aluno cadastrado com sucesso!');
      }
      setModalOpen(false);
      fetchAlunos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar aluno');
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Alunos</h2>
      <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Adicionar Novo Aluno
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Curso</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.id}</TableCell>
                  <TableCell>{aluno.nome}</TableCell>
                  <TableCell>{aluno.email}</TableCell>
                  <TableCell>{aluno.cpf}</TableCell>
                  <TableCell>{aluno.curso}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(aluno)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(aluno.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AlunoForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editAluno}
        loading={loading}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Você tem certeza que deseja excluir este aluno?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
