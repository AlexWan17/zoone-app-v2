
import { supabase } from "@/lib/supabase";

export const reservaApi = {
  async getReservasByLojista(lojistaId: string) {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        consumidor: consumidores(*),
        produto: produtos(*),
        filial: filiais(*)
      `)
      .eq("filial.lojista_id", lojistaId)
      .order("criado_em", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateReservaStatus(reservaId: string, status: string) {
    const { error } = await supabase
      .from('reservas')
      .update({ status, atualizado_em: new Date().toISOString() })
      .eq('id', reservaId);

    if (error) throw error;
  },

  async expirarReservasVencidas() {
    // Chama a Function diretamente
    const { error } = await supabase.rpc("expirar_reservas_vencidas");
    if (error) throw error;
    return true;
  }
};
