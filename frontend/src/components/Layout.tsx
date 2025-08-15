import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Container,
  useTheme,
  alpha,
} from '@mui/material';
import { Games as GamesIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  console.log('Layout render - user:', user);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: alpha(theme.palette.background.default, 0.9),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <Typography 
              variant="h6" 
              noWrap 
              component={Link} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 700,
                fontSize: '1.5rem',
                gap: 1,
              }}
            >
              <GamesIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              GameHorde
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button 
                component={Link} 
                to="/games"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                Games
              </Button>
              <Button 
                component={Link} 
                to="/marketplace"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                Marketplace
              </Button>
              {user && (
                <>
                  <Button 
                    component={Link} 
                    to="/my-collection"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    My Collection
                  </Button>
                  {user.username === 'seabassgonzalez' && (
                    <Button 
                      component={Link} 
                      to="/admin/import"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      Admin
                    </Button>
                  )}
                </>
              )}
              {user ? (
                <>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem component={Link} to={`/user/${user.username || ''}`} onClick={handleClose}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button 
                    component={Link} 
                    to="/login"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register" 
                    variant="contained"
                    sx={{ 
                      ml: 1,
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          mt: '80px', // Account for fixed AppBar
        }}
      >
        {children}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;