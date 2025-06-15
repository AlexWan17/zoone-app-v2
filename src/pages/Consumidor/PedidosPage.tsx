
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pedido } from '@/types';
import { api } from '@/services/api';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Loader2
} from 'lucide-react';

const statusIcons = {
  pendente: <Clock className="w-4 h-4" />,
  processando: <Loader2 className="w-4 h-4 animate-spin" />,
  pronto_retirada: <Package className="w-4 h-4" />,
  enviado: <Truck className="w-4 h-4" />,
  entregue: <CheckCircle className="w-4 h-4" />,
  cancelado: <XCircle className="w-4 h-4" />
};

const statusColors = {
  pendente: 'bg-yellow-100 text-yellow-800',
  processando: 'bg-blue-100 text-blue-800',
  pronto_retirada: 'bg-purple-100 text-purple-800',
  enviado: 'bg-orange-100 text-orange-800',
  entregue: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pendente: 'Pendente',
  processando: 'Processando',
  pronto_retirada: 'Pronto para Retirada',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado'
};

const PedidosPage = () => {
  const { user } = useAuthOptimized();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const pedidosData = await api.getPedidosConsuidor(user.id);
        setPedidos(pedidosData);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [user?.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Carregando seus pedidos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Meus Pedidos</h2>
          <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
        </div>

        {pedidos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Você ainda não fez nenhum pedido. Que tal começar a explorar nossos produtos?
              </p>
              <Button asChild>
                <Link to="/">Explorar Produtos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pedidos.map(pedido => (
              <Card key={pedido.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Pedido #{pedido.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(pedido.criado_em).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge className={`${statusColors[pedido.status]} flex items-center gap-1`}>
                      {statusIcons[pedido.status]}
                      {statusLabels[pedido.status]}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Loja:</p>
                      <p className="font-medium">{pedido.filial?.nome_filial || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Entrega:</p>
                      <p className="font-medium">
                        {pedido.tipo_entrega === 'entrega' ? 'Entrega' : 'Retirada na Loja'}
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                    <div className="space-y-2">
                      {pedido.itens?.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.produto?.imagem_url?.[0] || '/placeholder.svg'}
                              alt={item.produto?.nome}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-sm">{item.produto?.nome}</p>
                              <p className="text-xs text-gray-500">
                                Qtd: {item.quantidade}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">
                            {api.formatCurrency(item.preco_unitario_na_compra)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">
                        Total: {api.formatCurrency(pedido.total_liquido)}
                      </p>
                      {pedido.frete > 0 && (
                        <p className="text-sm text-gray-600">
                          (inclui frete: {api.formatCurrency(pedido.frete)})
                        </p>
                      )}
                    </div>
                    <Button variant="outline" asChild>
                      <Link to={`/pedido/${pedido.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PedidosPage;
