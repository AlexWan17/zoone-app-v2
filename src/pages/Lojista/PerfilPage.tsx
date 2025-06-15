
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContextProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Edit3, Save, X, Phone, MapPin, Building, Users, FileText, Clock, Star } from 'lucide-react';
import Layout from '@/components/Layout';

interface LojistaData {
  nome_loja: string;
  nome_responsavel: string;
  email_contato: string;
  telefone?: string;
  cnpj?: string;
  endereco_sede?: string;
  descricao_loja?: string;
  especialidades?: string[];
  horario_funcionamento?: string;
  dias_funcionamento?: string[];
  tempo_mercado?: number;
  numero_funcionarios?: number;
  certificacoes?: string[];
  forma_pagamento_aceitas?: string[];
  politicas_entrega?: string;
  sobre_empresa?: string;
  logo_url?: string;
}

const PerfilPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [lojistaData, setLojistaData] = useState<LojistaData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<LojistaData>({
    nome_loja: '',
    nome_responsavel: '',
    email_contato: '',
    telefone: '',
    cnpj: '',
    endereco_sede: '',
    descricao_loja: '',
    especialidades: [],
    horario_funcionamento: '',
    dias_funcionamento: [],
    tempo_mercado: 0,
    numero_funcionarios: 0,
    certificacoes: [],
    forma_pagamento_aceitas: [],
    politicas_entrega: '',
    sobre_empresa: '',
    logo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLojistaData();
    }
  }, [user]);

  const fetchLojistaData = async () => {
    try {
      const { data, error } = await supabase
        .from('perfis_lojistas')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do lojista:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seus dados.",
          variant: "destructive",
        });
        return;
      }

      setLojistaData(data);
      setFormData(data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !formData.nome_loja.trim()) {
      toast({
        title: "Erro",
        description: "Nome da loja é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('perfis_lojistas')
        .update({
          nome_loja: formData.nome_loja.trim(),
          nome_responsavel: formData.nome_responsavel.trim(),
          telefone: formData.telefone?.trim() || null,
          cnpj: formData.cnpj?.trim() || null,
          endereco_sede: formData.endereco_sede?.trim() || null,
          descricao_loja: formData.descricao_loja?.trim() || null,
          especialidades: formData.especialidades || [],
          horario_funcionamento: formData.horario_funcionamento?.trim() || null,
          dias_funcionamento: formData.dias_funcionamento || [],
          tempo_mercado: formData.tempo_mercado || null,
          numero_funcionarios: formData.numero_funcionarios || null,
          certificacoes: formData.certificacoes || [],
          forma_pagamento_aceitas: formData.forma_pagamento_aceitas || [],
          politicas_entrega: formData.politicas_entrega?.trim() || null,
          sobre_empresa: formData.sobre_empresa?.trim() || null,
          logo_url: formData.logo_url?.trim() || null
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setLojistaData(formData);
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
    setFormData(lojistaData || {
      nome_loja: '',
      nome_responsavel: '',
      email_contato: '',
      telefone: '',
      cnpj: '',
      endereco_sede: '',
      descricao_loja: '',
      especialidades: [],
      horario_funcionamento: '',
      dias_funcionamento: [],
      tempo_mercado: 0,
      numero_funcionarios: 0,
      certificacoes: [],
      forma_pagamento_aceitas: [],
      politicas_entrega: '',
      sobre_empresa: '',
      logo_url: ''
    });
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-dark mb-2">Perfil da Loja</h1>
            <p className="text-gray-600">Gerencie as informações da sua loja e preferências</p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações da Loja
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Loja
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nome_loja}
                      onChange={(e) => setFormData({ ...formData, nome_loja: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Nome da sua loja"
                    />
                  ) : (
                    <p className="text-gray-dark">{lojistaData?.nome_loja || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Nome do Responsável
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nome_responsavel}
                      onChange={(e) => setFormData({ ...formData, nome_responsavel: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Seu nome completo"
                    />
                  ) : (
                    <p className="text-gray-dark">{lojistaData?.nome_responsavel || 'Não informado'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  E-mail de Contato
                </label>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Para alterar seu e-mail, entre em contato com o suporte
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Telefone da loja"
                    />
                  ) : (
                    <p className="text-gray-dark">{lojistaData?.telefone || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.cnpj || ''}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="00.000.000/0000-00"
                    />
                  ) : (
                    <p className="text-gray-dark">{lojistaData?.cnpj || 'Não informado'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço da Sede
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.endereco_sede || ''}
                    onChange={(e) => setFormData({ ...formData, endereco_sede: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Endereço completo da loja"
                  />
                ) : (
                  <p className="text-gray-dark">{lojistaData?.endereco_sede || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Descrição da Loja
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.descricao_loja || ''}
                    onChange={(e) => setFormData({ ...formData, descricao_loja: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Descreva sua loja e seus produtos"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-dark">{lojistaData?.descricao_loja || 'Não informado'}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Horário de Funcionamento
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.horario_funcionamento || ''}
                      onChange={(e) => setFormData({ ...formData, horario_funcionamento: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Ex: 8h às 18h"
                    />
                  ) : (
                    <p className="text-gray-dark">{lojistaData?.horario_funcionamento || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Users className="w-4 h-4 inline mr-1" />
                    Número de Funcionários
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.numero_funcionarios || ''}
                      onChange={(e) => setFormData({ ...formData, numero_funcionarios: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Quantidade de funcionários"
                    />
                  ) : (
                    <p className="text-gray-dark">{lojistaData?.numero_funcionarios || 'Não informado'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sobre a Empresa
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.sobre_empresa || ''}
                    onChange={(e) => setFormData({ ...formData, sobre_empresa: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Conte mais sobre sua empresa, missão, valores..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-dark">{lojistaData?.sobre_empresa || 'Não informado'}</p>
                )}
              </div>
            </CardContent>
          </Card>

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
    </Layout>
  );
};

export default PerfilPage;
