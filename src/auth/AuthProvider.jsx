import * as React from "react";
import { AuthContext } from "./AuthContext";
import { authApi } from "../api/authApi";

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Check if user is already authenticated on mount
  React.useEffect(() => {
    const initializeAuth = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get current user:', error);
          // Token might be invalid, clear it
          await authApi.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signin = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      await authApi.login(username, password);
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      await authApi.register(username, password);
      // Auto-login after registration
      return await signin(username, password);
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signin,
    register,
    signout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };