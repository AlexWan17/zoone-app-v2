import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { orderApi } from '@/services/orderApi';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function useCheckout({ user, cartItems, getTotal, clearCart, onOrderCreated }: any) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Garante que o perfil de consumidor sempre tenha user_id igual ao auth.uid();
  const getOrCreatePerfilConsumidorId = async (userId: string) => {
    let { data, error } = await supabase
      .from('perfis_consumidores')
      .select('id, user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar perfis_consumidores:", error);
    }

    if (data) {
      if (data.user_id !== userId) {
        console.error(
          "user_id do perfil difere do auth.uid(). Conserte os dados no banco para evitar erros de RLS!",
          { esperado: userId, atual: data.user_id }
        );
        throw new Error("Erro interno de relacionamento dos dados do usuário.");
      }
      return data.id;
    }

    // Busca no legado
    const result = await supabase
      .from('consumidores')
      .select('id, user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (result?.data) {
      if (result.data.user_id !== userId) {
        console.error(
          "user_id do consumidor legado difere do auth.uid(). Corrija o banco.",
          { esperado: userId, atual: result.data.user_id }
        );
        throw new Error("Erro interno na relação consumidor legado.");
      }
      return result.data.id;
    }

    // Criação do perfil se não existir, sempre com o user_id do auth.uid()
    const { data: novoPerfil, error: createError } = await supabase
      .from('perfis_consumidores')
      .insert({
        user_id: userId,
        nome: user.user_metadata?.nome || user.email,
        email: user.email
      })
      .select('id, user_id')
      .maybeSingle();

    if (createError || !novoPerfil || novoPerfil.user_id !== userId) {
      throw new Error("Não foi possível criar seu perfil do consumidor. Por favor, tente novamente ou contate o suporte.");
    }
    return novoPerfil.id;
  };

  const handleSubmit = async (data: any, onSuccess?: (pedidoId: string) => void, onError?: (err: any) => void) => {
    setIsLoading(true);
    try {
      // Obtenha o ID do perfil do consumidor
      const consumidorPerfilId = await getOrCreatePerfilConsumidorId(user.id);

      // Garante que `consumidor_id` seja o PERFIL do consumidor e válido pela RLS
      const pedidoPayload = {
        consumidor_id: consumidorPerfilId, // <-- Mudança principal
        filial_id: cartItems[0]?.filial?.id,
        tipo_entrega: data.tipoEntrega,
        status: "pendente",
        stripe_payment_intent_id: "",
        frete: data.tipoEntrega === 'entrega' ? 10 : 0,
        total_liquido: getTotal() + (data.tipoEntrega === 'entrega' ? 10 : 0),
        total_bruto: getTotal() + (data.tipoEntrega === 'entrega' ? 10 : 0),
        endereco_entrega: data.tipoEntrega === 'entrega'
          ? `${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade} - ${data.estado}, CEP: ${data.cep}${data.complemento ? ' (' + data.complemento + ')' : ''}`
          : null,
      };

      const [pedido] = await orderApi.criarPedido(pedidoPayload);

      if (!pedido) throw new Error("Falha ao criar pedido");

      // Insere os itens do pedido
      const itens = cartItems.map((item: any) => ({
        pedido_id: pedido.id,
        produto_id: item.produto.id,
        quantidade: item.quantidade,
        preco_unitario_na_compra: item.preco,
      }));

      // Log para debugging de RLS
      console.log("[CHECKOUT] Inserindo itens no pedido", { pedido_id: pedido.id, itens, auth_uid: user.id });

      await orderApi.criarItensPedido(itens);

      for (const item of cartItems) {
        await api.decrementarEstoqueProduto(item.produto.id, item.filial.id, item.quantidade);
      }

      // Pagamento via função edge
      let paymentUrl = "";
      const { data: paymentResp, error: paymentError } = await supabase.functions.invoke("create-payment", {
        body: { pedidoId: pedido.id },
      });

      if (paymentError || !paymentResp?.url) throw new Error("Erro ao iniciar processo de pagamento. Tente novamente.");

      paymentUrl = paymentResp.url;
      toast({
        title: 'Pedido criado!',
        description: 'Redirecionando ao pagamento...',
      });

      clearCart();
      if (onOrderCreated) onOrderCreated(pedido.id);

      setTimeout(() => {
        window.open(paymentUrl, "_blank");
      }, 500);

      if (onSuccess) onSuccess(pedido.id);

    } catch (err: any) {
      toast({
        title: 'Erro ao processar pedido',
        description: err?.message || (typeof err === 'string' ? err : 'Tente novamente ou entre em contato com o suporte.'),
        variant: 'destructive',
      });
      if (onError) onError(err);
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    handleSubmit,
  };
}
