
-- Habilitar RLS na tabela produtos se ainda não estiver habilitado
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Política para lojistas visualizarem apenas seus próprios produtos
CREATE POLICY "Lojistas podem ver seus próprios produtos" 
  ON public.produtos 
  FOR SELECT 
  USING (
    lojista_id IN (
      SELECT l.id 
      FROM lojistas l 
      WHERE l.user_id = auth.uid()
    )
  );

-- Política para lojistas criarem produtos
CREATE POLICY "Lojistas podem criar produtos" 
  ON public.produtos 
  FOR INSERT 
  WITH CHECK (
    lojista_id IN (
      SELECT l.id 
      FROM lojistas l 
      WHERE l.user_id = auth.uid()
    )
  );

-- Política para lojistas atualizarem seus próprios produtos
CREATE POLICY "Lojistas podem atualizar seus próprios produtos" 
  ON public.produtos 
  FOR UPDATE 
  USING (
    lojista_id IN (
      SELECT l.id 
      FROM lojistas l 
      WHERE l.user_id = auth.uid()
    )
  );

-- Política para lojistas excluírem seus próprios produtos
CREATE POLICY "Lojistas podem excluir seus próprios produtos" 
  ON public.produtos 
  FOR DELETE 
  USING (
    lojista_id IN (
      SELECT l.id 
      FROM lojistas l 
      WHERE l.user_id = auth.uid()
    )
  );

-- Política para consumidores visualizarem produtos ativos
CREATE POLICY "Consumidores podem ver produtos ativos" 
  ON public.produtos 
  FOR SELECT 
  USING (ativo = true AND status_venda = 'ativo');
