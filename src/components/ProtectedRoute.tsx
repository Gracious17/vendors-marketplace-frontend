import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'vendor';
  requiredAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredAdmin
}) => {
  const { user, profile, loading, initialized, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // Show loading while initializing or during auth operations
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && profile.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's role
    const redirectPath = profile.role === 'client' ? '/dashboard/client' : '/dashboard/vendor';
    return <Navigate to={redirectPath} replace />;
  }

  // Check admin access
  if (requiredAdmin && !profile.is_admin) {
    // If admin access is required but user is not an admin, redirect to appropriate dashboard
    const redirectPath = profile.role === 'client' ? '/dashboard/client' : '/dashboard/vendor';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;