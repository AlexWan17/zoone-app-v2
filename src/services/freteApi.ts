
import { supabase } from "@/lib/supabase";

export const freteApi = {
  async getRegrasFrete() {
    const { data, error } = await supabase
      .from('regras_frete')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getRegrasFreteByFilialId(filialId: string) {
    const { data, error } = await supabase
      .from('regras_frete')
      .select('*')
      .eq('filial_id', filialId);
    if (error) throw error;
    return data || [];
  },

  // Adicione outros métodos conforme necessário (exemplo: criar, atualizar, deletar regra de frete).
};
