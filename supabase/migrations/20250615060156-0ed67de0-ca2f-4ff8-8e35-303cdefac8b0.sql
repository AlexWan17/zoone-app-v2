
-- Extensão da tabela produtos com novos campos
ALTER TABLE public.produtos 
ADD COLUMN preco_venda NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN promocao_ativa BOOLEAN DEFAULT false,
ADD COLUMN desconto_percentual NUMERIC,
ADD COLUMN token_zoone_ativo BOOLEAN DEFAULT false,
ADD COLUMN reservavel BOOLEAN DEFAULT false,
ADD COLUMN tempo_reserva_em_minutos INTEGER,
ADD COLUMN entrega_disponivel BOOLEAN DEFAULT false,
ADD COLUMN retirada_loja BOOLEAN DEFAULT true,
ADD COLUMN status_venda TEXT DEFAULT 'ativo' CHECK (status_venda IN ('ativo', 'pausado', 'inativo')),
ADD COLUMN erp_integrado TEXT,
ADD COLUMN dados_gs1 JSONB,
ADD COLUMN tamanhos_disponiveis TEXT[],
ADD COLUMN cores_disponiveis TEXT[],
ADD COLUMN tipo_tecido TEXT;

-- Criar nova tabela produtos_filiais para mapear estoque por filial
CREATE TABLE public.produtos_filiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  filial_id UUID NOT NULL REFERENCES filiais(id) ON DELETE CASCADE,
  estoque_disponivel INTEGER NOT NULL DEFAULT 0,
  preco_filial NUMERIC, -- Permite preço específico por filial
  promocao_filial BOOLEAN DEFAULT false, -- Promoção específica da filial
  desconto_filial NUMERIC, -- Desconto específico da filial
  localizacao_fisica TEXT, -- Localização física do produto na filial
  reservado INTEGER DEFAULT 0, -- Quantidade reservada
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraint para evitar duplicatas
  UNIQUE(produto_id, filial_id)
);

-- Índices para performance
CREATE INDEX idx_produtos_filiais_produto_id ON public.produtos_filiais(produto_id);
CREATE INDEX idx_produtos_filiais_filial_id ON public.produtos_filiais(filial_id);
CREATE INDEX idx_produtos_filiais_estoque ON public.produtos_filiais(estoque_disponivel);
CREATE INDEX idx_produtos_status_venda ON public.produtos(status_venda);
CREATE INDEX idx_produtos_promocao_ativa ON public.produtos(promocao_ativa);

-- Trigger para atualizar timestamp
CREATE TRIGGER update_produtos_filiais_updated_at
    BEFORE UPDATE ON public.produtos_filiais
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies para produtos_filiais
ALTER TABLE public.produtos_filiais ENABLE ROW LEVEL SECURITY;

-- Policy para lojistas verem apenas produtos de suas filiais
CREATE POLICY "Lojistas podem ver estoque de suas filiais" 
  ON public.produtos_filiais 
  FOR SELECT 
  USING (
    filial_id IN (
      SELECT f.id 
      FROM filiais f 
      JOIN lojistas l ON f.lojista_id = l.id 
      WHERE l.user_id = auth.uid()
    )
  );

-- Policy para lojistas modificarem estoque de suas filiais
CREATE POLICY "Lojistas podem modificar estoque de suas filiais" 
  ON public.produtos_filiais 
  FOR ALL 
  USING (
    filial_id IN (
      SELECT f.id 
      FROM filiais f 
      JOIN lojistas l ON f.lojista_id = l.id 
      WHERE l.user_id = auth.uid()
    )
  );

-- Policy para consumidores verem apenas produtos disponíveis
CREATE POLICY "Consumidores podem ver produtos disponíveis" 
  ON public.produtos_filiais 
  FOR SELECT 
  USING (estoque_disponivel > 0);

-- Função para decrementar estoque com reserva
CREATE OR REPLACE FUNCTION public.decrementar_estoque_com_reserva(
  produto_id_param UUID, 
  filial_id_param UUID, 
  quantidade_param INTEGER,
  tipo_operacao TEXT DEFAULT 'venda' -- 'venda' ou 'reserva'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  estoque_atual INTEGER;
  reservado_atual INTEGER;
BEGIN
  -- Buscar estoque atual
  SELECT estoque_disponivel, reservado 
  INTO estoque_atual, reservado_atual
  FROM public.produtos_filiais 
  WHERE produto_id = produto_id_param AND filial_id = filial_id_param;
  
  -- Verificar se há estoque suficiente
  IF estoque_atual IS NULL THEN
    RETURN FALSE; -- Produto não encontrado na filial
  END IF;
  
  IF tipo_operacao = 'reserva' THEN
    -- Para reserva, verificar se há estoque disponível (não reservado)
    IF (estoque_atual - reservado_atual) < quantidade_param THEN
      RETURN FALSE; -- Estoque insuficiente para reserva
    END IF;
    
    -- Aumentar quantidade reservada
    UPDATE public.produtos_filiais 
    SET reservado = reservado + quantidade_param,
        atualizado_em = NOW()
    WHERE produto_id = produto_id_param AND filial_id = filial_id_param;
    
  ELSE -- tipo_operacao = 'venda'
    -- Para venda, decrementar do estoque total
    IF estoque_atual < quantidade_param THEN
      RETURN FALSE; -- Estoque insuficiente
    END IF;
    
    UPDATE public.produtos_filiais 
    SET estoque_disponivel = estoque_disponivel - quantidade_param,
        atualizado_em = NOW()
    WHERE produto_id = produto_id_param AND filial_id = filial_id_param;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Função para liberar reserva
CREATE OR REPLACE FUNCTION public.liberar_reserva(
  produto_id_param UUID, 
  filial_id_param UUID, 
  quantidade_param INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.produtos_filiais 
  SET reservado = GREATEST(0, reservado - quantidade_param),
      atualizado_em = NOW()
  WHERE produto_id = produto_id_param 
    AND filial_id = filial_id_param
    AND reservado >= quantidade_param;
    
  RETURN FOUND;
END;
$$;
