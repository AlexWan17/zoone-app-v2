
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextProvider';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Store, User, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'consumidor' | 'lojista'>('consumidor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'form' | 'success' | 'error'>('form');
  const { register, supbaseConnected } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get('tipo') as 'lojista' | 'consumidor' | null;
  
  useEffect(() => {
    if (tipo && (tipo === 'lojista' || tipo === 'consumidor')) {
      setAccountType(tipo);
    }
  }, [tipo]);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não conferem. Por favor, verifique.",
        variant: "destructive",
      });
      return false;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      console.log('Submetendo cadastro:', { email, accountType });
      
      await register(email, password, accountType);
      
      setRegistrationStep('success');
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      setRegistrationStep('error');
      
      // Voltar ao formulário após 5 segundos em caso de erro
      setTimeout(() => {
        setRegistrationStep('form');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-dark mb-4">
              Cadastro Realizado com Sucesso! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Enviamos um email de confirmação para <strong>{email}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                📧 <strong>Importante:</strong> Verifique sua caixa de entrada e confirme seu email antes de fazer login.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Você será redirecionado para a página de login automaticamente...
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="mt-4 bg-gradient-to-r from-primary to-primary-dark"
            >
              Ir para Login Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registrationStep === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4 py-12">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-dark mb-4">
              Erro no Cadastro
            </h1>
            <p className="text-gray-600 mb-6">
              Houve um problema ao criar sua conta. Tente novamente ou entre em contato com o suporte.
            </p>
            <Button
              onClick={() => setRegistrationStep('form')}
              className="bg-gradient-to-r from-primary to-primary-dark"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Cadastre-se na Zoone
          </h1>
          <p className="text-gray-600">
            Junte-se à revolução do varejo inteligente
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
            {/* Seletor de Tipo de Conta */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-dark mb-4 text-center">
                Escolha seu tipo de conta
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={accountType === 'consumidor' ? 'default' : 'outline'}
                  className={`h-20 flex-col space-y-2 ${
                    accountType === 'consumidor' 
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' 
                      : 'border-2 hover:border-primary'
                  }`}
                  onClick={() => setAccountType('consumidor')}
                >
                  <User className="w-6 h-6" />
                  <span className="font-medium">Consumidor</span>
                </Button>
                <Button
                  type="button"
                  variant={accountType === 'lojista' ? 'default' : 'outline'}
                  className={`h-20 flex-col space-y-2 ${
                    accountType === 'lojista' 
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' 
                      : 'border-2 hover:border-primary'
                  }`}
                  onClick={() => setAccountType('lojista')}
                >
                  <Store className="w-6 h-6" />
                  <span className="font-medium">Lojista</span>
                </Button>
              </div>
              
              {/* Indicador visual do tipo selecionado */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Você está se cadastrando como: 
                    <span className="text-primary font-bold ml-1">
                      {accountType === 'consumidor' ? '🛍️ Consumidor' : '🏪 Lojista'}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {accountType === 'consumidor' 
                    ? 'Você poderá buscar produtos e fazer compras'
                    : 'Você poderá gerenciar sua loja e produtos'
                  }
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-dark mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-dark mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-dark mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite a senha novamente"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg transition-all duration-200 py-3"
                disabled={isSubmitting || !supbaseConnected}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  `Criar Conta como ${accountType === 'consumidor' ? 'Consumidor' : 'Lojista'}`
                )}
              </Button>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  📧 Após o cadastro, você receberá um email de confirmação.
                  <br />
                  <strong>Confirme seu email antes de fazer login!</strong>
                </p>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link to="/termos" className="text-primary hover:underline">Termos de Uso</Link> e{' '}
                <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
              </p>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
                  Fazer login
                </Link>
              </p>
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

export default Register;
