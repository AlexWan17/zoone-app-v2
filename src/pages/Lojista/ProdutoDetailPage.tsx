import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LojistaLayout from '@/components/LojistaLayout';
import ProductForm from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Produto, Filial, EstoqueFilial } from '@/types';
import { ArrowLeft } from 'lucide-react';

const ProdutoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [estoque, setEstoque] = useState<EstoqueFilial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch filiais
        const filiaisData = await api.getFiliais();
        setFiliais(filiaisData);
        
        if (id && id !== 'new') {
          // Fetch existing produto
          const produtoData = await api.getProdutoById(id);
          if (produtoData) {
            setProduto(produtoData);
            
            // Fetch estoque for this produto
            const estoqueData = await api.getEstoqueProduto(id);
            setEstoque(estoqueData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do produto.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, toast]);

  const handleSave = async (produtoData: Partial<Produto>, estoqueData: Partial<EstoqueFilial>[]) => {
    setIsSaving(true);
    try {
      // Mock saving produto
      if (id && id !== 'new') {
        // Update existing produto
        const updatedProduto = {
          ...produto,
          ...produtoData,
          atualizado_em: new Date().toISOString(),
        } as Produto;
        
        setProduto(updatedProduto);
        
        // Update estoque
        const updatedEstoque = estoqueData.map(item => ({
          id: estoque.find(e => e.filial_id === item.filial_id)?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          produto_id: id,
          filial_id: item.filial_id!,
          quantidade: item.quantidade || 0,
          preco: item.preco || 0,
          reservavel: item.reservavel || false,
          tempo_max_reserva: item.tempo_max_reserva || 24,
          desconto_min: item.desconto_min || 0,
          desconto_max: item.desconto_max || 0,
          localizacao_fisica: item.localizacao_fisica || "",
          atualizado_em: new Date().toISOString(),
        }));
        
        setEstoque(updatedEstoque);
        
        toast({
          title: "Sucesso",
          description: "Produto e estoque atualizados com sucesso!",
        });
      } else {
        // Create new produto with all required fields
        const newProduto: Produto = {
          id: Date.now().toString(),
          lojista_id: "1", // Assume lojista ID 1 for demo
          nome: produtoData.nome!,
          descricao: produtoData.descricao!,
          categoria_id: produtoData.categoria_id!,
          codigo_barras: produtoData.codigo_barras,
          marca: produtoData.marca,
          modelo: produtoData.modelo,
          peso: produtoData.peso,
          dimensoes: produtoData.dimensoes,
          tags: produtoData.tags,
          imagem_url: produtoData.imagem_url!,
          ativo: true,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
          // Add required new fields
          preco_venda: produtoData.preco_venda || 0,
          promocao_ativa: produtoData.promocao_ativa || false,
          token_zoone_ativo: produtoData.token_zoone_ativo || false,
          reservavel: produtoData.reservavel || false,
          entrega_disponivel: produtoData.entrega_disponivel || false,
          retirada_loja: produtoData.retirada_loja ?? true,
          status_venda: produtoData.status_venda || 'ativo',
          desconto_percentual: produtoData.desconto_percentual,
          tempo_reserva_em_minutos: produtoData.tempo_reserva_em_minutos,
          erp_integrado: produtoData.erp_integrado,
          dados_gs1: produtoData.dados_gs1,
          tamanhos_disponiveis: produtoData.tamanhos_disponiveis,
          cores_disponiveis: produtoData.cores_disponiveis,
          tipo_tecido: produtoData.tipo_tecido
        };
        
        setProduto(newProduto);
        
        // Create estoque entries
        const newEstoque = estoqueData.map(item => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          produto_id: newProduto.id,
          filial_id: item.filial_id!,
          quantidade: item.quantidade || 0,
          preco: item.preco || 0,
          reservavel: item.reservavel || false,
          tempo_max_reserva: item.tempo_max_reserva || 24,
          desconto_min: item.desconto_min || 0,
          desconto_max: item.desconto_max || 0,
          localizacao_fisica: item.localizacao_fisica || "",
          atualizado_em: new Date().toISOString(),
        }));
        
        setEstoque(newEstoque);
        
        // Redirect to the product's page
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
        });
        
        navigate(`/lojista/produtos/${newProduto.id}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o produto.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <LojistaLayout title="Carregando...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </LojistaLayout>
    );
  }

  return (
    <LojistaLayout title={id && id !== 'new' ? "Editar Produto" : "Novo Produto"}>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/lojista/produtos')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Produtos
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ProductForm 
          produto={produto || undefined}
          filiais={filiais}
          estoqueInicial={estoque}
          onSubmit={handleSave}
          isLoading={isSaving}
        />
      </div>
    </LojistaLayout>
  );
};

export default ProdutoDetailPage;
