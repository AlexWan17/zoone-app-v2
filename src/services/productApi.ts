import { supabase } from "@/lib/supabase";
import { Produto } from "@/types";

export const productApi = {
  async getProdutos(): Promise<Produto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true);

    if (error) throw error;
    return data.map(produto => ({
      ...produto,
      status_venda: produto.status_venda as 'ativo' | 'pausado' | 'inativo'
    }));
  },

  async getProdutosByLojista(lojistaId: string): Promise<Produto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('lojista_id', lojistaId);

    if (error) throw error;
    return data.map(produto => ({
      ...produto,
      status_venda: produto.status_venda as 'ativo' | 'pausado' | 'inativo'
    }));
  },

  async getProdutoById(id: string): Promise<Produto> {
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

  async buscarProdutos(query: string): Promise<Produto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .or(`nome.ilike.%${query}%, descricao.ilike.%${query}%`)
      .eq('ativo', true);

    if (error) throw error;
    return data.map(produto => ({
      ...produto,
      status_venda: produto.status_venda as 'ativo' | 'pausado' | 'inativo'
    }));
  },

  async getProximasFiliais(lat: number, lon: number, raio: number = 5) {
    // Busca filiais num raio de X km, simplificação — normalmente faria via PostGIS
    const { data, error } = await supabase
      .from('filiais')
      .select('*');
    if (error) throw error;

    return (data || []).filter((filial: any) => {
      if (lat && lon && filial.latitude && filial.longitude) {
        const toRad = (val: number) => (val * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(filial.latitude - lat);
        const dLon = toRad(filial.longitude - lon);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat)) *
            Math.cos(toRad(filial.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = R * c;
        return dist <= raio;
      }
      return false;
    });
  }
};
