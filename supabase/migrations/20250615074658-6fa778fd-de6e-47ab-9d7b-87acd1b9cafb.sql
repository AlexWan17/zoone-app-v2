
-- Habilitar RLS na tabela estoque_filial se ainda não estiver habilitado
ALTER TABLE public.estoque_filial ENABLE ROW LEVEL SECURITY;

-- Política para lojistas visualizarem estoque apenas de seus próprios produtos
CREATE POLICY "Lojistas podem ver estoque de seus produtos" 
  ON public.estoque_filial 
  FOR SELECT 
  USING (
    produto_id IN (
      SELECT p.id 
      FROM produtos p 
      JOIN lojistas l ON p.lojista_id = l.id 
      WHERE l.user_id = auth.uid()
    )
  );

-- Política para lojistas criarem estoque apenas para seus próprios produtos
CREATE POLICY "Lojistas podem criar estoque de seus produtos" 
  ON public.estoque_filial 
  FOR INSERT 
  WITH CHECK (
    produto_id IN (
      SELECT p.id 
      FROM produtos p 
      JOIN lojistas l ON p.lojista_id = l.id 
      WHERE l.user_id = auth.uid()
    )
  );

-- Política para lojistas atualizarem estoque apenas de seus próprios produtos
CREATE POLICY "Lojistas podem atualizar estoque de seus produtos" 
  ON public.estoque_filial 
  FOR UPDATE 
  USING (
    produto_id IN (
      SELECT p.id 
      FROM produtos p 
      JOIN lojistas l ON p.lojista_id = l.id 
      WHERE l.user_id = auth.uid()
    )
  );

-- Política para lojistas excluírem estoque apenas de seus próprios produtos
CREATE POLICY "Lojistas podem excluir estoque de seus produtos" 
  ON public.estoque_filial 
  FOR DELETE 
  USING (
    produto_id IN (
      SELECT p.id 
      FROM produtos p 
      JOIN lojistas l ON p.lojista_id = l.id 
      WHERE l.user_id = auth.uid()
    )
  );

-- Política para consumidores visualizarem estoque de produtos ativos
CREATE POLICY "Consumidores podem ver estoque de produtos ativos" 
  ON public.estoque_filial 
  FOR SELECT 
  USING (
    produto_id IN (
      SELECT p.id 
      FROM produtos p 
      WHERE p.ativo = true AND p.status_venda = 'ativo'
    )
  );
