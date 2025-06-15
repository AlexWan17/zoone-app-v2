
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from '@/types/authTypes';
import { checkSupabaseConnection } from '@/services/authService';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthActions } from '@/hooks/useAuthActions';

// Criação do contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supbaseConnected, setSupabaseConnected] = useState(true);
  const { toast } = useToast();
  
  // Usar hooks customizados para gerenciar estado e ações
  const {
    user,
    loading,
    setLoading,
    checkSession,
    setupAuthListener
  } = useAuthSession();
  
  const { login, logout, register } = useAuthActions(setLoading, supbaseConnected);

  useEffect(() => {
    // Testar a conexão com o Supabase
    const checkConnection = async () => {
      const connected = await checkSupabaseConnection();
      setSupabaseConnected(connected);
      
      if (!connected) {
        toast({
          title: "Serviço temporariamente indisponível",
          description: "Não foi possível conectar ao serviço de autenticação. Tente novamente mais tarde.",
          variant: "destructive",
          duration: 5000,
        });
        setLoading(false);
        return;
      }
      
      checkSession();
    };
    
    checkConnection();
    
    // Configurar listener para mudanças na autenticação
    const authListener = setupAuthListener();
    
    return () => {
      console.log('Limpando listener de autenticação');
      authListener.subscription.unsubscribe();
    };
  }, [toast, checkSession, setupAuthListener, setLoading]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      supbaseConnected, 
      login, 
      logout, 
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};
