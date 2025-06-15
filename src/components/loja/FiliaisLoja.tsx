
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Map, Edit, Trash2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FilialFormModal from '@/components/loja/FilialFormModal';
import { Filial } from '@/types';
import MapComponent from '@/components/Map';

const FiliaisLoja = () => {
  const { toast } = useToast();
  const [filiais, setFiliais] = useState<Filial[]>([
    {
      id: "1",
      lojista_id: "1",
      nome_filial: "Loja Central",
      endereco: "Av. Paulista, 1000, São Paulo - SP",
      latitude: -23.5641,
      longitude: -46.6527,
      telefone_filial: "(11) 99999-8888",
      email_filial: "central@minhaloja.com",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    },
    {
      id: "2",
      lojista_id: "1",
      nome_filial: "Loja Shopping",
      endereco: "Shopping Ibirapuera, Av. Ibirapuera, 3000, São Paulo - SP",
      latitude: -23.6018,
      longitude: -46.6682,
      telefone_filial: "(11) 99999-7777",
      email_filial: "shopping@minhaloja.com",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilial, setCurrentFilial] = useState<Filial | null>(null);
  const [selectedFilialId, setSelectedFilialId] = useState<string | null>(null);

  const handleOpenModal = (filial?: Filial) => {
    if (filial) {
      setCurrentFilial(filial);
    } else {
      setCurrentFilial(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFilial(null);
  };

  const handleSaveFilial = (filial: Filial) => {
    if (filial.id) {
      // Update existing filial
      setFiliais(filiais.map(f => f.id === filial.id ? filial : f));
      toast({
        title: "Filial atualizada",
        description: "Filial atualizada com sucesso.",
      });
    } else {
      // Add new filial
      const newFilial = {
        ...filial,
        id: Date.now().toString(),
        lojista_id: "1",
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };
      setFiliais([...filiais, newFilial]);
      toast({
        title: "Filial adicionada",
        description: "Nova filial adicionada com sucesso.",
      });
    }
    handleCloseModal();
  };

  const handleDeleteFilial = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta filial?")) {
      setFiliais(filiais.filter(f => f.id !== id));
      toast({
        title: "Filial removida",
        description: "Filial removida com sucesso.",
      });
    }
  };

  const handleFilialClick = (filial: Filial) => {
    setSelectedFilialId(filial.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Filiais</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Filial
        </Button>
      </div>
      
      <Card className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Visualização no Mapa</h3>
          <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
            <MapComponent 
              filiais={filiais} 
              height="300px" 
              onFilialClick={handleFilialClick}
              selectedFilialId={selectedFilialId || undefined}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Clique nos marcadores para selecionar uma filial.
          </p>
        </div>
      </Card>
      
      {filiais.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filial</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filiais.map((filial) => (
                <TableRow key={filial.id} className={selectedFilialId === filial.id ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium">{filial.nome_filial}</TableCell>
                  <TableCell>{filial.endereco}</TableCell>
                  <TableCell>
                    <div>{filial.telefone_filial}</div>
                    <div className="text-sm text-gray-500">{filial.email_filial}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenModal(filial)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteFilial(filial.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Map className="h-12 w-12 mx-auto text-gray-400 mb-3" />
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
  );
};

export default FiliaisLoja;
