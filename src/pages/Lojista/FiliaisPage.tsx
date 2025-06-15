
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, MapPin, Phone, Mail, Trash2 } from 'lucide-react';
import LojistaLayout from '@/components/LojistaLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { useToast } from '@/hooks/use-toast';
import FilialFormModal from '@/components/loja/FilialFormModal';
import { Filial } from '@/types';

const FiliaisPage = () => {
  const { user } = useAuthOptimized();
  const { toast } = useToast();
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilial, setCurrentFilial] = useState<Filial | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchFiliais();
    }
  }, [user]);

  const fetchFiliais = async () => {
    setIsLoading(true);
    try {
      // Buscar lojista_id primeiro
      const { data: lojista, error: lojistaError } = await supabase
        .from('perfis_lojistas')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (lojistaError) throw lojistaError;

      // Buscar filiais do lojista
      const { data: filiaisData, error: filiaisError } = await supabase
        .from('filiais')
        .select('*')
        .eq('lojista_id', lojista.id)
        .order('criado_em', { ascending: false });

      if (filiaisError) throw filiaisError;

      setFiliais(filiaisData || []);
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as filiais.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (filial?: Filial) => {
    setCurrentFilial(filial || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFilial(null);
  };

  const handleSaveFilial = async (filial: Filial) => {
    try {
      // Buscar lojista_id
      const { data: lojista, error: lojistaError } = await supabase
        .from('perfis_lojistas')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (lojistaError) throw lojistaError;

      if (filial.id) {
        // Atualizar filial existente
        const { error } = await supabase
          .from('filiais')
          .update({
            nome_filial: filial.nome_filial,
            endereco: filial.endereco,
            latitude: filial.latitude,
            longitude: filial.longitude,
            telefone_filial: filial.telefone_filial,
            email_filial: filial.email_filial,
            atualizado_em: new Date().toISOString(),
          })
          .eq('id', filial.id);

        if (error) throw error;

        toast({
          title: 'Filial atualizada',
          description: 'Filial atualizada com sucesso.',
        });
      } else {
        // Criar nova filial
        const { error } = await supabase
          .from('filiais')
          .insert([{
            lojista_id: lojista.id,
            nome_filial: filial.nome_filial,
            endereco: filial.endereco,
            latitude: filial.latitude,
            longitude: filial.longitude,
            telefone_filial: filial.telefone_filial,
            email_filial: filial.email_filial,
          }]);

        if (error) throw error;

        toast({
          title: 'Filial adicionada',
          description: 'Nova filial adicionada com sucesso.',
        });
      }

      handleCloseModal();
      fetchFiliais(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao salvar filial:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a filial.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFilial = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta filial?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('filiais')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Filial removida',
        description: 'Filial removida com sucesso.',
      });

      fetchFiliais(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao excluir filial:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a filial.',
        variant: 'destructive',
      });
    }
  };

  return (
    <LojistaLayout title="Filiais">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Suas Filiais</h2>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Filial
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filiais.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filiais.map((filial) => (
              <Card key={filial.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {filial.nome_filial}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenModal(filial)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteFilial(filial.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{filial.endereco}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{filial.telefone_filial}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{filial.email_filial}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma filial cadastrada</h3>
            <p className="text-gray-500 mb-4">Adicione sua primeira filial para começar.</p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Filial
            </Button>
          </div>
        )}

        {isModalOpen && (
          <FilialFormModal 
            filial={currentFilial} 
            onClose={handleCloseModal} 
            onSave={handleSaveFilial} 
          />
        )}
      </div>
    </LojistaLayout>
  );
};

export default FiliaisPage;
