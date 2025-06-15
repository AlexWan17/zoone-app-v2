import { supabase } from "@/lib/supabase";
import { EstoqueFilial } from "@/types";

export const stockApi = {
  async getEstoqueByFilial(filialId: string): Promise<EstoqueFilial[]> {
    const { data, error } = await supabase
      .from('produtos_filiais')
      .select(`
        *,
        produto:produtos(*)
      `)
      .eq('filial_id', filialId);

    if (error) throw error;
    return data.map(item => ({
      id: item.id,
      produto_id: item.produto_id,
      filial_id: item.filial_id,
      quantidade: item.estoque_disponivel,
      preco: item.preco_filial || item.produto.preco_venda,
      localizacao_fisica: item.localizacao_fisica,
      atualizado_em: item.atualizado_em,
      produto: {
        ...item.produto,
        status_venda: item.produto.status_venda as 'ativo' | 'pausado' | 'inativo'
      },
      reservavel: item.promocao_filial,
      tempo_max_reserva: 60,
      desconto_min: item.desconto_filial || 0,
      desconto_max: item.desconto_filial || 0,
    }));
  },

  async getEstoqueProduto(produtoId: string): Promise<EstoqueFilial[]> {
    const { data, error } = await supabase
      .from('estoque_filial')
      .select(`
        *,
        produto:produtos(*),
        filial:filiais(*)
      `)
      .eq('produto_id', produtoId)
      /* Removi o .gt('quantidade', 0) para que possamos ver todos os estoques, mesmo zerados, mas pode manter se quiser! */;

    if (error) throw error;
    return (data || []).map(item => ({
      id: item.id,
      produto_id: item.produto_id,
      filial_id: item.filial_id,
      quantidade: item.quantidade ?? 0,
      preco: item.preco,
      localizacao_fisica: item.localizacao_fisica || '',
      atualizado_em: item.atualizado_em,
      produto: item.produto ? {
        ...item.produto,
        status_venda: item.produto.status_venda as 'ativo' | 'pausado' | 'inativo'
      } : undefined,
      filial: item.filial ? {
        ...item.filial,
        // Garante campos obrigatórios que os componentes precisam:
        nome_filial: item.filial.nome_filial,
        endereco: item.filial.endereco,
        id: item.filial.id,
        // outros campos se necessário...
      } : null,
      reservavel: item.reservavel ?? false,
      tempo_max_reserva: item.tempo_max_reserva ?? 60,
      desconto_min: item.desconto_min ?? 0,
      desconto_max: item.desconto_max ?? 0,
    }));
  },

  // NOVO: Criar estoque
  async createEstoqueFilial(data: Omit<EstoqueFilial, "id" | "atualizado_em">) {
    const { error } = await supabase
      .from("estoque_filial")
      .insert([data]);

    if (error) throw error;
    return true;
  },

  // NOVO: Atualizar estoque
  async updateEstoqueFilial(id: string, data: Partial<EstoqueFilial>) {
    const { error } = await supabase
      .from("estoque_filial")
      .update(data)
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  // (opcional: buscar estoque por produto e filial)
  async getByProdutoAndFilial(produtoId: string, filialId: string) {
    const { data, error } = await supabase
      .from("estoque_filial")
      .select("*")
      .eq("produto_id", produtoId)
      .eq("filial_id", filialId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
