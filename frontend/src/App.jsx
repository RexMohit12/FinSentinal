import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ManualInput from './pages/ManualInput';
import AutomatedInput from './pages/AutomatedInput';
import Results from './pages/Results';

function App() {
  const [results, setResults] = useState([]);
  
  // Function to add new result to the results array
  const addResult = (result) => {
    setResults(prev => [result, ...prev]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="manual-input" element={<ManualInput addResult={addResult} />} />
          <Route path="automated-input" element={<AutomatedInput addResult={addResult} />} />
          <Route path="results" element={<Results results={results} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;