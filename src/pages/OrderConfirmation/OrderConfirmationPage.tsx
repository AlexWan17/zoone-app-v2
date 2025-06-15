
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { CheckCircle2, Package, Home, ShoppingBag } from 'lucide-react';
import { orderApi } from '@/services/orderApi';
import { api } from '@/services/api';

const statusMap: Record<string, string> = {
  pendente: 'Pedido Confirmado',
  processando: 'Em Processamento',
  pronto_retirada: 'Pronto para Retirada',
  enviado: 'Em Entrega',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
  aguardando_pagamento: 'Aguardando Pagamento',
};

const timelineSteps = [
  { key: 'pendente', label: 'Pedido Confirmado' },
  { key: 'processando', label: 'Em Processamento' },
  { key: 'pronto_retirada', label: 'Pronto para Retirada' },
  { key: 'enviado', label: 'Em Entrega' },
  { key: 'entregue', label: 'Entregue' },
];

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR') + ' ' + new Date(dateString).toLocaleTimeString('pt-BR');
};

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: pedido, isLoading, error } = useQuery({
    queryKey: ['pedido', orderId],
    queryFn: () => orderApi.getPedidoById(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Carregando detalhes do pedido...</div>
        </div>
      </Layout>
    );
  }

  if (error || !pedido) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-red-600 font-semibold">Não foi possível carregar o pedido.</div>
          <Link to="/pedidos" className="mt-4 inline-block text-primary hover:underline">Meus Pedidos</Link>
        </div>
      </Layout>
    );
  }

  // Descobrir se é entrega ou retirada
  const isRetirada = pedido.tipo_entrega === 'retirada_filial';

  // Timeline otimizada baseada no status atual
  const statusIndex = timelineSteps.findIndex(s => s.key === pedido.status);
  const timeline = timelineSteps.map((step, idx) => ({
    ...step,
    completed: idx <= statusIndex,
    active: idx === statusIndex,
    date: idx === 0 ? pedido.criado_em : undefined,
  }));

  // Endereço
  const addressInfo = isRetirada
    ? `${pedido.filial?.nome_filial || ''}${pedido.filial?.endereco ? ' - ' + pedido.filial.endereco : ''}`
    : pedido.endereco_entrega || '';

  // Previsão de entrega fictícia (poderia vir do pedido futuramente)
  const previsao = isRetirada
    ? 'Assim que o status estiver como "Pronto para Retirada", retire na loja'
    : '3-5 dias úteis';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold">Pedido Confirmado!</h1>
            <p className="text-gray-600 mt-2">
              Seu pedido foi recebido e está sendo processado.
            </p>
          </div>

          <div className="border-t border-b py-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Número do Pedido</span>
              <span className="font-medium">#{pedido.id}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-gray-600">Data</span>
              <span>{formatDate(pedido.criado_em)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-gray-600">Total</span>
              <span className="font-medium">{api.formatCurrency(pedido.total_liquido)}</span>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-medium mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary" />
                Status do Pedido
              </h2>
              <div className="relative">
                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6 relative">
                  {timeline.map((step, idx) => (
                    <div className="flex" key={step.key}>
                      <div className={`w-5 h-5 rounded-full ${step.completed ? 'bg-secondary' : 'bg-gray-200'} mt-1 z-10`}></div>
                      <div className="ml-4">
                        <p className={`font-medium ${step.completed ? '' : 'text-gray-500'}`}>{step.label}</p>
                        {step.date && (
                          <p className="text-sm text-gray-500">{formatDate(step.date)}</p>
                        )}
                        {step.active && idx === statusIndex && (
                          <p className="text-xs text-primary mt-0.5">Status atual</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-3 flex items-center">
                <Home className="w-5 h-5 mr-2 text-primary" />
                {isRetirada ? 'Retirada em Loja' : 'Informações de Entrega'}
              </h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">{isRetirada
                  ? pedido.filial?.nome_filial || 'Filial'
                  : pedido.consumidor?.nome || 'Consumidor'}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {addressInfo}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {isRetirada ? previsao : `Previsão de entrega: ${previsao}`}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-3 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
                Resumo dos Itens
              </h2>
              <div className="space-y-2">
                {pedido.itens?.map(item => (
                  <div className="flex items-center py-2" key={item.id}>
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.produto?.imagem_url?.[0] || '/placeholder.svg'} 
                        alt={item.produto?.nome || 'Produto'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="font-medium">{item.produto?.nome}</p>
                      <p className="text-sm text-gray-500">Quantidade: {item.quantidade}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{api.formatCurrency(item.preco_unitario_na_compra * item.quantidade)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <Link
              to="/pedidos"
              className="flex-1 py-2 px-4 border border-primary text-primary rounded-md hover:bg-primary-50 transition text-center"
            >
              Meus Pedidos
            </Link>
            <Link
              to="/"
              className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-600 transition text-center"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
