
export interface ProdutoBase {
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
}

export interface ProdutoExtendido extends ProdutoBase {
  // Preço e Promoção
  preco_venda: number;
  promocao_ativa: boolean;
  desconto_percentual?: number;
  
  // Tokenização
  token_zoone_ativo: boolean;
  
  // Reserva
  reservavel: boolean;
  tempo_reserva_em_minutos?: number;
  
  // Logística
  entrega_disponivel: boolean;
  retirada_loja: boolean;
  
  // Controle de Venda
  status_venda: 'ativo' | 'pausado' | 'inativo';
  
  // ERP e Código de Barras
  erp_integrado?: string;
  dados_gs1?: any;
  
  // Vestuário/Provador IA
  tamanhos_disponiveis?: string[];
  cores_disponiveis?: string[];
  tipo_tecido?: string;
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
  
  // Relacionamentos opcionais
  produto?: ProdutoExtendido;
  filial?: any;
}

export interface ProdutoComEstoque extends ProdutoExtendido {
  estoque_filiais: ProdutoFilial[];
}

// Tipos para criação e atualização
export type CreateProdutoData = Omit<ProdutoExtendido, 'id' | 'criado_em' | 'atualizado_em' | 'ativo'>;
export type UpdateProdutoData = Partial<Omit<ProdutoExtendido, 'id' | 'criado_em' | 'lojista_id'>>;

export type CreateProdutoFilialData = Omit<ProdutoFilial, 'id' | 'criado_em' | 'atualizado_em'>;
export type UpdateProdutoFilialData = Partial<Omit<ProdutoFilial, 'id' | 'criado_em'>>;
