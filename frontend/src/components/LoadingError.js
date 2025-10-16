import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

export default function LoadingError({ loading, error }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">
          {error.response?.data?.message || error.message || 'Erro ao processar requisição'}
        </Alert>
      </Box>
    );
  }

  return null;
}