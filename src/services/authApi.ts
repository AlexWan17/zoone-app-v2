
import { supabase } from "@/lib/supabase";
import { User } from "@/types";

export const authApi = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email!,
      role: 'consumidor'
    };
  },

  async updateUserRole(userId: string, role: 'lojista' | 'consumidor'): Promise<void> {
    const { error } = await supabase
      .from('perfis_lojistas')
      .update({ role })
      .eq('user_id', userId);
    if (error) throw error;
  }
};
