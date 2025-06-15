
// If this file exists, I'll append to it. If not, I'll create a new one.

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'lojista' | 'consumidor';
}

export interface Lojista {
  id: string;
  user_id: string;
  nome_loja: string;
  cnpj: string;
  descricao?: string;
  endereco_sede?: string;
  telefone?: string;
  email_contato?: string;
  site?: string;
  logo_url?: string;
  banner_url?: string;
  documentos?: string[];
  criado_em: string;
  atualizado_em: string;
}

export interface Filial {
  id: string;
  lojista_id: string;
  nome_filial: string;
  endereco: string;
  latitude: number;
  longitude: number;
  telefone_filial: string;
  email_filial: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Produto {
  id: string;
  lojista_id: string;
  nome: string;
  descricao: string;
  categoria: string;
  imagem_url: string[];
  criado_em: string;
  atualizado_em: string;
}

export interface EstoqueFilial {
  id: string;
  produto_id: string;
  filial_id: string;
  quantidade: number;
  preco: number;
  reservavel?: boolean;
  tempo_max_reserva?: number;
  desconto_min?: number;
  desconto_max?: number;
  localizacao_fisica?: string;
  atualizado_em: string;
}

export interface Pedido {
  id: string;
  cliente_id: string;
  lojista_id: string;
  filial_id: string;
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  valor_total: number;
  metodo_pagamento: string;
  criado_em: string;
  atualizado_em: string;
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
}

export interface Avaliacao {
  id: string;
  produto_id: string;
  cliente_id: string;
  nota: number;
  comentario?: string;
  data: string;
}

export interface UsuarioLoja {
  id: string;
  lojista_id: string;
  nome: string;
  email: string;
  cargo: string;
  permissoes: {
    filiais: boolean;
    produtos: boolean;
    pedidos: boolean;
    configuracoes: boolean;
  };
  criado_em: string;
}
