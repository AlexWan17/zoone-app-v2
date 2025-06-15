import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCart } from '@/context/CartContext'; // use authenticated cart hook
import { useAuth } from '@/context/AuthContextProvider'; // use main auth
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { orderApi } from '@/services/orderApi';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

const checkoutSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  endereco: z.string().min(5, 'Endereço é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(3, 'Bairro é obrigatório'),
  cidade: z.string().min(3, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório').max(2, 'Estado inválido'),
  cep: z.string().min(8, 'CEP é obrigatório').max(9, 'CEP inválido'),
  tipoEntrega: z.enum(['entrega', 'retirada_filial']),
  formaPagamento: z.enum(['pix', 'cartao'])
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auth check (force authentication!)
  const { user } = useAuth();
  const { items: cartItems, clearCart, getTotal } = useCart(); // authenticated cart only

  // If not authenticated, redirect immediately
  if (!user) {
    navigate("/login?redirect=/checkout");
    return null;
  }

  // Still require a cart to proceed
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto mt-8">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Carrinho vazio</h2>
            <p className="text-gray-600 mb-4">Adicione produtos ao carrinho para continuar</p>
            <Button onClick={() => navigate('/busca')}>Voltar às compras</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de tipoEntrega sincronizado com o formulário
  const [tipoEntrega, setTipoEntrega] = useState('retirada_filial');

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm
            user={user}
            cartItems={cartItems}
            getTotal={getTotal}
            clearCart={clearCart}
            onOrderCreated={(orderId: string) => navigate('/confirmacao/' + orderId)} // Confirmação com ID do pedido
            onTipoEntregaChange={setTipoEntrega}
          />
        </div>
        <div>
          <OrderSummary
            cartItems={cartItems}
            getTotal={getTotal}
            tipoEntrega={tipoEntrega}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
