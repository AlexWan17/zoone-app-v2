export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categorias_produto: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          descricao: string | null
          icone: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      consumidores: {
        Row: {
          avatar_data: string | null
          email: string
          id: string
          nome: string
          user_id: string
        }
        Insert: {
          avatar_data?: string | null
          email: string
          id?: string
          nome: string
          user_id: string
        }
        Update: {
          avatar_data?: string | null
          email?: string
          id?: string
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      estoque_filial: {
        Row: {
          atualizado_em: string
          desconto_max: number | null
          desconto_min: number | null
          filial_id: string
          id: string
          localizacao_fisica: string | null
          preco: number
          produto_id: string
          quantidade: number
          reservavel: boolean | null
          tempo_max_reserva: number | null
        }
        Insert: {
          atualizado_em?: string
          desconto_max?: number | null
          desconto_min?: number | null
          filial_id: string
          id?: string
          localizacao_fisica?: string | null
          preco: number
          produto_id: string
          quantidade: number
          reservavel?: boolean | null
          tempo_max_reserva?: number | null
        }
        Update: {
          atualizado_em?: string
          desconto_max?: number | null
          desconto_min?: number | null
          filial_id?: string
          id?: string
          localizacao_fisica?: string | null
          preco?: number
          produto_id?: string
          quantidade?: number
          reservavel?: boolean | null
          tempo_max_reserva?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estoque_filial_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_filial_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      filiais: {
        Row: {
          atualizado_em: string
          criado_em: string
          email_filial: string
          endereco: string
          id: string
          latitude: number
          lojista_id: string
          longitude: number
          nome_filial: string
          telefone_filial: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          email_filial: string
          endereco: string
          id?: string
          latitude: number
          lojista_id: string
          longitude: number
          nome_filial: string
          telefone_filial: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          email_filial?: string
          endereco?: string
          id?: string
          latitude?: number
          lojista_id?: string
          longitude?: number
          nome_filial?: string
          telefone_filial?: string
        }
        Relationships: [
          {
            foreignKeyName: "filiais_lojista_id_fkey"
            columns: ["lojista_id"]
            isOneToOne: false
            referencedRelation: "perfis_lojistas"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_consumidor: {
        Row: {
          consumidor_id: string | null
          conteudo: Json
          data_interacao: string
          id: string
          tipo_interacao: string
        }
        Insert: {
          consumidor_id?: string | null
          conteudo: Json
          data_interacao?: string
          id?: string
          tipo_interacao: string
        }
        Update: {
          consumidor_id?: string | null
          conteudo?: Json
          data_interacao?: string
          id?: string
          tipo_interacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_consumidor_consumidor_id_fkey"
            columns: ["consumidor_id"]
            isOneToOne: false
            referencedRelation: "perfis_consumidores"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          error_msg: string | null
          file_name: string
          finished_at: string | null
          id: string
          imported_rows: number | null
          raw_file: string | null
          started_at: string
          status: string
          total_rows: number | null
          user_id: string
        }
        Insert: {
          error_msg?: string | null
          file_name: string
          finished_at?: string | null
          id?: string
          imported_rows?: number | null
          raw_file?: string | null
          started_at?: string
          status?: string
          total_rows?: number | null
          user_id: string
        }
        Update: {
          error_msg?: string | null
          file_name?: string
          finished_at?: string | null
          id?: string
          imported_rows?: number | null
          raw_file?: string | null
          started_at?: string
          status?: string
          total_rows?: number | null
          user_id?: string
        }
        Relationships: []
      }
      import_products_detail: {
        Row: {
          error_msg: string | null
          id: string
          imported_produto_id: string | null
          job_id: string | null
          raw_data: Json | null
          row_num: number
          status: string
        }
        Insert: {
          error_msg?: string | null
          id?: string
          imported_produto_id?: string | null
          job_id?: string | null
          raw_data?: Json | null
          row_num: number
          status?: string
        }
        Update: {
          error_msg?: string | null
          id?: string
          imported_produto_id?: string | null
          job_id?: string | null
          raw_data?: Json | null
          row_num?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_products_detail_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido: {
        Row: {
          id: string
          pedido_id: string
          preco_unitario_na_compra: number
          produto_id: string
          quantidade: number
        }
        Insert: {
          id?: string
          pedido_id: string
          preco_unitario_na_compra: number
          produto_id: string
          quantidade: number
        }
        Update: {
          id?: string
          pedido_id?: string
          preco_unitario_na_compra?: number
          produto_id?: string
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_pedido_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      lojistas: {
        Row: {
          created_at: string
          email_contato: string
          id: string
          nome_loja: string
          stripe_account_id: string | null
          telefone: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_contato: string
          id?: string
          nome_loja: string
          stripe_account_id?: string | null
          telefone: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_contato?: string
          id?: string
          nome_loja?: string
          stripe_account_id?: string | null
          telefone?: string
          user_id?: string
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          atualizado_em: string
          consumidor_id: string
          criado_em: string
          endereco_entrega: string | null
          filial_id: string
          frete: number
          id: string
          status: string
          stripe_payment_intent_id: string
          tipo_entrega: string
          total_bruto: number
          total_liquido: number
        }
        Insert: {
          atualizado_em?: string
          consumidor_id: string
          criado_em?: string
          endereco_entrega?: string | null
          filial_id: string
          frete: number
          id?: string
          status: string
          stripe_payment_intent_id: string
          tipo_entrega: string
          total_bruto: number
          total_liquido: number
        }
        Update: {
          atualizado_em?: string
          consumidor_id?: string
          criado_em?: string
          endereco_entrega?: string | null
          filial_id?: string
          frete?: number
          id?: string
          status?: string
          stripe_payment_intent_id?: string
          tipo_entrega?: string
          total_bruto?: number
          total_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_consumidor_id_fkey"
            columns: ["consumidor_id"]
            isOneToOne: false
            referencedRelation: "perfis_consumidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_consumidores: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string
          endereco: string | null
          estilo_vida: string | null
          frequencia_compras: string | null
          historico_buscas: string[] | null
          horarios_preferidos: string | null
          id: string
          nome: string
          objetivo_compras: string | null
          orcamento_mensal: number | null
          preferencias_categorias: string[] | null
          preferencias_entrega: string | null
          produtos_favoritos: string[] | null
          restricoes_alimentares: string[] | null
          role: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email: string
          endereco?: string | null
          estilo_vida?: string | null
          frequencia_compras?: string | null
          historico_buscas?: string[] | null
          horarios_preferidos?: string | null
          id?: string
          nome: string
          objetivo_compras?: string | null
          orcamento_mensal?: number | null
          preferencias_categorias?: string[] | null
          preferencias_entrega?: string | null
          produtos_favoritos?: string[] | null
          restricoes_alimentares?: string[] | null
          role?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string
          endereco?: string | null
          estilo_vida?: string | null
          frequencia_compras?: string | null
          historico_buscas?: string[] | null
          horarios_preferidos?: string | null
          id?: string
          nome?: string
          objetivo_compras?: string | null
          orcamento_mensal?: number | null
          preferencias_categorias?: string[] | null
          preferencias_entrega?: string | null
          produtos_favoritos?: string[] | null
          restricoes_alimentares?: string[] | null
          role?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      perfis_lojistas: {
        Row: {
          certificacoes: string[] | null
          cnpj: string | null
          created_at: string | null
          descricao_loja: string | null
          dias_funcionamento: string[] | null
          email_contato: string
          endereco_sede: string | null
          especialidades: string[] | null
          facebook: string | null
          forma_pagamento_aceitas: string[] | null
          horario_funcionamento: string | null
          id: string
          instagram: string | null
          logo_url: string | null
          nome_loja: string
          nome_responsavel: string
          numero_funcionarios: number | null
          politicas_entrega: string | null
          razao_social: string | null
          role: string | null
          sobre_empresa: string | null
          stripe_account_id: string | null
          telefone: string | null
          tempo_mercado: number | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          certificacoes?: string[] | null
          cnpj?: string | null
          created_at?: string | null
          descricao_loja?: string | null
          dias_funcionamento?: string[] | null
          email_contato: string
          endereco_sede?: string | null
          especialidades?: string[] | null
          facebook?: string | null
          forma_pagamento_aceitas?: string[] | null
          horario_funcionamento?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          nome_loja: string
          nome_responsavel: string
          numero_funcionarios?: number | null
          politicas_entrega?: string | null
          razao_social?: string | null
          role?: string | null
          sobre_empresa?: string | null
          stripe_account_id?: string | null
          telefone?: string | null
          tempo_mercado?: number | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          certificacoes?: string[] | null
          cnpj?: string | null
          created_at?: string | null
          descricao_loja?: string | null
          dias_funcionamento?: string[] | null
          email_contato?: string
          endereco_sede?: string | null
          especialidades?: string[] | null
          facebook?: string | null
          forma_pagamento_aceitas?: string[] | null
          horario_funcionamento?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          nome_loja?: string
          nome_responsavel?: string
          numero_funcionarios?: number | null
          politicas_entrega?: string | null
          razao_social?: string | null
          role?: string | null
          sobre_empresa?: string | null
          stripe_account_id?: string | null
          telefone?: string | null
          tempo_mercado?: number | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean
          atualizado_em: string
          categoria_id: string | null
          codigo_barras: string | null
          cores_disponiveis: string[] | null
          criado_em: string
          dados_gs1: Json | null
          desconto_percentual: number | null
          descricao: string
          dimensoes: Json | null
          entrega_disponivel: boolean | null
          erp_integrado: string | null
          id: string
          imagem_url: string[] | null
          lojista_id: string
          marca: string | null
          modelo: string | null
          nome: string
          peso: number | null
          preco_venda: number
          promocao_ativa: boolean | null
          reservavel: boolean | null
          retirada_loja: boolean | null
          status_venda: string | null
          tags: string[] | null
          tamanhos_disponiveis: string[] | null
          tempo_reserva_em_minutos: number | null
          tipo_tecido: string | null
          token_zoone_ativo: boolean | null
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          categoria_id?: string | null
          codigo_barras?: string | null
          cores_disponiveis?: string[] | null
          criado_em?: string
          dados_gs1?: Json | null
          desconto_percentual?: number | null
          descricao: string
          dimensoes?: Json | null
          entrega_disponivel?: boolean | null
          erp_integrado?: string | null
          id?: string
          imagem_url?: string[] | null
          lojista_id: string
          marca?: string | null
          modelo?: string | null
          nome: string
          peso?: number | null
          preco_venda?: number
          promocao_ativa?: boolean | null
          reservavel?: boolean | null
          retirada_loja?: boolean | null
          status_venda?: string | null
          tags?: string[] | null
          tamanhos_disponiveis?: string[] | null
          tempo_reserva_em_minutos?: number | null
          tipo_tecido?: string | null
          token_zoone_ativo?: boolean | null
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          categoria_id?: string | null
          codigo_barras?: string | null
          cores_disponiveis?: string[] | null
          criado_em?: string
          dados_gs1?: Json | null
          desconto_percentual?: number | null
          descricao?: string
          dimensoes?: Json | null
          entrega_disponivel?: boolean | null
          erp_integrado?: string | null
          id?: string
          imagem_url?: string[] | null
          lojista_id?: string
          marca?: string | null
          modelo?: string | null
          nome?: string
          peso?: number | null
          preco_venda?: number
          promocao_ativa?: boolean | null
          reservavel?: boolean | null
          retirada_loja?: boolean | null
          status_venda?: string | null
          tags?: string[] | null
          tamanhos_disponiveis?: string[] | null
          tempo_reserva_em_minutos?: number | null
          tipo_tecido?: string | null
          token_zoone_ativo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_produto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_lojista_id_fkey"
            columns: ["lojista_id"]
            isOneToOne: false
            referencedRelation: "lojistas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos_filiais: {
        Row: {
          atualizado_em: string
          criado_em: string
          desconto_filial: number | null
          estoque_disponivel: number
          filial_id: string
          id: string
          localizacao_fisica: string | null
          preco_filial: number | null
          produto_id: string
          promocao_filial: boolean | null
          reservado: number | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          desconto_filial?: number | null
          estoque_disponivel?: number
          filial_id: string
          id?: string
          localizacao_fisica?: string | null
          preco_filial?: number | null
          produto_id: string
          promocao_filial?: boolean | null
          reservado?: number | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          desconto_filial?: number | null
          estoque_disponivel?: number
          filial_id?: string
          id?: string
          localizacao_fisica?: string | null
          preco_filial?: number | null
          produto_id?: string
          promocao_filial?: boolean | null
          reservado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_filiais_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_filiais_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      recomendacoes: {
        Row: {
          consumidor_id: string
          id: string
          produto_id: string
          score: number
          tipo: string
        }
        Insert: {
          consumidor_id: string
          id?: string
          produto_id: string
          score: number
          tipo: string
        }
        Update: {
          consumidor_id?: string
          id?: string
          produto_id?: string
          score?: number
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "recomendacoes_consumidor_id_fkey"
            columns: ["consumidor_id"]
            isOneToOne: false
            referencedRelation: "consumidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recomendacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      regras_frete: {
        Row: {
          area_geografica: string
          filial_id: string
          id: string
          tipo: string
          valor: number
          valor_minimo_pedido: number | null
        }
        Insert: {
          area_geografica: string
          filial_id: string
          id?: string
          tipo: string
          valor: number
          valor_minimo_pedido?: number | null
        }
        Update: {
          area_geografica?: string
          filial_id?: string
          id?: string
          tipo?: string
          valor?: number
          valor_minimo_pedido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "regras_frete_filial_id_fkey"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          atualizado_em: string
          consumidor_id: string
          criado_em: string
          expira_em: string
          filial_id: string
          id: string
          preco_reserva: number
          produto_id: string
          quantidade: number
          status: string
        }
        Insert: {
          atualizado_em?: string
          consumidor_id: string
          criado_em?: string
          expira_em: string
          filial_id: string
          id?: string
          preco_reserva: number
          produto_id: string
          quantidade: number
          status?: string
        }
        Update: {
          atualizado_em?: string
          consumidor_id?: string
          criado_em?: string
          expira_em?: string
          filial_id?: string
          id?: string
          preco_reserva?: number
          produto_id?: string
          quantidade?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reservas_consumidor"
            columns: ["consumidor_id"]
            isOneToOne: false
            referencedRelation: "consumidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reservas_filial"
            columns: ["filial_id"]
            isOneToOne: false
            referencedRelation: "filiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_reservas_produto"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          pedido_id: string
          status: string
          stripe_payment_intent_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          pedido_id: string
          status: string
          stripe_payment_intent_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          pedido_id?: string
          status?: string
          stripe_payment_intent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_payments_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      zoone_comissoes: {
        Row: {
          created_at: string
          id: string
          pedido_id: string
          percentual: number
          valor: number
        }
        Insert: {
          created_at?: string
          id?: string
          pedido_id: string
          percentual?: number
          valor: number
        }
        Update: {
          created_at?: string
          id?: string
          pedido_id?: string
          percentual?: number
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "zoone_comissoes_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrementar_estoque: {
        Args: {
          produto_id_param: string
          filial_id_param: string
          quantidade_param: number
        }
        Returns: undefined
      }
      decrementar_estoque_com_reserva: {
        Args: {
          produto_id_param: string
          filial_id_param: string
          quantidade_param: number
          tipo_operacao?: string
        }
        Returns: boolean
      }
      expirar_reservas_vencidas: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      liberar_reserva: {
        Args: {
          produto_id_param: string
          filial_id_param: string
          quantidade_param: number
        }
        Returns: boolean
      }
      pedido_pertence_ao_usuario: {
        Args: { pedido_consumidor_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
