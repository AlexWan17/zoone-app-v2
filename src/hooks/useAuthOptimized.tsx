
import { useAuth } from '@/context/AuthContextProvider';
import { useMemo } from 'react';

export const useAuthOptimized = () => {
  const { user, loading, supbaseConnected, login, logout, register } = useAuth();
  
  const isAuthenticated = useMemo(() => !!user, [user]);
  const isLojista = useMemo(() => user?.role === 'lojista', [user?.role]);
  const isConsumidor = useMemo(() => user?.role === 'consumidor', [user?.role]);
  const userEmail = useMemo(() => user?.email, [user?.email]);
  const userName = useMemo(() => user?.email?.split('@')[0], [user?.email]);
  
  return {
    user,
    loading,
    supbaseConnected,
    login,
    logout,
    register,
    isAuthenticated,
    isLojista,
    isConsumidor,
    userEmail,
    userName
  };
};
