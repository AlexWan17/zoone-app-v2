import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextProvider';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail, Lock, User, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, supbaseConnected } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha e-mail e senha.",
        variant: "destructive",
      });
      return;
    }
    
    if (!supbaseConnected) {
      toast({
        title: "Serviço indisponível",
        description: "Não foi possível conectar. Tente novamente em alguns minutos.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error: any) {
      console.error("Erro no login:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img 
              src="/lovable-uploads/864bdb4f-15fa-495b-84a7-46cd73723d35.png" 
              alt="Zoone.AI" 
              className="h-16 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-dark mb-2">
            Entrar na Zoone
          </h1>
          <p className="text-gray-600">
            Acesse sua conta e continue sua jornada
          </p>
        </div>
        
        {!supbaseConnected && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Serviço temporariamente indisponível. Tente novamente em alguns minutos.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-dark mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-dark">
                    Senha
                  </label>
                  <Link to="/esqueci-senha" className="text-sm text-primary hover:text-primary-dark transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Sua senha"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg transition-all duration-200 py-3"
                disabled={isSubmitting || !supbaseConnected}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">
                Não tem uma conta?{' '}
                <Link to="/registrar" className="text-primary hover:text-primary-dark font-medium transition-colors">
                  Cadastre-se aqui
                </Link>
              </p>
              
              {/* Informação sobre tipos de usuário */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-3">Tipos de conta disponíveis:</p>
                <div className="flex justify-center space-x-4">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Consumidor</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Store className="w-4 h-4" />
                    <span>Lojista</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
