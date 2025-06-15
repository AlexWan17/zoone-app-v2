
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUserBasedOnRole = useCallback((userRole: 'lojista' | 'consumidor') => {
    // Não redirecionar se estiver na página de login ou registro
    if (location.pathname === '/login' || location.pathname === '/registrar') {
      if (userRole === 'lojista') {
        navigate('/lojista/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [navigate, location.pathname]);

  const redirectToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    redirectUserBasedOnRole,
    redirectToHome
  };
};
