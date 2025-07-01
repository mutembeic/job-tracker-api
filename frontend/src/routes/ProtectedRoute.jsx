import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const token = localStorage.getItem('access_token');

  if (!token) return <Navigate to="/" replace />;
  return children;
}
