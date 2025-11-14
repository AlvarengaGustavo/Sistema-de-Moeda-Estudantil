import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import EmpresaForm from '../../components/EmpresaForm';
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

export default function GerenciarEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmpresa, setEditEmpresa] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchEmpresas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/empresas');
      setEmpresas(res.data);
    } catch (err) {
      toast.error('Erro ao carregar empresas');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleAdd = () => {
    setEditEmpresa(null);
    setModalOpen(true);
  };

  const handleEdit = (empresa) => {
    setEditEmpresa(empresa);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/empresas/${deleteId}`);
      toast.success('Empresa excluída com sucesso!');
      fetchEmpresas();
    } catch (err) {
      toast.error('Erro ao excluir empresa');
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleFormSubmit = async (form) => {
    try {
      if (editEmpresa) {
        await api.put(`/empresas/${editEmpresa.id}`, form);
        toast.success('Empresa atualizada com sucesso!');
      } else {
        await api.post('/empresas', form);
        toast.success('Empresa cadastrada com sucesso!');
      }
      setModalOpen(false);
      fetchEmpresas();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar empresa');
    }
  };

  return (
    <div className="container">
      <h2>Gerenciar Empresas Parceiras</h2>
      <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Adicionar Nova Empresa
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
                <TableCell>CNPJ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>{empresa.id}</TableCell>
                  <TableCell>{empresa.nome}</TableCell>
                  <TableCell>{empresa.cnpj}</TableCell>
                  <TableCell>{empresa.email}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(empresa)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(empresa.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <EmpresaForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editEmpresa}
        loading={loading}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Você tem certeza que deseja excluir esta empresa?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
