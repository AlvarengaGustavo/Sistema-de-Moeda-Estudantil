import React, { createContext, useContext } from "react"; // Adicionado useContext
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography"; // Para mostrar o nome
import IconButton from "@mui/material/IconButton"; // Para o botão de sair
import Tooltip from "@mui/material/Tooltip"; // <<< CORREÇÃO: Importar o Tooltip
import LogoutIcon from '@mui/icons-material/Logout'; // Ícone de "Sair"
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  // ADMIN
  { label: "Alunos", to: "/alunos", roles: ["ADMIN"] },
  { label: "Professores", to: "/professores", roles: ["ADMIN"] },
  { label: "Empresas", to: "/empresas", roles: ["ADMIN"] },
  // PROFESSOR
  { label: "Enviar Moedas", to: "/enviar-moedas", roles: ["PROFESSOR"] },
  { label: "Extrato", to: "/extrato-professor", roles: ["PROFESSOR"] },
  // EMPRESA
  { label: "Vantagens", to: "/vantagens", roles: ["EMPRESA"] },
  // ALUNO
  { label: "Extrato", to: "/extrato-aluno", roles: ["ALUNO"] },
  { label: "Vantagens", to: "/visualizar-vantagens", roles: ["ALUNO"] },
];

export default function NavigationBar() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const availableLinks = navLinks.filter(link => 
    link.roles.includes(user.role)
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Logo e Nome do Utilizador */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/logo.png" // Placeholder para o logo
              alt="Sistema de moedas"
              style={{ maxHeight: 40, marginRight: 16 }}
            />
            {/* Mostra o nome do utilizador (esconde em ecrãs pequenos) */}
            {/* <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Olá, {user.nome}!
            </Typography> */}
          </Box>

          {/* 4. Renderizar apenas os links filtrados */}
          {availableLinks.map((link) => (
            <Button
              key={link.to}
              color="inherit"
              component={RouterLink}
              to={link.to}
              // Esconde o texto em ecrãs muito pequenos, se necessário
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              {link.label}
            </Button>
          ))}

          {/* 5. Botão de Logout no canto direito */}
          <Tooltip title="Sair">
            <IconButton
              color="inherit" 
              onClick={logout} // Chama a função de logout do contexto
              aria-label="Sair"
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>

        </Toolbar>
      </AppBar>
    </Box>
  );
}