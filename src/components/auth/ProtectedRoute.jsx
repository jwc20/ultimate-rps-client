import React from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Since we auto-generate users, this should always have a user
  // But keep this as a safety check
  return user ? <Outlet /> : <div>Error: Unable to initialize user</div>;
};

export default ProtectedRoute;
