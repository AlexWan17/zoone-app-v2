import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { Produto } from '@/types';
import LojistaLayout from '@/components/LojistaLayout';
import { Plus, Package, Edit, Eye } from 'lucide-react';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        const data = await api.getProdutos();
        // Add missing required properties for mock data
        const produtosWithDefaults = data.map(produto => ({
          ...produto,
          preco_venda: produto.preco_venda || 0,
          promocao_ativa: produto.promocao_ativa || false,
          token_zoone_ativo: produto.token_zoone_ativo || false,
          reservavel: produto.reservavel || false,
          entrega_disponivel: produto.entrega_disponivel || false,
          retirada_loja: produto.retirada_loja ?? true,
          status_venda: produto.status_venda || 'ativo' as const
        }));
        setProdutos(produtosWithDefaults);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const mockProdutos: Produto[] = [
    {
      id: '1',
      lojista_id: '1',
      nome: 'Produto Exemplo 1',
      descricao: 'Descrição do produto exemplo',
      categoria_id: '1',
      codigo_barras: '1234567890123',
      marca: 'Marca Exemplo',
      modelo: 'Modelo A',
      peso: 0.5,
      dimensoes: { altura: 10, largura: 10, comprimento: 10 },
      tags: ['exemplo', 'produto'],
      imagem_url: ['https://via.placeholder.com/300'],
      ativo: true,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
      preco_venda: 99.99,
      promocao_ativa: false,
      token_zoone_ativo: false,
      reservavel: false,
      entrega_disponivel: false,
      retirada_loja: true,
      status_venda: 'ativo' as const
    }
  ];

  const displayProdutos = produtos.length > 0 ? produtos : mockProdutos;

  if (isLoading) {
    return (
      <LojistaLayout title="Meus Produtos">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </LojistaLayout>
    );
  }

  return (
    <LojistaLayout title="Meus Produtos">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Meus Produtos</h1>
        <Button onClick={() => navigate('/lojista/produto/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayProdutos.map((produto) => (
          <Card key={produto.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {produto.nome}
                <Badge variant="secondary">{produto.status_venda}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <img
                src={produto.imagem_url[0] || 'https://via.placeholder.com/150'}
                alt={produto.nome}
                className="w-full h-32 object-cover rounded-md"
              />
              <p className="text-sm text-gray-500 line-clamp-2">{produto.descricao}</p>
              <div className="flex items-center space-x-2 text-sm">
                <Package className="h-4 w-4" />
                <span>{produto.marca}</span>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/lojista/produto/${produto.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/lojista/produto-enhanced/${produto.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Editar Enhanced
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </LojistaLayout>
  );
};

export default ProductsPage;
