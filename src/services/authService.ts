
import { User } from '@/types';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';

// Funções de autenticação
export const checkSupabaseConnection = async (): Promise<boolean> => {
  return await testSupabaseConnection();
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Tentando fazer login com:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Erro de autenticação:', error);
      throw error;
    }
    
    console.log('Login realizado com sucesso:', data.user?.id);
    return data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, role: 'lojista' | 'consumidor', nome?: string) => {
  try {
    console.log('Iniciando registro para:', email, 'como', role);

    // Extrair nome do email se não fornecido
    const userName = nome || email.split('@')[0];

    // Criar o usuário no auth com metadados
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
          nome: userName
        }
      }
    });
    
    if (authError) {
      console.error('Erro ao criar usuário:', authError);
      throw authError;
    }
    
    if (!authData.user) {
      console.error('Falha ao criar usuário: Dados de usuário não retornados');
      throw new Error('Falha ao criar usuário');
    }
    
    console.log('Usuário auth criado com sucesso:', authData.user.id);
    console.log('Metadados salvos:', { role, nome: userName });
    
    return authData;
  } catch (error: any) {
    console.error('Erro ao registrar:', error);
    throw error;
  }
};

export const createUserProfile = async (userId: string, email: string, role: 'lojista' | 'consumidor', nome: string) => {
  try {
    console.log('Criando perfil para:', { userId, email, role, nome });
    
    if (role === 'lojista') {
      const { error: profileError } = await supabase
        .from('perfis_lojistas')
        .insert({
          user_id: userId,
          nome_loja: `Loja de ${nome}`,
          nome_responsavel: nome,
          email_contato: email,
          telefone: null, // Agora é nullable
          role: 'lojista'
        });
        
      if (profileError) {
        console.error('Erro ao criar perfil de lojista:', profileError);
        throw profileError;
      }
      
      console.log('Perfil de lojista criado com sucesso');
    } else {
      const { error: profileError } = await supabase
        .from('perfis_consumidores')
        .insert({
          user_id: userId,
          nome: nome,
          email: email,
          role: 'consumidor'
        });
        
      if (profileError) {
        console.error('Erro ao criar perfil de consumidor:', profileError);
        throw profileError;
      }
      
      console.log('Perfil de consumidor criado com sucesso');
    }
  } catch (error: any) {
    console.error('Erro ao criar perfil:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<{ role: 'lojista' | 'consumidor' } | null> => {
  try {
    console.log('Buscando perfil para usuário:', userId);
    
    // Primeiro, tentamos encontrar na tabela de consumidores
    const { data: consumidorData, error: consumidorError } = await supabase
      .from('perfis_consumidores')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (consumidorError && consumidorError.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil de consumidor:', consumidorError);
    }
      
    if (consumidorData) {
      console.log('Perfil de consumidor encontrado');
      return { role: 'consumidor' };
    }
    
    // Se não encontrou como consumidor, tenta como lojista
    const { data: lojistaData, error: lojistaError } = await supabase
      .from('perfis_lojistas')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (lojistaError && lojistaError.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil de lojista:', lojistaError);
    }
      
    if (lojistaData) {
      console.log('Perfil de lojista encontrado');
      return { role: 'lojista' };
    }
    
    console.log('Nenhum perfil encontrado para o usuário');
    return null;
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const response = await supabase.auth.getSession();
    console.log('Sessão atual:', response);
    return response;
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return { data: { session: null }, error };
  }
};

export const subscribeToAuthChanges = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
