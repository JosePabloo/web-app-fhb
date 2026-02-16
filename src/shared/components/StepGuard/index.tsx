import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface StepGuardProps {
  validateState: (state: Record<string, unknown> | null) => boolean;
  fallbackPath: string;
  children: React.ReactNode;
}

export default function StepGuard({ validateState, fallbackPath, children }: StepGuardProps) {
  const location = useLocation();
  
  if (!validateState(location.state)) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return <>{children}</>;
}
