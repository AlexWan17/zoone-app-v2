
import { supabase } from "@/lib/supabase";

export interface ProdutoExtendido {
  id: string;
  lojista_id: string;
  nome: string;
  descricao: string;
  categoria_id: string;
  codigo_barras?: string;
  marca?: string;
  modelo?: string;
  peso?: number;
  dimensoes?: any;
  tags?: string[];
  imagem_url: string[];
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  
  // Preço e Promoção
  preco_venda: number;
  promocao_ativa: boolean;
  desconto_percentual?: number;
  
  // Tokenização
  token_zoone_ativo: boolean;
  
  // Reserva
  reservavel: boolean;
  tempo_reserva_em_minutos?: number;
  
  // Logística
  entrega_disponivel: boolean;
  retirada_loja: boolean;
  
  // Controle de Venda
  status_venda: 'ativo' | 'pausado' | 'inativo';
  
  // ERP e Código de Barras
  erp_integrado?: string;
  dados_gs1?: any;
  
  // Vestuário/Provador IA
  tamanhos_disponiveis?: string[];
  cores_disponiveis?: string[];
  tipo_tecido?: string;
}

export const produtoService = {
  async getProdutos(lojistaId?: string): Promise<ProdutoExtendido[]> {
    let query = supabase
      .from('produtos')
      .select('*');

    if (lojistaId) {
      query = query.eq('lojista_id', lojistaId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.map(produto => ({
      ...produto,
      status_venda: produto.status_venda as 'ativo' | 'pausado' | 'inativo'
    }));
  },

  async getProdutoById(id: string): Promise<ProdutoExtendido> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return {
      ...data,
      status_venda: data.status_venda as 'ativo' | 'pausado' | 'inativo'
    };
  },

  async createProduto(produto: Omit<ProdutoExtendido, 'id' | 'criado_em' | 'atualizado_em'>): Promise<ProdutoExtendido> {
    const { data, error } = await supabase
      .from('produtos')
      .insert(produto)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status_venda: data.status_venda as 'ativo' | 'pausado' | 'inativo'
    };
  },

  async updateProduto(id: string, produto: Partial<Omit<ProdutoExtendido, 'id' | 'criado_em' | 'lojista_id'>>): Promise<ProdutoExtendido> {
    const { data, error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      status_venda: data.status_venda as 'ativo' | 'pausado' | 'inativo'
    };
  },

  async deleteProduto(id: string): Promise<void> {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleProdutoStatus(id: string, ativo: boolean): Promise<void> {
    const { error } = await supabase
      .from('produtos')
      .update({ ativo })
      .eq('id', id);

    if (error) throw error;
  },

  async updateProdutoStatus(id: string, status: 'ativo' | 'pausado' | 'inativo'): Promise<void> {
    const { error } = await supabase
      .from('produtos')
      .update({ status_venda: status })
      .eq('id', id);

    if (error) throw error;
  },

  async getProdutoComEstoque(produtoId: string) {
    const { data, error } = await supabase
      .from('produtos_filiais')
      .select(`
        *,
        produto:produtos(*),
        filial:filiais(*)
      `)
      .eq('produto_id', produtoId);

    if (error) throw error;
    return data;
  },

  async buscarProdutos(filtros: {
    query?: string;
    categoria?: string;
    lojista?: string;
    preco_min?: number;
    preco_max?: number;
  }): Promise<ProdutoExtendido[]> {
    let query = supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true);

    if (filtros.query) {
      query = query.or(`nome.ilike.%${filtros.query}%,descricao.ilike.%${filtros.query}%`);
    }

    if (filtros.categoria) {
      query = query.eq('categoria_id', filtros.categoria);
    }

    if (filtros.lojista) {
      query = query.eq('lojista_id', filtros.lojista);
    }

    if (filtros.preco_min) {
      query = query.gte('preco_venda', filtros.preco_min);
    }

    if (filtros.preco_max) {
      query = query.lte('preco_venda', filtros.preco_max);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.map(produto => ({
      ...produto,
      status_venda: produto.status_venda as 'ativo' | 'pausado' | 'inativo'
    }));
  }
};
