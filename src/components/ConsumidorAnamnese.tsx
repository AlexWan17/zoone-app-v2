
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContextProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface AnamneseData {
  preferencias_categorias?: string[];
  restricoes_alimentares?: string[];
  estilo_vida?: string;
  objetivo_compras?: string;
  frequencia_compras?: string;
  orcamento_mensal?: number;
  preferencias_entrega?: string;
  horarios_preferidos?: string;
}

interface ConsumidorAnamneseProps {
  onUpdate?: () => void;
}

const ConsumidorAnamnese: React.FC<ConsumidorAnamneseProps> = ({ onUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [anamneseData, setAnamneseData] = useState<AnamneseData>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados para arrays
  const [newCategoria, setNewCategoria] = useState('');
  const [newRestricao, setNewRestricao] = useState('');

  useEffect(() => {
    if (user) {
      fetchAnamneseData();
    }
  }, [user]);

  const fetchAnamneseData = async () => {
    try {
      const { data, error } = await supabase
        .from('perfis_consumidores')
        .select(`
          preferencias_categorias,
          restricoes_alimentares,
          estilo_vida,
          objetivo_compras,
          frequencia_compras,
          orcamento_mensal,
          preferencias_entrega,
          horarios_preferidos
        `)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Erro ao buscar anamnese:', error);
        return;
      }

      setAnamneseData(data || {});
    } catch (error) {
      console.error('Erro ao carregar anamnese:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('perfis_consumidores')
        .update(anamneseData)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setIsEditing(false);
      onUpdate?.();
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao salvar anamnese:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addCategoria = () => {
    if (newCategoria.trim()) {
      const categorias = anamneseData.preferencias_categorias || [];
      setAnamneseData({
        ...anamneseData,
        preferencias_categorias: [...categorias, newCategoria.trim()]
      });
      setNewCategoria('');
    }
  };

  const removeCategoria = (index: number) => {
    const categorias = anamneseData.preferencias_categorias || [];
    setAnamneseData({
      ...anamneseData,
      preferencias_categorias: categorias.filter((_, i) => i !== index)
    });
  };

  const addRestricao = () => {
    if (newRestricao.trim()) {
      const restricoes = anamneseData.restricoes_alimentares || [];
      setAnamneseData({
        ...anamneseData,
        restricoes_alimentares: [...restricoes, newRestricao.trim()]
      });
      setNewRestricao('');
    }
  };

  const removeRestricao = (index: number) => {
    const restricoes = anamneseData.restricoes_alimentares || [];
    setAnamneseData({
      ...anamneseData,
      restricoes_alimentares: restricoes.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="animate-pulse">Carregando preferências...</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Suas Preferências e Estilo de Vida</CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Editar Preferências
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-violet-gradient"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categorias Preferidas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorias de Interesse
          </label>
          {isEditing ? (
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCategoria}
                  onChange={(e) => setNewCategoria(e.target.value)}
                  placeholder="Ex: Eletrônicos, Roupas, Casa"
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={(e) => e.key === 'Enter' && addCategoria()}
                />
                <Button onClick={addCategoria} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(anamneseData.preferencias_categorias || []).map((categoria, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {categoria}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeCategoria(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(anamneseData.preferencias_categorias || []).map((categoria, index) => (
                <Badge key={index} variant="secondary">{categoria}</Badge>
              ))}
              {(!anamneseData.preferencias_categorias || anamneseData.preferencias_categorias.length === 0) && (
                <p className="text-gray-500 text-sm">Nenhuma categoria selecionada</p>
              )}
            </div>
          )}
        </div>

        {/* Restrições Alimentares */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restrições Alimentares
          </label>
          {isEditing ? (
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRestricao}
                  onChange={(e) => setNewRestricao(e.target.value)}
                  placeholder="Ex: Vegetariano, Sem glúten, Sem lactose"
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={(e) => e.key === 'Enter' && addRestricao()}
                />
                <Button onClick={addRestricao} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(anamneseData.restricoes_alimentares || []).map((restricao, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {restricao}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeRestricao(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(anamneseData.restricoes_alimentares || []).map((restricao, index) => (
                <Badge key={index} variant="secondary">{restricao}</Badge>
              ))}
              {(!anamneseData.restricoes_alimentares || anamneseData.restricoes_alimentares.length === 0) && (
                <p className="text-gray-500 text-sm">Nenhuma restrição informada</p>
              )}
            </div>
          )}
        </div>

        {/* Estilo de Vida */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estilo de Vida
          </label>
          {isEditing ? (
            <select
              value={anamneseData.estilo_vida || ''}
              onChange={(e) => setAnamneseData({ ...anamneseData, estilo_vida: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Selecione seu estilo de vida</option>
              <option value="sedentario">Sedentário</option>
              <option value="ativo">Ativo</option>
              <option value="muito_ativo">Muito Ativo</option>
              <option value="atleta">Atleta</option>
            </select>
          ) : (
            <p className="text-gray-dark">{anamneseData.estilo_vida || 'Não informado'}</p>
          )}
        </div>

        {/* Objetivo das Compras */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Principal Objetivo ao Comprar
          </label>
          {isEditing ? (
            <select
              value={anamneseData.objetivo_compras || ''}
              onChange={(e) => setAnamneseData({ ...anamneseData, objetivo_compras: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Selecione seu objetivo</option>
              <option value="economia">Economizar dinheiro</option>
              <option value="qualidade">Buscar qualidade</option>
              <option value="conveniencia">Conveniência</option>
              <option value="experiencia">Nova experiência</option>
            </select>
          ) : (
            <p className="text-gray-dark">{anamneseData.objetivo_compras || 'Não informado'}</p>
          )}
        </div>

        {/* Frequência de Compras */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frequência de Compras
          </label>
          {isEditing ? (
            <select
              value={anamneseData.frequencia_compras || ''}
              onChange={(e) => setAnamneseData({ ...anamneseData, frequencia_compras: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Selecione a frequência</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="quinzenal">Quinzenal</option>
              <option value="mensal">Mensal</option>
              <option value="ocasional">Ocasional</option>
            </select>
          ) : (
            <p className="text-gray-dark">{anamneseData.frequencia_compras || 'Não informado'}</p>
          )}
        </div>

        {/* Orçamento Mensal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Orçamento Mensal Aproximado (R$)
          </label>
          {isEditing ? (
            <input
              type="number"
              value={anamneseData.orcamento_mensal || ''}
              onChange={(e) => setAnamneseData({ ...anamneseData, orcamento_mensal: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ex: 500"
            />
          ) : (
            <p className="text-gray-dark">
              {anamneseData.orcamento_mensal 
                ? `R$ ${anamneseData.orcamento_mensal.toFixed(2)}`
                : 'Não informado'
              }
            </p>
          )}
        </div>

        {/* Preferências de Entrega */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferência de Entrega
          </label>
          {isEditing ? (
            <select
              value={anamneseData.preferencias_entrega || ''}
              onChange={(e) => setAnamneseData({ ...anamneseData, preferencias_entrega: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Selecione sua preferência</option>
              <option value="retirada">Prefiro retirar na loja</option>
              <option value="entrega_rapida">Entrega rápida (mesmo dia)</option>
              <option value="entrega_programada">Entrega programada</option>
              <option value="entrega_economica">Entrega mais econômica</option>
            </select>
          ) : (
            <p className="text-gray-dark">{anamneseData.preferencias_entrega || 'Não informado'}</p>
          )}
        </div>

        {/* Horários Preferidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horários Preferidos para Compras
          </label>
          {isEditing ? (
            <select
              value={anamneseData.horarios_preferidos || ''}
              onChange={(e) => setAnamneseData({ ...anamneseData, horarios_preferidos: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Selecione seu horário preferido</option>
              <option value="manha">Manhã (6h-12h)</option>
              <option value="tarde">Tarde (12h-18h)</option>
              <option value="noite">Noite (18h-22h)</option>
              <option value="madrugada">Madrugada (22h-6h)</option>
              <option value="qualquer">Qualquer horário</option>
            </select>
          ) : (
            <p className="text-gray-dark">{anamneseData.horarios_preferidos || 'Não informado'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsumidorAnamnese;
