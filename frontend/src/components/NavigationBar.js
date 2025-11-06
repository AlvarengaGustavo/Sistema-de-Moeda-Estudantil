import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";

export default function NavigationBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Moeda Estudantil
          </Typography>
          <Button color="inherit" component={RouterLink} to="/alunos">
            Alunos
          </Button>
          <Button color="inherit" component={RouterLink} to="/empresas">
            Empresas
          </Button>
          <Button color="inherit" component={RouterLink} to="/vantagens">
            Vantagens
          </Button>
          <Button color="inherit" component={RouterLink} to="/enviar-moedas">
            Enviar Moedas
          </Button>
          <Button color="inherit" component={RouterLink} to="/extrato-aluno">
            Extrato Aluno
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/extrato-professor"
          >
            Extrato Professor
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
