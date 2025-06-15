import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, MapPin, Phone, Mail, Users, Calendar, Star, FileText, Edit } from 'lucide-react';
import LojistaLayout from '@/components/LojistaLayout';
import DadosLoja from '@/components/loja/DadosLoja';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const LojaPage = () => {
  const { user } = useAuthOptimized();
  const { toast } = useToast();
  const [lojista, setLojista] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLojista = async () => {
      setIsLoading(true);
      try {
        if (user?.id) {
          // Buscar dados do perfil do lojista
          const { data: perfilData, error: perfilError } = await supabase
            .from('perfis_lojistas')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (perfilError) {
            console.error('Erro ao buscar perfil do lojista:', perfilError);
          }

          // Buscar dados básicos do lojista
          const { data: lojistaData, error: lojistaError } = await supabase
            .from('lojistas')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (lojistaError) {
            console.error('Erro ao buscar dados do lojista:', lojistaError);
          }

          // Combinar dados dos dois perfis
          const dadosCombinados = {
            ...lojistaData,
            ...perfilData,
          };

          setLojista(dadosCombinados);
        }
      } catch (error) {
        console.error('Erro ao carregar dados da loja:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLojista();
  }, [user?.id]);

  const handleSalvar = async (data: any) => {
    setIsSaving(true);
    try {
      console.log('Dados recebidos para salvar:', data);

      // Primeiro, verificar se o perfil já existe
      const { data: perfilExistente } = await supabase
        .from('perfis_lojistas')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      // Preparar dados para perfil_lojistas
      const dadosPerfil = {
        user_id: user?.id,
        nome_loja: data.nome_loja,
        nome_responsavel: data.nome_responsavel || 'Responsável',
        razao_social: data.razao_social,
        cnpj: data.cnpj,
        email_contato: data.email_contato,
        telefone: data.telefone,
        endereco_sede: data.endereco_sede,
        descricao_loja: data.descricao,
        website: data.website,
        instagram: data.instagram,
        facebook: data.facebook,
        updated_at: new Date().toISOString()
      };

      console.log('Dados do perfil a serem salvos:', dadosPerfil);

      let perfilError;
      if (perfilExistente) {
        // Atualizar perfil existente
        const { error } = await supabase
          .from('perfis_lojistas')
          .update(dadosPerfil)
          .eq('user_id', user?.id);
        perfilError = error;
      } else {
        // Criar novo perfil
        const { error } = await supabase
          .from('perfis_lojistas')
          .insert(dadosPerfil);
        perfilError = error;
      }

      if (perfilError) {
        console.error('Erro ao salvar perfil:', perfilError);
        throw perfilError;
      }

      // Atualizar tabela lojistas básica
      const { error: lojistaError } = await supabase
        .from('lojistas')
        .upsert({
          user_id: user?.id,
          nome_loja: data.nome_loja,
          email_contato: data.email_contato,
          telefone: data.telefone
        });

      if (lojistaError) {
        console.error('Erro ao salvar lojista:', lojistaError);
        throw lojistaError;
      }

      toast({
        title: "Dados salvos com sucesso!",
        description: "As informações da sua loja foram atualizadas.",
      });

      setIsEditing(false);
      
      // Recarregar dados
      window.location.reload();
      
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados da loja.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <LojistaLayout title="Minha Loja">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados da loja...</p>
          </div>
        </div>
      </LojistaLayout>
    );
  }

  if (isEditing) {
    return (
      <LojistaLayout title="Editar Loja">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Editar Informações da Loja</span>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DadosLoja 
              onSalvar={handleSalvar} 
              isLoading={isSaving}
              initialData={lojista}
            />
          </CardContent>
        </Card>
      </LojistaLayout>
    );
  }

  return (
    <LojistaLayout title="Minha Loja">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <span>{lojista?.nome_loja || 'Nome da Loja'}</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar Loja
          </Button>
        </CardHeader>
        <CardContent className="pl-2">
          <Tabs defaultValue="informacoes" className="space-y-4">
            <TabsList>
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="informacoes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Dados Básicos</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span><strong>Responsável:</strong> {lojista?.nome_responsavel || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span><strong>Razão Social:</strong> {lojista?.razao_social || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span><strong>CNPJ:</strong> {lojista?.cnpj || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span><strong>Email:</strong> {lojista?.email_contato || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span><strong>Telefone:</strong> {lojista?.telefone || 'Não informado'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Localização</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{lojista?.endereco_sede || 'Endereço não informado'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {lojista?.descricao_loja && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Descrição</h3>
                  <p className="text-sm text-gray-600">{lojista.descricao_loja}</p>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Redes Sociais</h3>
                <div className="flex space-x-4 text-sm">
                  {lojista?.website && (
                    <span><strong>Website:</strong> {lojista.website}</span>
                  )}
                  {lojista?.instagram && (
                    <span><strong>Instagram:</strong> {lojista.instagram}</span>
                  )}
                  {lojista?.facebook && (
                    <span><strong>Facebook:</strong> {lojista.facebook}</span>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-4">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Seção de documentos em desenvolvimento</p>
              </div>
            </TabsContent>

            <TabsContent value="estatisticas" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Tempo no Mercado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {lojista?.tempo_mercado || 'N/A'} anos
                    </div>
                    <p className="text-sm text-gray-500">Anos de experiência</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {lojista?.numero_funcionarios || '0'}
                    </div>
                    <p className="text-sm text-gray-500">Total de funcionários</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Data de Cadastro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {lojista?.created_at ? new Date(lojista.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                    <p className="text-sm text-gray-500">Desde quando a loja está ativa</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </LojistaLayout>
  );
};

export default LojaPage;
