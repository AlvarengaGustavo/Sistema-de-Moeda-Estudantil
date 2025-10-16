import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import GerenciarAlunos from './pages/GerenciarAlunos';
import GerenciarEmpresas from './pages/GerenciarEmpresas';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <NavigationBar />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/alunos" element={<GerenciarAlunos />} />
          <Route path="/empresas" element={<GerenciarEmpresas />} />
          <Route path="/" element={<Navigate to="/alunos" replace />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
