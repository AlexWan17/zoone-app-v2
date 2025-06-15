
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  getCurrentSession,
  getUserProfile,
  signOut,
  subscribeToAuthChanges,
  createUserProfile
} from '@/services/authService';
import { useAuthRedirect } from './useAuthRedirect';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { redirectUserBasedOnRole, redirectToHome } = useAuthRedirect();

  const checkSession = useCallback(async () => {
    try {
      console.log('Verificando sessão atual...');
      const { data: { session }, error } = await getCurrentSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error.message);
        setLoading(false);
        return;
      }
      
      console.log('Sessão recuperada:', session);
      
      if (session?.user) {
        console.log('Usuário encontrado na sessão, buscando perfil...');
        
        // Aguardar um momento para garantir que os dados estão disponíveis
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = await getUserProfile(session.user.id);
        
        console.log('Perfil do usuário recuperado:', userData);
        
        if (userData) {
          const userObject: User = {
            id: session.user.id,
            email: session.user.email!,
            role: userData.role,
          };
          
          console.log('Definindo usuário no contexto:', userObject);
          setUser(userObject);
          
          // Redirecionar baseado no tipo de usuário
          redirectUserBasedOnRole(userData.role);
        } else {
          console.log('Perfil do usuário não encontrado, removendo da sessão');
          setUser(null);
          await signOut();
        }
      } else {
        console.log('Nenhuma sessão de usuário encontrada');
        setUser(null);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Erro ao verificar sessão:', error.message);
      setLoading(false);
    }
  }, [redirectUserBasedOnRole]);

  const setupAuthListener = useCallback(() => {
    const { data: authListener } = subscribeToAuthChanges(async (event, session) => {
      console.log('Evento de autenticação:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        // Aguardar um momento para os dados serem persistidos
        setTimeout(async () => {
          try {
            console.log('Usuário logado, verificando/criando perfil para:', session.user.id);
            
            // Primeiro verifica se o perfil já existe
            let userData = await getUserProfile(session.user.id);
            
            // Se não existe perfil, criar baseado nos metadados
            if (!userData && session.user.user_metadata) {
              const { role, nome } = session.user.user_metadata;
              
              if (role && (role === 'lojista' || role === 'consumidor')) {
                console.log('Criando perfil baseado nos metadados:', { role, nome });
                
                try {
                  await createUserProfile(
                    session.user.id,
                    session.user.email!,
                    role,
                    nome || session.user.email!.split('@')[0]
                  );
                  
                  // Buscar o perfil novamente após criação
                  userData = { role };
                  
                  toast({
                    title: "Conta criada com sucesso!",
                    description: `Bem-vindo à Zoone.AI!`,
                  });
                  
                } catch (profileError: any) {
                  console.error('Erro ao criar perfil:', profileError);
                  toast({
                    title: "Erro ao criar perfil",
                    description: "Houve um problema ao configurar sua conta. Entre em contato com o suporte.",
                    variant: "destructive",
                  });
                  await signOut();
                  return;
                }
              }
            }
            
            console.log('Perfil recuperado/criado após login:', userData);
            
            if (userData) {
              const userObject: User = {
                id: session.user.id,
                email: session.user.email!,
                role: userData.role,
              };
              
              console.log('Atualizando usuário no contexto após login:', userObject);
              setUser(userObject);
              
              // Redirecionar baseado no tipo de usuário
              redirectUserBasedOnRole(userData.role);
            } else {
              console.log('Nenhum perfil encontrado e não foi possível criar');
              setUser(null);
              await signOut();
              toast({
                title: "Erro no login",
                description: "Perfil de usuário não encontrado. Entre em contato com o suporte.",
                variant: "destructive",
              });
            }
          } catch (error: any) {
            console.error('Erro ao processar login:', error.message);
          } finally {
            setLoading(false);
          }
        }, 2000);
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuário deslogado');
        setUser(null);
        setLoading(false);
        // Redirecionar para a página inicial ao fazer logout
        redirectToHome();
      }
    });
    
    return authListener;
  }, [toast, redirectUserBasedOnRole, redirectToHome]);

  return {
    user,
    loading,
    setUser,
    setLoading,
    checkSession,
    setupAuthListener
  };
};
