import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!username.trim() || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Attempt login
      const success = login(username, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4caf50, #2196f3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)',
                mb: 2,
              }}
            >
              <LockOutlined sx={{ fontSize: 30, color: '#fff' }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              className="gradient-text"
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Admin Login
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to access the dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(90deg, #4caf50, #2196f3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #43a047, #1e88e5)',
                },
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Test Account: admin / password123
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;