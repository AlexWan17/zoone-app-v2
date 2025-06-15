
import { authApi } from "./authApi";
import { productApi } from "./productApi";
import { stockApi } from "./stockApi";
import { orderApi } from "./orderApi";
import { branchApi } from "./branchApi";
import { utilsApi } from "./utilsApi";
import { reservaApi } from "./reservaApi";
import { freteApi } from "./freteApi";
import { supabase } from "@/lib/supabase"; // Adicionado import do supabase

export const api = {
  ...authApi,
  ...productApi,
  ...stockApi,
  ...orderApi,
  ...branchApi,
  ...utilsApi,
  ...reservaApi,
  ...freteApi,
  // Atalho novo para obter todas filiais (para facilitar os mapas)
  async getFiliais() {
    // Checando se a função existe no branchApi
    if (branchApi && typeof (branchApi as any).getFiliais === "function") {
      return await (branchApi as any).getFiliais();
    }
    // Checando se a função existe no productApi
    if (productApi && typeof (productApi as any).getFiliais === "function") {
      return await (productApi as any).getFiliais();
    }
    return [];
  },
  async decrementarEstoqueProduto(produtoId: string, filialId: string, quantidade: number) {
    // Chama a função SQL que decrementa o estoque
    const { error } = await supabase
      .rpc("decrementar_estoque", {
        produto_id_param: produtoId,
        filial_id_param: filialId,
        quantidade_param: quantidade
      });

    if (error) throw error;
    return true;
  }
};

export default api;
