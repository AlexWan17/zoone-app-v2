
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/services/api';

interface OrderSummaryProps {
  cartItems: any[];
  getTotal: () => number;
  tipoEntrega: string;
}

export default function OrderSummary({ cartItems, getTotal, tipoEntrega }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={`${item.produto.id}-${item.filial.id}`} className="flex justify-between">
              <div>
                <p className="font-medium">{item.produto.nome}</p>
                <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
              </div>
              <p className="font-medium">
                {api.formatCurrency(item.preco * item.quantidade)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{api.formatCurrency(getTotal())}</span>
            </div>
            {tipoEntrega === 'entrega' && (
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>{api.formatCurrency(10)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>
                {api.formatCurrency(
                  getTotal() + (tipoEntrega === 'entrega' ? 10 : 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
