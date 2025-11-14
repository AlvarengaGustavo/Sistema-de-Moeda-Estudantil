import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import ProfessorForm from '../../components/ProfessorForm';
import LoadingError from '../../components/LoadingError';
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

export default function GerenciarProfessores() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProfessor, setEditProfessor] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchProfessores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/professores');
      setProfessores(res.data);
    } catch (err) {
      toast.error('Erro ao carregar professores');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  const handleAdd = () => {
    setEditProfessor(null);
    setModalOpen(true);
  };

  const handleEdit = (professor) => {
    setEditProfessor(professor);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/professores/${deleteId}`);
      toast.success('Professor excluído com sucesso!');
      fetchProfessores();
    } catch (err) {
      toast.error('Erro ao excluir professor');
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleFormSubmit = async (form) => {
    try {
      if (editProfessor) {
        await api.put(`/professores/${editProfessor.id}`, form); 
        toast.success('Professor atualizado com sucesso!');
      } else {
        await api.post('/professores', form);
        toast.success('Professor cadastrado com sucesso!');
      }
      setModalOpen(false);
      fetchProfessores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar professor');
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Professores</h2>
      <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Adicionar Novo Professor
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
                <TableCell>Departamento</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {professores.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell>{professor.id}</TableCell>
                  <TableCell>{professor.nome}</TableCell>
                  <TableCell>{professor.email}</TableCell>
                  <TableCell>{professor.cpf}</TableCell>
                  <TableCell>{professor.departamento}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(professor)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(professor.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ProfessorForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editProfessor}
        loading={loading}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Você tem certeza que deseja excluir este professor?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
