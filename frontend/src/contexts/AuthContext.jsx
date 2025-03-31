import { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Test admin credentials
const TEST_ADMIN = {
  username: 'admin',
  password: 'password123',
  role: 'admin'
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('finsentinal_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (username, password) => {
    // Check against test credentials
    if (username === TEST_ADMIN.username && password === TEST_ADMIN.password) {
      const user = {
        username: TEST_ADMIN.username,
        role: TEST_ADMIN.role
      };
      
      // Store user in state and localStorage
      setCurrentUser(user);
      localStorage.setItem('finsentinal_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('finsentinal_user');
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}