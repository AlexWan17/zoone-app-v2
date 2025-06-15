
import { supabase } from "@/lib/supabase";
import { Pedido } from "@/types";

export const orderApi = {
  async criarPedido(pedido: any): Promise<any> {
    // Usar .select() para retornar o registro recém-inserido (especialmente o ID)
    const { data, error } = await supabase
      .from('pedidos')
      .insert([pedido])
      .select();

    if (error) throw error;
    return data;
  },

  async criarItensPedido(itens: any[]): Promise<any> {
    // Bulk insert dos itens do pedido
    const { data, error } = await supabase
      .from('itens_pedido')
      .insert(itens)
      .select();

    if (error) throw error;
    return data;
  },

  async getPedidoById(pedidoId: string): Promise<Pedido | null> {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        filial:filiais(*),
        consumidor:perfis_consumidores(*),
        itens:itens_pedido(
          *,
          produto:produtos(*)
        )
      `)
      .eq('id', pedidoId)
      .maybeSingle();

    if (error) throw error;

    if (!data) return null;

    return {
      ...data,
      status: data.status as 'pendente' | 'processando' | 'pronto_retirada' | 'enviado' | 'entregue' | 'cancelado',
      tipo_entrega: data.tipo_entrega as 'entrega' | 'retirada_filial',
      itens: data.itens?.map(item => ({
        ...item,
        produto: item.produto ? {
          ...item.produto,
          status_venda: item.produto.status_venda as 'ativo' | 'pausado' | 'inativo'
        } : undefined
      }))
    };
  },

  async getPedidosConsuidor(consumidorId: string): Promise<Pedido[]> {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        filial:filiais(*),
        consumidor:perfis_consumidores(*),
        itens:itens_pedido(
          *,
          produto:produtos(*)
        )
      `)
      .eq('consumidor_id', consumidorId)
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data.map(pedido => ({
      ...pedido,
      status: pedido.status as 'pendente' | 'processando' | 'pronto_retirada' | 'enviado' | 'entregue' | 'cancelado',
      tipo_entrega: pedido.tipo_entrega as 'entrega' | 'retirada_filial',
      itens: pedido.itens?.map(item => ({
        ...item,
        produto: item.produto ? {
          ...item.produto,
          status_venda: item.produto.status_venda as 'ativo' | 'pausado' | 'inativo'
        } : undefined
      }))
    }));
  },

  async getPedidosLojista(lojistaId: string): Promise<Pedido[]> {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        filial:filiais(*),
        consumidor:perfis_consumidores(*),
        itens:itens_pedido(
          *,
          produto:produtos(*)
        )
      `)
      .eq('filial.lojista_id', lojistaId)
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data.map(pedido => ({
      ...pedido,
      status: pedido.status as 'pendente' | 'processando' | 'pronto_retirada' | 'enviado' | 'entregue' | 'cancelado',
      tipo_entrega: pedido.tipo_entrega as 'entrega' | 'retirada_filial',
      itens: pedido.itens?.map(item => ({
        ...item,
        produto: item.produto ? {
          ...item.produto,
          status_venda: item.produto.status_venda as 'ativo' | 'pausado' | 'inativo'
        } : undefined
      }))
    }));
  },

  async updatePedidoStatus(pedidoId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('pedidos')
      .update({ status })
      .eq('id', pedidoId);

    if (error) throw error;
  },
};
