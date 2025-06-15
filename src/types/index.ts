export interface User {
  id: string;
  email: string;
  role: 'lojista' | 'consumidor';
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Lojista {
  id: string;
  user_id: string;
  nome_loja: string;
  email_contato: string;
  telefone: string;
  endereco?: string;
  stripe_account_id?: string;
  created_at?: string;
  filiais?: FilialData[];
}

export interface FilialData {
  id: string;
  nome_filial: string;
  endereco: string;
  latitude: number;
  longitude: number;
  telefone_filial?: string;
  email_filial?: string;
  criado_em?: string;
  atualizado_em?: string;
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
  categoria_id: string;
  codigo_barras?: string;
  marca?: string;
  modelo?: string;
  peso?: number;
  dimensoes?: any;
  tags?: string[];
  imagem_url: string[];
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  
  // Novos campos obrigatórios
  preco_venda: number;
  promocao_ativa: boolean;
  desconto_percentual?: number;
  token_zoone_ativo: boolean;
  reservavel: boolean;
  tempo_reserva_em_minutos?: number;
  entrega_disponivel: boolean;
  retirada_loja: boolean;
  status_venda: 'ativo' | 'pausado' | 'inativo';
  erp_integrado?: string;
  dados_gs1?: any;
  tamanhos_disponiveis?: string[];
  cores_disponiveis?: string[];
  tipo_tecido?: string;
}

export interface EstoqueFilial {
  id: string;
  produto_id: string;
  filial_id: string;
  quantidade: number;
  preco: number;
  localizacao_fisica: string;
  atualizado_em: string;
  produto?: Produto;
  filial?: Filial;
  reservavel?: boolean;
  tempo_max_reserva?: number;
  desconto_min?: number;
  desconto_max?: number;
}

export interface RegraFrete {
  id: string;
  filial_id: string;
  tipo: 'fixo' | 'gratis_acima';
  valor: number;
  valor_minimo_pedido?: number;
  area_geografica: string;
}

export interface Consumidor {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  avatar_data?: string;
}

export interface Pedido {
  id: string;
  consumidor_id: string;
  filial_id: string;
  status: 'pendente' | 'processando' | 'pronto_retirada' | 'enviado' | 'entregue' | 'cancelado';
  total_bruto: number;
  frete: number;
  total_liquido: number;
  endereco_entrega?: string;
  tipo_entrega: 'entrega' | 'retirada_filial';
  stripe_payment_intent_id: string;
  criado_em: string;
  atualizado_em: string;
  filial?: Filial;
  consumidor?: Consumidor;
  itens?: ItemPedido[];
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario_na_compra: number;
  produto?: Produto;
}

export interface Recomendacao {
  id: string;
  consumidor_id: string;
  produto_id: string;
  score: number;
  tipo: 'complementar' | 'baseado_historico';
}

export interface CartItem {
  produto: Produto;
  filial: Filial;
  quantidade: number;
  preco: number;
}

export interface ProdutoEstoque extends Produto {
  estoque: EstoqueFilial[];
  estoque_filiais?: ProdutoFilial[];
}

export interface StripePayment {
  id: string;
  pedido_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  updated_at: string;
}

export interface ZooneComissao {
  id: string;
  pedido_id: string;
  valor: number;
  percentual: number;
  created_at: string;
}

export interface ProdutoFilial {
  id: string;
  produto_id: string;
  filial_id: string;
  estoque_disponivel: number;
  preco_filial?: number;
  promocao_filial: boolean;
  desconto_filial?: number;
  localizacao_fisica?: string;
  reservado: number;
  atualizado_em: string;
  criado_em: string;
  produto?: Produto;
  filial?: Filial;
}

export interface Reserva {
  id: string;
  consumidor_id: string;
  produto_id: string;
  filial_id: string;
  quantidade: number;
  preco_reserva: number;
  status: 'ativa' | 'confirmada' | 'cancelada' | 'expirada';
  expira_em: string;
  criado_em: string;
  atualizado_em: string;
  produto?: {
    nome: string;
    codigo_barras?: string;
  };
  filial?: {
    nome_filial: string;
  };
  consumidor?: {
    nome: string;
    email: string;
  };
}
