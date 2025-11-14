import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext'; 
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import NavigationBar from "./components/NavigationBar";
import Login from "./pages/Login";
import GerenciarAlunos from "./pages/admin/GerenciarAlunos";
import GerenciarEmpresas from "./pages/admin/GerenciarEmpresas";
import GerenciarProfessores from "./pages/admin/GerenciarProfessores";

import GerenciarVantagens from "./pages/empresas/GerenciarVantagens";

import EnviarMoedas from "./pages/professores/EnviarMoedas";
import ExtratoProfessor from "./pages/professores/ExtratoProfessor";
import ExtratoAluno from "./pages/alunos/ExtratoAluno";

import VisualizarVantagens from "./pages/alunos/VisualizarVantagens";

const UnauthorizedPage = () => (
  <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>
    <h2>403 - Acesso Negado</h2>
    <p>Você não tem permissão para aceder a esta página.</p>
  </div>
);

const LoggedOutGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>A carregar...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>A carregar...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }

  return (
    <div>
      <NavigationBar />
      <main style={{ padding: 20 }}>
        <Outlet /> {}
      </main>
    </div>
  );
};


const RoleGuard = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />; 
};

const HomeRedirector = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />; 

  switch (user.role) {
    case 'ALUNO':
      return <Navigate to="/extrato-aluno" replace />;
    case 'PROFESSOR':
      return <Navigate to="/enviar-moedas" replace />;
    case 'EMPRESA':
      return <Navigate to="/vantagens" replace />;
    case 'ADMIN':
      return <Navigate to="/alunos" replace />;
    default:
      return <Navigate to="/" replace />; 
  }
};

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" />
      
      <Routes>
        {/* Rota Não Autorizada (pode ser pública) */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<LoggedOutGuard />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<MainLayout />}>
          
          <Route path="/home" element={<HomeRedirector />} />
        
          {/* Rotas ADMIN  */}
          <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
            <Route path="/alunos" element={<GerenciarAlunos />} />
            <Route path="/empresas" element={<GerenciarEmpresas />} />
            <Route path="/professores" element={<GerenciarProfessores />} />
          </Route>

          {/* Rotas PROFESSOR */}
          <Route element={<RoleGuard allowedRoles={['PROFESSOR']} />}>
            <Route path="/enviar-moedas" element={<EnviarMoedas />} />
            <Route path="/extrato-professor" element={<ExtratoProfessor />} />
          </Route>
          
          {/* Rotas EMPRESA */}
          <Route element={<RoleGuard allowedRoles={['EMPRESA']} />}>
            <Route path="/vantagens" element={<GerenciarVantagens />} />
          </Route>

          {/* Rotas ALUNO */}
          <Route element={<RoleGuard allowedRoles={['ALUNO']} />}>
            <Route path="/extrato-aluno" element={<ExtratoAluno />} />
            <Route path="/visualizar-vantagens" element={<VisualizarVantagens />} />
          </Route>

        </Route>
        
        {/* Rota 404 - Apanha tudo o que não foi correspondido */}
        <Route path="*" element={
          <div style={{ padding: 40, textAlign: 'center' }}>
            <h2>404 - Página Não Encontrada</h2>
          </div>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;