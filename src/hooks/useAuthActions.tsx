
import { useToast } from '@/hooks/use-toast';
import { 
  checkSupabaseConnection,
  signIn, 
  signOut, 
  signUp 
} from '@/services/authService';
import { useAuthRedirect } from './useAuthRedirect';

export const useAuthActions = (setLoading: (loading: boolean) => void, supbaseConnected: boolean) => {
  const { toast } = useToast();
  const { redirectToHome } = useAuthRedirect();

  const login = async (email: string, password: string) => {
    try {
      console.log('Iniciando login para:', email);
      setLoading(true);
      
      const { session } = await signIn(email, password);
      console.log('Login bem-sucedido, sessão:', session);
      
      if (session?.user) {
        console.log('Aguardando processamento do perfil...');
        
        // O listener SIGNED_IN vai cuidar do resto
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${email}!`,
        });
      } else {
        console.error('Sessão inválida após login');
        toast({
          title: "Erro no login",
          description: "Não foi possível iniciar sessão. Tente novamente.",
          variant: "destructive",
        });
        throw new Error('Sessão inválida após login');
      }
    } catch (error: any) {
      console.error('Login failed:', error.message);
      
      // Mensagens de erro mais específicas
      let errorMessage = "Credenciais inválidas. Tente novamente.";
      
      if (error.message === 'Failed to fetch') {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Iniciando logout');
      if (!supbaseConnected) {
        redirectToHome();
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
        return;
      }

      await signOut();

      // Limpando possíveis resíduos de sessão no localStorage/sessionStorage
      // Para garantir que nenhuma sessão persistida seja restaurada
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('sb-access-token');
      sessionStorage.removeItem('supabase.auth.token');

      // Redireciona para login explicitamente, garantindo Provider desmonta
      window.location.href = "/login";
    } catch (error: any) {
      console.error('Erro no logout:', error.message);
      toast({
        title: "Erro ao desconectar",
        description: error.message === 'Failed to fetch' 
          ? 'Serviço temporariamente indisponível. Tente novamente mais tarde.'
          : "Não foi possível finalizar sua sessão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const register = async (email: string, password: string, role: 'lojista' | 'consumidor') => {
    try {
      console.log('Iniciando registro para:', email, 'como', role);
      setLoading(true);
      
      // Extrair nome do email
      const nome = email.split('@')[0];
      
      await signUp(email, password, role, nome);
      
      toast({
        title: "Cadastro iniciado com sucesso",
        description: `Verifique seu email ${email} para confirmar sua conta antes de fazer login.`,
      });
      
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      
      // Mensagens de erro mais específicas para registro
      let errorMessage = "Não foi possível criar sua conta. Tente novamente.";
      
      if (error.message === 'Failed to fetch') {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login ou usar outro email.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Por favor, insira um email válido.';
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logout,
    register
  };
};
