
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';

const PedidoDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: pedido, isLoading, error } = useQuery({
    queryKey: ['pedido', id],
    queryFn: () => api.getPedidoById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <Layout>Carregando detalhes do pedido...</Layout>;
  }

  if (error) {
    return <Layout>Erro ao carregar detalhes do pedido.</Layout>;
  }

  if (!pedido) {
    return <Layout>Pedido não encontrado.</Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido #{pedido.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Status:</strong> {pedido.status}</p>
            <p><strong>Tipo de Entrega:</strong> {pedido.tipo_entrega}</p>
            <p><strong>Data do Pedido:</strong> {new Date(pedido.criado_em).toLocaleDateString()}</p>
            
            <h3 className="text-lg font-semibold mt-4">Itens do Pedido:</h3>
            <ul>
              {pedido.itens?.map(item => (
                <li key={item.id} className="py-2 border-b">
                  {item.produto?.nome} - Quantidade: {item.quantidade} - Preço Unitário: {api.formatCurrency(item.preco_unitario_na_compra)}
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <strong>Total do Pedido:</strong> {api.formatCurrency(pedido.total_liquido)}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PedidoDetailPage;
