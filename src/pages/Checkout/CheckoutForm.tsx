
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from './checkoutSchema';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import PersonalDataFields from './components/PersonalDataFields';
import DeliveryTypeFields from './components/DeliveryTypeFields';
import AddressFields from './components/AddressFields';
import PaymentMethodFields from './components/PaymentMethodFields';
import { Loader2 } from "lucide-react";
import { useCheckout } from './hooks/useCheckout';

interface CheckoutFormProps {
  user: any;
  cartItems: any[];
  getTotal: () => number;
  clearCart: () => void;
  onOrderCreated?: (orderId: string) => void;
  onTipoEntregaChange?: (tipoEntrega: string) => void;
}

export default function CheckoutForm({ user, cartItems, getTotal, clearCart, onOrderCreated, onTipoEntregaChange }: CheckoutFormProps) {
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nomeCompleto: '',
      email: user?.email || '',
      telefone: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      tipoEntrega: 'retirada_filial',
      formaPagamento: 'pix'
    }
  });

  // Hook centralizado
  const { isLoading, handleSubmit } = useCheckout({
    user,
    cartItems,
    getTotal,
    clearCart,
    onOrderCreated
  });

  // Sincroniza tipoEntrega com o parent
  React.useEffect(() => {
    if (onTipoEntregaChange) {
      onTipoEntregaChange(form.watch('tipoEntrega'));
    }
    const subscription = form.watch((values, { name }) => {
      if (name === "tipoEntrega" && onTipoEntregaChange) {
        onTipoEntregaChange(values.tipoEntrega ?? 'retirada_filial');
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, [form, onTipoEntregaChange]);

  // Função robusta de erro para campos com feedback
  const showFirstFormError = (formErrors: any) => {
    const flat = (obj: any) =>
      Object.values(obj).find((v) => v && typeof v === "object" && "message" in v)
        ? flat(Object.values(obj).find((v) => v && typeof v === "object" && "message" in v))
        : Object.values(obj)[0];
    const firstError: any = flat(formErrors);
    // Toast é chamado dentro do hook de erro
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finalizar Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              fields => handleSubmit(fields),
              showFirstFormError
            )}
            className="space-y-6"
          >
            <PersonalDataFields form={form} />
            <DeliveryTypeFields form={form} />
            {form.watch('tipoEntrega') === 'entrega' && (
              <AddressFields form={form} />
            )}
            <PaymentMethodFields form={form} />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Finalizar Pedido'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
