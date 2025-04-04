import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Input as InputIcon,
  AutoGraph as AutoGraphIcon,
  Assessment as AssessmentIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, isAdmin, logout } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Define menu items based on authentication status
  const getMenuItems = () => {
    const items = [
      { text: 'Home', icon: <DashboardIcon />, path: '/' },
      { text: 'Manual Input', icon: <InputIcon />, path: '/manual-input' },
      { text: 'Automated Input', icon: <AutoGraphIcon />, path: '/automated-input' },
    ];
    
    // Only show Dashboard if user is admin
    if (currentUser && isAdmin()) {
      items.push({ text: 'Dashboard', icon: <AssessmentIcon />, path: '/results' });
    }
    
    return items;
  };
  
  const menuItems = getMenuItems();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1e1e1e 0%, #2d2d2d 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4caf50, #2196f3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)',
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', color: '#fff' }}
              >
                F
              </Typography>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                mr: 4,
                fontSize: '1.8rem'
              }}
              className="gradient-text"
            >
              FinSentinal
            </Typography>
          </Box>
          
          {/* Horizontal Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1.5,
                    py: 1,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: '1.25rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    backgroundColor: location.pathname === item.path ? 
                      'rgba(76, 175, 80, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          {/* Login/Logout Button */}
          <Box sx={{ ml: 'auto' }}>
            {currentUser ? (
              <Button 
                color="inherit" 
                onClick={logout}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar drawer removed as requested */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          background: theme.palette.background.default,
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;