
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  stripe_account_id: z.string().min(1, {
    message: "ID da conta Stripe é obrigatório."
  }),
  stripe_publishable_key: z.string().min(1, {
    message: "Chave publicável da Stripe é obrigatória."
  }),
  stripe_secret_key: z.string().min(1, {
    message: "Chave secreta da Stripe é obrigatória."
  }),
});

const StripeIntegration = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stripe_account_id: "",
      stripe_publishable_key: "",
      stripe_secret_key: "",
    },
  });

  const handleConnect = async (values: z.infer<typeof formSchema>) => {
    try {
      // In a real app, this would call an API to save the Stripe credentials
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(true);
      
      toast({
        title: "Integração concluída",
        description: "Sua conta Stripe foi conectada com sucesso!",
      });
    } catch (error) {
      console.error("Error connecting Stripe:", error);
      toast({
        title: "Erro",
        description: "Não foi possível conectar à Stripe. Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      // In a real app, this would call an API to remove the Stripe credentials
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsConnected(false);
      form.reset({
        stripe_account_id: "",
        stripe_publishable_key: "",
        stripe_secret_key: "",
      });
      
      toast({
        title: "Desconexão concluída",
        description: "Sua conta Stripe foi desconectada com sucesso.",
      });
    } catch (error) {
      console.error("Error disconnecting Stripe:", error);
      toast({
        title: "Erro",
        description: "Não foi possível desconectar da Stripe. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Integração com Stripe</h2>
        {isConnected && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Conectado
          </Badge>
        )}
      </div>
      
      <p className="text-gray-600">
        Conecte sua conta Stripe para processar pagamentos online. Esta integração é necessária para receber pagamentos dos seus clientes através da plataforma Zoone.AI.
      </p>
      
      {isConnected ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Conta Stripe Conectada</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ID da conta: ••••{form.getValues().stripe_account_id.slice(-4)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleDisconnect}>
                    Desconectar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Importante: Modo de Teste</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Sua conta Stripe está configurada em modo de teste. Para processar pagamentos reais, você precisará ativar o modo de produção no painel da Stripe.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Próximos Passos</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Conectar ao Zoone.AI</h4>
                  <p className="text-sm text-gray-600">Sua conta Stripe está conectada à plataforma.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Configurar webhooks</h4>
                  <p className="text-sm text-gray-600">Configure webhooks no painel da Stripe para manter o status dos pagamentos atualizado.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Ativar modo de produção</h4>
                  <p className="text-sm text-gray-600">Quando estiver pronto para aceitar pagamentos reais, ative o modo de produção no painel da Stripe.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleConnect)} className="space-y-4">
            <FormField
              control={form.control}
              name="stripe_account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID da Conta Stripe*</FormLabel>
                  <FormControl>
                    <Input placeholder="acct_..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stripe_publishable_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave Publicável da Stripe*</FormLabel>
                  <FormControl>
                    <Input placeholder="pk_test_..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stripe_secret_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave Secreta da Stripe*</FormLabel>
                  <FormControl>
                    <Input placeholder="sk_test_..." type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">
                    Suas chaves secretas são armazenadas com segurança e nunca são expostas publicamente.
                  </p>
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Conectar Stripe
              </Button>
            </div>
          </form>
        </Form>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Não tem uma conta Stripe?</h3>
        <p className="text-sm text-gray-600 mb-3">
          É necessário ter uma conta Stripe para processar pagamentos. Crie uma conta gratuitamente no site da Stripe.
        </p>
        <Button variant="outline" className="w-full" asChild>
          <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer">
            Criar Conta Stripe
          </a>
        </Button>
      </div>
    </div>
  );
};

export default StripeIntegration;
