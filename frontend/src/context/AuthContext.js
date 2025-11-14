import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        console.error("Erro ao parsear usuário do localStorage", e);
        logout();
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });

      const { token: responseToken, user: responseUser } = response.data;

      localStorage.setItem('authToken', responseToken);
      localStorage.setItem('authUser', JSON.stringify(responseUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;

      setToken(responseToken);
      setUser(responseUser);
      
      // O redirecionamento com base na role pode ser feito aqui
      navigate('/'); 
      
      return true;

    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      // Retorna a mensagem de erro ou um padrão
      return error.response?.data?.message || "Email ou senha inválidos";
    }
  };

  // Função de Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    delete api.defaults.headers.common['Authorization'];

    setToken(null);
    setUser(null);
    
    navigate('/');
  };

  const authContextValue = {
    token,
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children} {/* Só renderiza o app após verificar o token */}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};