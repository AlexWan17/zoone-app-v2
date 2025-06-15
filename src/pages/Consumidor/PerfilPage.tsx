import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContextProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Edit3, Save, X, Phone, MapPin, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import ConsumidorAnamnese from '@/components/ConsumidorAnamnese';
import ConsumidorAccountMenu from "@/components/ConsumidorAccountMenu";

interface ConsumidorData {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  avatar_url?: string;
}

const PerfilPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [consumidorData, setConsumidorData] = useState<ConsumidorData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ConsumidorData>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    data_nascimento: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConsumidorData();
    }
  }, [user]);

  const fetchConsumidorData = async () => {
    try {
      const { data, error } = await supabase
        .from('perfis_consumidores')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do consumidor:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seus dados.",
          variant: "destructive",
        });
        return;
      }

      setConsumidorData(data);
      setFormData(data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('perfis_consumidores')
        .update({
          nome: formData.nome.trim(),
          telefone: formData.telefone?.trim() || null,
          endereco: formData.endereco?.trim() || null,
          data_nascimento: formData.data_nascimento || null
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setConsumidorData(formData);
      setIsEditing(false);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(consumidorData || { nome: '', email: '', telefone: '', endereco: '', data_nascimento: '' });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-light py-8">
        <div className="max-w-5xl mx-auto px-2 flex flex-col md:flex-row gap-6">
          {/* Account menu lateral */}
          <div className="md:w-1/3 w-full">
            <ConsumidorAccountMenu />
          </div>
          {/* Conteúdo principal */}
          <div className="md:w-2/3 w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-dark mb-2">Meu Perfil</h1>
              <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-violet-gradient"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Seu nome completo"
                    />
                  ) : (
                    <p className="text-gray-dark">{consumidorData?.nome || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-mail
                  </label>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Para alterar seu e-mail, entre em contato com o suporte
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.telefone || ''}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Seu telefone"
                    />
                  ) : (
                    <p className="text-gray-dark">{consumidorData?.telefone || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Endereço
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.endereco || ''}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Seu endereço"
                    />
                  ) : (
                    <p className="text-gray-dark">{consumidorData?.endereco || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data de Nascimento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.data_nascimento || ''}
                      onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-gray-dark">
                      {consumidorData?.data_nascimento 
                        ? new Date(consumidorData.data_nascimento).toLocaleDateString('pt-BR')
                        : 'Não informado'
                      }
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Componente de Anamnese */}
            <ConsumidorAnamnese onUpdate={fetchConsumidorData} />

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={logout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Sair da conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PerfilPage;
