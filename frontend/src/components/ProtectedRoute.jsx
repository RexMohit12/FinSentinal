import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes that require admin authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  
  // If user is not logged in or is not an admin, redirect to login page
  if (!currentUser || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in and is an admin, render the children
  return children;
};

export default ProtectedRoute;