import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute: Gated access for authenticated users.
 * Redirects to /login if the session is not valid.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' }}>Restoring Session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * PublicRoute: Gated access for unauthenticated users (Auth pages).
 * Redirects to /home if a session already exists.
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return null; // Silent load for public routes
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
