import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

type UserRole = 'tenant' | 'landlord' | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to parse user data', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const signup = async (email: string, password: string, role: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.signup(email, password, role);
      
      // The backend returns user data and token
      const { token, data } = response;
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role.toLowerCase() as UserRole,
        name: email.split('@')[0],
        token
      };
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Redirect based on role
      navigate(userData.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(email, password);
      
      // The backend returns user data and token
      const { token, data } = response;
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role.toLowerCase() as UserRole,
        name: email.split('@')[0],
        token
      };
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Redirect based on role
      navigate(userData.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      signup,
      logout, 
      error,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
