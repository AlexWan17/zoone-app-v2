import { supabase } from "@/lib/supabase";

export const branchApi = {
  async getFiliais(): Promise<any[]> {
    const { data, error } = await supabase
      .from('filiais')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getFiliaisByLojista(lojistaId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('filiais')
      .select('*')
      .eq('lojista_id', lojistaId);

    if (error) throw error;
    return data || [];
  },

  async createFilial(filial: any): Promise<any> {
    const { data, error } = await supabase
      .from('filiais')
      .insert([filial])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFilial(id: string, filial: any): Promise<any> {
    const { data, error } = await supabase
      .from('filiais')
      .update(filial)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFilial(id: string): Promise<void> {
    const { error } = await supabase
      .from('filiais')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
