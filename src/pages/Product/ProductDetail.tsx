import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContextProvider';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Produto, EstoqueFilial } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, MapPin, Package, Truck, ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [estoque, setEstoque] = useState<EstoqueFilial[]>([]);
  const [selectedFilial, setSelectedFilial] = useState<EstoqueFilial | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const [produtoData, estoqueData] = await Promise.all([
          api.getProdutoById(id),
          api.getEstoqueProduto(id)
        ]);

        setProduto(produtoData);
        setEstoque(estoqueData);
        
        if (estoqueData.length > 0) {
          setSelectedFilial(estoqueData[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes do produto.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id, toast]);

  useEffect(() => {
    if (selectedFilial) {
      console.log("[ProductDetail] Filial selecionada:", selectedFilial);
    } else {
      console.log("[ProductDetail] Nenhuma filial selecionada.");
    }
  }, [selectedFilial]);

  const handleAddToCart = () => {
    if (!produto || !selectedFilial || !selectedFilial.filial_id) {
      toast({
        title: 'Erro',
        description: 'Selecione uma loja para adicionar ao carrinho.',
        variant: 'destructive',
      });
      console.error('[ProductDetail] Tentativa de adicionar ao carrinho com filial inválida:', selectedFilial);
      return;
    }
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Usar dados da filial do estoque, se disponível; senão, fallback com TODOS os campos exigidos de Filial interface
    const filialObj = selectedFilial.filial || {
      id: selectedFilial.filial_id,
      lojista_id: '', // Valor fictício, use se não houver disponível
      nome_filial: "Filial selecionada",
      endereco: "",
      latitude: 0,
      longitude: 0,
      telefone_filial: "",
      email_filial: "",
      criado_em: "",
      atualizado_em: "",
    };
    addToCart(produto, filialObj, selectedFilial.preco, 1);

    toast({
      title: 'Produto adicionado!',
      description: `${produto.nome} foi adicionado ao seu carrinho.`,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!produto) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-4">Produto não encontrado</h2>
            <p className="text-gray-600 mb-4">O produto que você está procurando não foi encontrado.</p>
            <Button onClick={() => navigate('/')}>Voltar à página inicial</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Imagens do Produto */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={produto.imagem_url[selectedImage] || 'https://via.placeholder.com/500'}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            </div>
            
            {produto.imagem_url.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {produto.imagem_url.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${produto.nome} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-dark mb-2">{produto.nome}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary">{produto.marca}</Badge>
                {produto.modelo && <Badge variant="outline">{produto.modelo}</Badge>}
              </div>
              
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-600 ml-2">(4.5) · 128 avaliações</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Descrição</h3>
              <p className="text-gray-600">{produto.descricao}</p>
            </div>

            {produto.tags && produto.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {produto.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">#{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {produto.peso && (
              <div className="text-sm text-gray-600">
                <Package className="w-4 h-4 inline mr-1" />
                Peso: {produto.peso}kg
              </div>
            )}
          </div>
        </div>

        {/* Disponibilidade nas Lojas */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Disponível nas seguintes lojas
            </h3>
            {estoque.length === 0 ? (
              <p className="text-gray-600">Este produto não está disponível no momento.</p>
            ) : (
              <div className="space-y-4">
                {estoque.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFilial?.id === item.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFilial(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.filial?.nome_filial || 'Filial indisponível'}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.filial?.endereco || ''}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`flex items-center ${
                            item.quantidade > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <Package className="w-4 h-4 mr-1" />
                            {item.quantidade > 0 ? `${item.quantidade} em estoque` : 'Sem estoque'}
                          </span>
                          <span className="flex items-center text-gray-600">
                            <Truck className="w-4 h-4 mr-1" />
                            Entrega disponível
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {api.formatCurrency(item.preco)}
                        </p>
                        {item.desconto_max > 0 && (
                          <p className="text-sm text-green-600">
                            Até {item.desconto_max}% de desconto
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Mensagem se nenhuma filial foi selecionada */}
            {estoque.length > 0 && !selectedFilial && (
              <p className="text-sm text-red-600 mt-4">Selecione uma loja abaixo para continuar</p>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        {selectedFilial && selectedFilial.quantidade > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:relative md:border-0 md:p-0">
            <div className="flex gap-4 max-w-sm mx-auto md:max-w-none">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <Heart className="w-5 h-5 mr-2" />
                Favoritar
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary-600"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
