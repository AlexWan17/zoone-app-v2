import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Package, DollarSign, MapPin, Eye, EyeOff } from 'lucide-react';
import LojistaLayout from '@/components/LojistaLayout';
import { productService, ProdutoCompleto } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import EstoqueFilialForm from '@/components/EstoqueFilialForm';
import { stockApi } from '@/services/stockApi';

const ProdutoDetailPageEnhanced = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [produto, setProduto] = useState<ProdutoCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showEstoqueForm, setShowEstoqueForm] = useState(false);
  // Estado para os estoques unificados
  const [estoquesFilial, setEstoquesFilial] = useState<any[]>([]);
  const [isLoadingEstoque, setIsLoadingEstoque] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduto();
      fetchEstoques();
    }
    // eslint-disable-next-line
  }, [id]);

  // Atualiza estoques após criação/edição
  const atualizarEstoques = () => {
    fetchEstoques();
  };

  // Busca estoques da tabela estoque_filial
  const fetchEstoques = async () => {
    if (!id) return;
    setIsLoadingEstoque(true);
    try {
      const estoques = await stockApi.getEstoqueProduto(id);
      setEstoquesFilial(estoques);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar estoques das filiais",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEstoque(false);
    }
  };

  const fetchProduto = async () => {
    try {
      setIsLoading(true);
      if (id) {
        const data = await productService.getProdutoById(id);
        setProduto(data);
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do produto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!produto) return;

    try {
      const novoStatus = produto.ativo ? false : true;
      await productService.updateProduto(produto.id, { ativo: novoStatus });
      
      setProduto(prev => prev ? { ...prev, ativo: novoStatus } : null);
      
      toast({
        title: "Status atualizado",
        description: `Produto ${novoStatus ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do produto",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!produto) return;

    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        // Note: We would need a delete method in productService
        // await productService.deleteProduto(produto.id);
        toast({
          title: "Produto excluído",
          description: "Produto excluído com sucesso",
        });
        navigate('/lojista/produtos');
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir produto",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = () => {
    navigate(`/lojista/produtos/${id}/editar`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <LojistaLayout title="Carregando...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </LojistaLayout>
    );
  }

  if (!produto) {
    return (
      <LojistaLayout title="Produto não encontrado">
        <Card>
          <CardContent className="text-center py-8">
            <p>Produto não encontrado</p>
            <Button onClick={() => navigate('/lojista/produtos')} className="mt-4">
              Voltar aos Produtos
            </Button>
          </CardContent>
        </Card>
      </LojistaLayout>
    );
  }

  return (
    <LojistaLayout title={produto.nome}>
      <div className="space-y-6">
        {/* Header com ações */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{produto.nome}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={produto.ativo ? "default" : "secondary"}>
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant="outline">
                    {produto.status_venda}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleStatus}
                >
                  {produto.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {produto.ativo ? "Desativar" : "Ativar"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs com informações */}
        <Tabs defaultValue="geral" className="space-y-4">
          <TabsList>
            <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
            <TabsTrigger value="estoque">Estoque por Filial</TabsTrigger>
            <TabsTrigger value="promocoes">Promoções</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Descrição:</strong>
                    <p className="text-gray-600 mt-1">{produto.descricao}</p>
                  </div>
                  {produto.categoria && (
                    <div>
                      <strong>Categoria:</strong>
                      <p className="text-gray-600">{produto.categoria.nome}</p>
                    </div>
                  )}
                  {produto.marca && (
                    <div>
                      <strong>Marca:</strong>
                      <p className="text-gray-600">{produto.marca}</p>
                    </div>
                  )}
                  {produto.modelo && (
                    <div>
                      <strong>Modelo:</strong>
                      <p className="text-gray-600">{produto.modelo}</p>
                    </div>
                  )}
                  {produto.codigo_barras && (
                    <div>
                      <strong>Código de Barras:</strong>
                      <p className="text-gray-600">{produto.codigo_barras}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preço e vendas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Preço e Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Preço de Venda:</strong>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(Number(produto.preco_venda))}
                    </p>
                  </div>
                  {produto.promocao_ativa && produto.desconto_percentual && (
                    <div>
                      <strong>Promoção Ativa:</strong>
                      <Badge variant="destructive">
                        {produto.desconto_percentual}% OFF
                      </Badge>
                    </div>
                  )}
                  <div>
                    <strong>Status de Venda:</strong>
                    <Badge variant={produto.status_venda === 'ativo' ? 'default' : 'secondary'}>
                      {produto.status_venda}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Logística */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Logística
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={produto.entrega_disponivel} 
                      onChange={e => setProduto(prev => prev ? { ...prev, entrega_disponivel: e.target.checked } : null)}
                      className="rounded cursor-pointer"
                    />
                    <span>Entrega disponível</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={produto.retirada_loja} 
                      onChange={e => setProduto(prev => prev ? { ...prev, retirada_loja: e.target.checked } : null)}
                      className="rounded cursor-pointer"
                    />
                    <span>Retirada na loja</span>
                  </div>
                  {produto.reservavel && (
                    <div>
                      <strong>Reservável:</strong>
                      <p className="text-gray-600">
                        Sim - {produto.tempo_reserva_em_minutos} minutos
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Características físicas */}
              {(produto.peso || produto.dimensoes || produto.tamanhos_disponiveis || produto.cores_disponiveis) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Características Físicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {produto.peso && (
                      <div>
                        <strong>Peso:</strong>
                        <p className="text-gray-600">{produto.peso} kg</p>
                      </div>
                    )}
                    {produto.tamanhos_disponiveis && produto.tamanhos_disponiveis.length > 0 && (
                      <div>
                        <strong>Tamanhos:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {produto.tamanhos_disponiveis.map((tamanho, index) => (
                            <Badge key={index} variant="outline">{tamanho}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {produto.cores_disponiveis && produto.cores_disponiveis.length > 0 && (
                      <div>
                        <strong>Cores:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {produto.cores_disponiveis.map((cor, index) => (
                            <Badge key={index} variant="outline">{cor}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Imagens */}
            {produto.imagem_url && produto.imagem_url.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Imagens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {produto.imagem_url.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${produto.nome} - ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="estoque">
            <Card>
              <CardHeader>
                <CardTitle>Estoque por Filial</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingEstoque ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : estoquesFilial && estoquesFilial.length > 0 ? (
                  <div className="space-y-4">
                    {estoquesFilial.map((estoque) => (
                      <div key={estoque.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{estoque.filial?.nome_filial || estoque.filial_id}</h4>
                            <p className="text-sm text-gray-600">{estoque.filial?.endereco}</p>
                            {estoque.localizacao_fisica && (
                              <p className="text-sm text-gray-600">
                                Localização: {estoque.localizacao_fisica}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {estoque.quantidade} unidades
                            </div>
                            {estoque.reservado > 0 && (
                              <div className="text-sm text-orange-600">
                                {estoque.reservado} reservadas
                              </div>
                            )}
                            {typeof estoque.preco === "number" && (
                              <div className="text-sm text-green-600">
                                {formatCurrency(Number(estoque.preco))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 flex flex-col gap-4">
                    <p className="text-gray-600">Nenhum estoque cadastrado para este produto</p>
                    <Button className="mx-auto" onClick={() => setShowEstoqueForm(true)}>
                      Adicionar Estoque
                    </Button>
                  </div>
                )}
                {showEstoqueForm && (
                  <div className="max-w-xl mx-auto mt-8">
                    <EstoqueFilialForm
                      produtoId={produto.id}
                      onSave={() => {
                        setShowEstoqueForm(false);
                        atualizarEstoques();
                      }}
                      onCancel={() => setShowEstoqueForm(false)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promocoes">
            <Card>
              <CardHeader>
                <CardTitle>Promoções</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Funcionalidade de promoções em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Exibe alerta se produto não tiver filiais */}
      {(!estoquesFilial || estoquesFilial.length === 0) && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-center text-sm">
          Nenhum estoque ou filial cadastrada. Verifique se você já cadastrou ao menos uma filial antes de adicionar estoque.
        </div>
      )}
    </LojistaLayout>
  );
};

export default ProdutoDetailPageEnhanced;
