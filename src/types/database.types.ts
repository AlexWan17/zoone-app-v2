export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      perfis_lojistas: {
        Row: {
          id: string
          user_id: string
          nome_loja: string
          nome_responsavel: string
          email_contato: string
          telefone: string | null
          cnpj: string | null
          endereco_sede: string | null
          descricao_loja: string | null
          logo_url: string | null
          stripe_account_id: string | null
          role: string
          created_at: string
          updated_at: string
          razao_social: string | null
          tempo_mercado: number | null
          numero_funcionarios: number | null
          horario_funcionamento: string | null
          dias_funcionamento: string[] | null
          especialidades: string[] | null
          politicas_entrega: string | null
          forma_pagamento_aceitas: string[] | null
          certificacoes: string[] | null
          sobre_empresa: string | null
          facebook: string | null
          instagram: string | null
          website: string | null
        }
        Insert: {
          id?: string
          user_id: string
          nome_loja: string
          nome_responsavel: string
          email_contato: string
          telefone?: string | null
          cnpj?: string | null
          endereco_sede?: string | null
          descricao_loja?: string | null
          logo_url?: string | null
          stripe_account_id?: string | null
          role?: string
          created_at?: string
          updated_at?: string
          razao_social?: string | null
          tempo_mercado?: number | null
          numero_funcionarios?: number | null
          horario_funcionamento?: string | null
          dias_funcionamento?: string[] | null
          especialidades?: string[] | null
          politicas_entrega?: string | null
          forma_pagamento_aceitas?: string[] | null
          certificacoes?: string[] | null
          sobre_empresa?: string | null
          facebook?: string | null
          instagram?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          nome_loja?: string
          nome_responsavel?: string
          email_contato?: string
          telefone?: string | null
          cnpj?: string | null
          endereco_sede?: string | null
          descricao_loja?: string | null
          logo_url?: string | null
          stripe_account_id?: string | null
          role?: string
          created_at?: string
          updated_at?: string
          razao_social?: string | null
          tempo_mercado?: number | null
          numero_funcionarios?: number | null
          horario_funcionamento?: string | null
          dias_funcionamento?: string[] | null
          especialidades?: string[] | null
          politicas_entrega?: string | null
          forma_pagamento_aceitas?: string[] | null
          certificacoes?: string[] | null
          sobre_empresa?: string | null
          facebook?: string | null
          instagram?: string | null
          website?: string | null
        }
      }
      perfis_consumidores: {
        Row: {
          id: string
          user_id: string
          nome: string
          email: string
          telefone: string | null
          endereco: string | null
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
          data_nascimento: string | null
          preferencias_entrega: string | null
          horarios_preferidos: string | null
          orcamento_mensal: number | null
          estilo_vida: string | null
          objetivo_compras: string | null
          frequencia_compras: string | null
          preferencias_categorias: string[] | null
          produtos_favoritos: string[] | null
          restricoes_alimentares: string[] | null
          historico_buscas: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          email: string
          telefone?: string | null
          endereco?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
          data_nascimento?: string | null
          preferencias_entrega?: string | null
          horarios_preferidos?: string | null
          orcamento_mensal?: number | null
          estilo_vida?: string | null
          objetivo_compras?: string | null
          frequencia_compras?: string | null
          preferencias_categorias?: string[] | null
          produtos_favoritos?: string[] | null
          restricoes_alimentares?: string[] | null
          historico_buscas?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          email?: string
          telefone?: string | null
          endereco?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
          updated_at?: string
          data_nascimento?: string | null
          preferencias_entrega?: string | null
          horarios_preferidos?: string | null
          orcamento_mensal?: number | null
          estilo_vida?: string | null
          objetivo_compras?: string | null
          frequencia_compras?: string | null
          preferencias_categorias?: string[] | null
          produtos_favoritos?: string[] | null
          restricoes_alimentares?: string[] | null
          historico_buscas?: string[] | null
        }
      }
      filiais: {
        Row: {
          id: string
          lojista_id: string
          nome_filial: string
          endereco: string
          latitude: number
          longitude: number
          telefone_filial: string
          email_filial: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          lojista_id: string
          nome_filial: string
          endereco: string
          latitude: number
          longitude: number
          telefone_filial: string
          email_filial: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          lojista_id?: string
          nome_filial?: string
          endereco?: string
          latitude?: number
          longitude?: number
          telefone_filial?: string
          email_filial?: string
          criado_em?: string
          atualizado_em?: string
        }
      }
      produtos: {
        Row: {
          id: string
          lojista_id: string
          nome: string
          descricao: string
          categoria: string
          imagem_url: string[]
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          lojista_id: string
          nome: string
          descricao: string
          categoria: string
          imagem_url?: string[]
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          lojista_id?: string
          nome?: string
          descricao?: string
          categoria?: string
          imagem_url?: string[]
          criado_em?: string
          atualizado_em?: string
        }
      }
      estoque_filial: {
        Row: {
          id: string
          produto_id: string
          filial_id: string
          quantidade: number
          preco: number
          localizacao_fisica: string
          atualizado_em: string
          reservavel: boolean
          tempo_max_reserva: number
          desconto_min: number
          desconto_max: number
        }
        Insert: {
          id?: string
          produto_id: string
          filial_id: string
          quantidade: number
          preco: number
          localizacao_fisica?: string
          atualizado_em?: string
          reservavel?: boolean
          tempo_max_reserva?: number
          desconto_min?: number
          desconto_max?: number
        }
        Update: {
          id?: string
          produto_id?: string
          filial_id?: string
          quantidade?: number
          preco?: number
          localizacao_fisica?: string
          atualizado_em?: string
          reservavel?: boolean
          tempo_max_reserva?: number
          desconto_min?: number
          desconto_max?: number
        }
      }
      consumidores: {
        Row: {
          id: string
          user_id: string
          nome: string
          email: string
          avatar_data?: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          email: string
          avatar_data?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          email?: string
          avatar_data?: string
        }
      }
      pedidos: {
        Row: {
          id: string
          consumidor_id: string
          filial_id: string
          status: 'pendente' | 'processando' | 'pronto_retirada' | 'enviado' | 'entregue' | 'cancelado'
          total_bruto: number
          frete: number
          total_liquido: number
          endereco_entrega?: string
          tipo_entrega: 'entrega' | 'retirada_filial'
          stripe_payment_intent_id: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          consumidor_id: string
          filial_id: string
          status?: 'pendente' | 'processando' | 'pronto_retirada' | 'enviado' | 'entregue' | 'cancelado'
          total_bruto: number
          frete: number
          total_liquido: number
          endereco_entrega?: string
          tipo_entrega?: 'entrega' | 'retirada_filial'
          stripe_payment_intent_id: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          consumidor_id?: string
          filial_id?: string
          status?: 'pendente' | 'processando' | 'pronto_retirada' | 'enviado' | 'entregue' | 'cancelado'
          total_bruto?: number
          frete?: number
          total_liquido?: number
          endereco_entrega?: string
          tipo_entrega?: 'entrega' | 'retirada_filial'
          stripe_payment_intent_id?: string
          criado_em?: string
          atualizado_em?: string
        }
      }
      itens_pedido: {
        Row: {
          id: string
          pedido_id: string
          produto_id: string
          quantidade: number
          preco_unitario_na_compra: number
        }
        Insert: {
          id?: string
          pedido_id: string
          produto_id: string
          quantidade: number
          preco_unitario_na_compra: number
        }
        Update: {
          id?: string
          pedido_id?: string
          produto_id?: string
          quantidade?: number
          preco_unitario_na_compra?: number
        }
      }
      regras_frete: {
        Row: {
          id: string
          filial_id: string
          tipo: 'fixo' | 'gratis_acima'
          valor: number
          valor_minimo_pedido?: number
          area_geografica: string
        }
        Insert: {
          id?: string
          filial_id: string
          tipo: 'fixo' | 'gratis_acima'
          valor: number
          valor_minimo_pedido?: number
          area_geografica: string
        }
        Update: {
          id?: string
          filial_id?: string
          tipo?: 'fixo' | 'gratis_acima'
          valor?: number
          valor_minimo_pedido?: number
          area_geografica?: string
        }
      }
      recomendacoes: {
        Row: {
          id: string
          consumidor_id: string
          produto_id: string
          score: number
          tipo: 'complementar' | 'baseado_historico'
        }
        Insert: {
          id?: string
          consumidor_id: string
          produto_id: string
          score: number
          tipo: 'complementar' | 'baseado_historico'
        }
        Update: {
          id?: string
          consumidor_id?: string
          produto_id?: string
          score?: number
          tipo?: 'complementar' | 'baseado_historico'
        }
      }
    }
  }
}
