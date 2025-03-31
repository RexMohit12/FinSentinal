import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import ManualInput from './pages/ManualInput';
import AutomatedInput from './pages/AutomatedInput';
import Results from './pages/Results';
import Login from './pages/Login';

// Components
import WelcomeAnimation from './components/WelcomeAnimation';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [results, setResults] = useState([]);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  
  // Function to add new result to the results array
  const addResult = (result) => {
    setResults(prev => [result, ...prev]);
  };
  
  // Function to handle when welcome animation completes
  const handleAnimationComplete = () => {
    setShowWelcomeAnimation(false);
  };

  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Welcome Animation */}
        {showWelcomeAnimation && <WelcomeAnimation onComplete={handleAnimationComplete} />}
        
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Main layout routes - accessible to all users */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="manual-input" element={<ManualInput addResult={addResult} />} />
            <Route path="automated-input" element={<AutomatedInput addResult={addResult} />} />
            
            {/* Protected routes - only accessible to admin users */}
            <Route path="results" element={
              <ProtectedRoute>
                <Results results={results} />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;