import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Começa true para verificar o storage
  const navigate = useNavigate();

  // Tenta carregar o utilizador do localStorage ao iniciar
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Falha ao carregar utilizador do localStorage", err);
        setUser(null);
        localStorage.clear();
      }
      setIsLoading(false);
    };
    loadUserFromStorage();
  }, []);

  // Função de Login
  const login = async (email, senha) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, user: userData } = response.data;

      // Salva no localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(userData));

      // Atualiza o estado
      setUser(userData);
      
      // Redireciona para a página 'home' (que depois redireciona pela role)
      navigate('/home'); 
      return true;

    } catch (err) {
      console.error("Erro no login:", err);
      localStorage.clear();
      setUser(null);
      // Retorna a mensagem de erro do backend (ex: "Email ou senha inválidos")
      return err.response?.data?.message || 'Email ou senha inválidos.';
    } finally {
      setIsLoading(false);
    }
  };

  // Função de Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/'); // Redireciona para o login
  };

  /**
   * [A CORREÇÃO]
   * Função para ATUALIZAR o utilizador no contexto e no localStorage.
   * Usada quando o aluno resgata uma vantagem (para atualizar o saldo).
   */
  const updateUser = (newUserData) => {
    try {
      // Atualiza o estado
      setUser(newUserData);
      // Atualiza o localStorage
      localStorage.setItem('authUser', JSON.stringify(newUserData));
    } catch (err) {
      console.error("Falha ao atualizar utilizador:", err);
    }
  };

  /**
   * [A CORREÇÃO]
   * O valor do contexto DEVE incluir o updateUser para que 
   * a página VisualizarVantagens o possa utilizar.
   */
  const authContextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser // <-- A CORREÇÃO QUE FALTAVA
    }),
    [user, isLoading] // Removido 'navigate' das deps, pois não afeta o valor
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {/* Não renderiza os filhos até a verificação inicial do localStorage estar concluída */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir o contexto
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};