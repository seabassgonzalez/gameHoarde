import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import GameCatalog from './pages/GameCatalog';
import GameDetail from './pages/GameDetail';
import UserProfile from './pages/UserProfile';
import MyCollection from './pages/MyCollection';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';
import Register from './pages/Register';
import AddGame from './pages/AddGame';
import EditGame from './pages/EditGame';
import AdminImport from './pages/AdminImport';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: '#0a0a0a',
      paper: '#141414',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#141414',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<GameCatalog />} />
                <Route
                  path="/games/add"
                  element={
                    <PrivateRoute>
                      <AddGame />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/games/:id/edit"
                  element={
                    <PrivateRoute>
                      <EditGame />
                    </PrivateRoute>
                  }
                />
                <Route path="/games/:id" element={<GameDetail />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/user/:username" element={<UserProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/my-collection"
                  element={
                    <PrivateRoute>
                      <MyCollection />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/import"
                  element={
                    <PrivateRoute>
                      <AdminImport />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;