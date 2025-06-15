
import { supabase } from "@/lib/supabase";
import { Produto } from "@/types";

export interface ProdutoCompleto extends Produto {
  categoria?: {
    id: string;
    nome: string;
    descricao?: string;
    icone?: string;
    ativo: boolean;
    criado_em: string;
    atualizado_em: string;
  };
  estoque_filiais?: Array<{
    id: string;
    produto_id: string;
    filial_id: string;
    estoque_disponivel: number;
    preco_filial?: number;
    promocao_filial: boolean;
    desconto_filial?: number;
    localizacao_fisica?: string;
    reservado: number;
    atualizado_em: string;
    criado_em: string;
    filial?: {
      id: string;
      nome_filial: string;
      endereco: string;
      latitude: number;
      longitude: number;
      telefone_filial?: string;
      email_filial?: string;
    };
  }>;
}

export const productService = {
  async getProdutos(): Promise<ProdutoCompleto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        categoria:categorias_produto(*)
      `)
      .eq('ativo', true);

    if (error) throw error;
    return data.map(produto => ({
      ...produto,
      status_venda: produto.status_venda as 'ativo' | 'pausado' | 'inativo'
    }));
  },

  async getProdutoById(id: string): Promise<ProdutoCompleto> {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        categoria:categorias_produto(*),
        estoque_filiais:produtos_filiais(
          *,
          filial:filiais(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return {
      ...data,
      status_venda: data.status_venda as 'ativo' | 'pausado' | 'inativo'
    };
  },

  async getProdutosByCategoria(categoriaId: string): Promise<ProdutoCompleto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        categoria:categorias_produto(*)
      `)
      .eq('categoria_id', categoriaId)
      .eq('ativo', true);

    if (error) throw error;
    return data.map(produto => ({
      ...produto,
      status_venda: produto.status_venda as 'ativo' | 'pausado' | 'inativo'
    }));
  },

  async getProdutosByLojista(lojistaId: string): Promise<ProdutoCompleto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        categoria:categorias_produto(*)
      `)
      .eq('lojista_id', lojistaId);

    if (error) throw error;
    return data.map(produto => ({
      ...produto,
      status_venda: produto.status_venda as 'ativo' | 'pausado' | 'inativo'
    }));
  },

  async buscarProdutos(filtros: {
    query?: string;
    categoria?: string;
    lojista?: string;
    preco_min?: number;
    preco_max?: number;
  }): Promise<ProdutoCompleto[]> {
    let query = supabase
      .from('produtos')
      .select(`
        *,
        categoria:categorias_produto(*),
        estoque_filiais:produtos_filiais(
          *,
          filial:filiais(*)
        )
      `)
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
  },

  async getEstoqueProduto(produtoId: string) {
    const { data, error } = await supabase
      .from('produtos_filiais')
      .select(`
        *,
        filial:filiais(*)
      `)
      .eq('produto_id', produtoId);

    if (error) throw error;
    return data;
  },

  async createProduto(produto: Omit<ProdutoCompleto, 'id' | 'criado_em' | 'atualizado_em' | 'categoria' | 'estoque_filiais'>): Promise<ProdutoCompleto> {
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

  async updateProduto(id: string, produto: Partial<Omit<ProdutoCompleto, 'id' | 'criado_em' | 'categoria' | 'estoque_filiais'>>): Promise<ProdutoCompleto> {
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

  async updateEstoque(estoqueData: any[]) {
    const promises = estoqueData.map(item => 
      supabase
        .from('produtos_filiais')
        .upsert(item)
        .select()
    );

    const results = await Promise.all(promises);
    
    for (const result of results) {
      if (result.error) throw result.error;
    }

    return results.map(result => result.data).flat();
  }
};
