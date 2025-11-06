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
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/logo.png"
              alt="Sistema de moedas"
              style={{ maxHeight: 40 }}
            />
          </Box>
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
