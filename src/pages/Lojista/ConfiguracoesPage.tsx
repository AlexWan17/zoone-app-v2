
import { useState } from 'react';
import LojistaLayout from '@/components/LojistaLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import RegrasFreteForm from '@/components/configuracoes/RegrasFreteForm';
import UsuariosLoja from '@/components/configuracoes/UsuariosLoja';
import PromocoesForm from '@/components/configuracoes/PromocoesForm';
import StripeIntegration from '@/components/configuracoes/StripeIntegration';

const ConfiguracoesPage = () => {
  const [activeTab, setActiveTab] = useState("regras_frete");
  const { toast } = useToast();

  return (
    <LojistaLayout title="Configurações">
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="regras_frete">Regras de Frete</TabsTrigger>
              <TabsTrigger value="promocoes">Promoções</TabsTrigger>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="integracao">Integração</TabsTrigger>
            </TabsList>
            
            <TabsContent value="regras_frete">
              <RegrasFreteForm />
            </TabsContent>
            
            <TabsContent value="promocoes">
              <PromocoesForm />
            </TabsContent>
            
            <TabsContent value="usuarios">
              <UsuariosLoja />
            </TabsContent>
            
            <TabsContent value="integracao">
              <StripeIntegration />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </LojistaLayout>
  );
};

export default ConfiguracoesPage;
