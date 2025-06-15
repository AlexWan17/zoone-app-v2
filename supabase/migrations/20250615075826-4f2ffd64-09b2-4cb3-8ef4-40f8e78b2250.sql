
-- Criar tabela de reservas para gerenciar produtos reservados
CREATE TABLE public.reservas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consumidor_id UUID NOT NULL,
  produto_id UUID NOT NULL,
  filial_id UUID NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_reserva NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa',
  expira_em TIMESTAMP WITH TIME ZONE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_reservas_produto FOREIGN KEY (produto_id) REFERENCES public.produtos(id),
  CONSTRAINT fk_reservas_filial FOREIGN KEY (filial_id) REFERENCES public.filiais(id),
  CONSTRAINT fk_reservas_consumidor FOREIGN KEY (consumidor_id) REFERENCES public.consumidores(id),
  CONSTRAINT chk_reservas_status CHECK (status IN ('ativa', 'confirmada', 'cancelada', 'expirada')),
  CONSTRAINT chk_reservas_quantidade CHECK (quantidade > 0)
);

-- Habilitar RLS na tabela de reservas
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Política para lojistas verem reservas de suas filiais
CREATE POLICY "Lojistas podem ver reservas de suas filiais" 
  ON public.reservas 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.filiais f 
      JOIN public.perfis_lojistas pl ON f.lojista_id = pl.id 
      WHERE f.id = reservas.filial_id AND pl.user_id = auth.uid()
    )
  );

-- Política para lojistas atualizarem reservas de suas filiais
CREATE POLICY "Lojistas podem atualizar reservas de suas filiais" 
  ON public.reservas 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.filiais f 
      JOIN public.perfis_lojistas pl ON f.lojista_id = pl.id 
      WHERE f.id = reservas.filial_id AND pl.user_id = auth.uid()
    )
  );

-- Habilitar RLS na tabela de filiais
ALTER TABLE public.filiais ENABLE ROW LEVEL SECURITY;

-- Política para lojistas verem suas próprias filiais
CREATE POLICY "Lojistas podem ver suas filiais" 
  ON public.filiais 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.perfis_lojistas pl 
      WHERE pl.id = filiais.lojista_id AND pl.user_id = auth.uid()
    )
  );

-- Política para lojistas criarem filiais
CREATE POLICY "Lojistas podem criar filiais" 
  ON public.filiais 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfis_lojistas pl 
      WHERE pl.id = filiais.lojista_id AND pl.user_id = auth.uid()
    )
  );

-- Política para lojistas atualizarem suas filiais
CREATE POLICY "Lojistas podem atualizar suas filiais" 
  ON public.filiais 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.perfis_lojistas pl 
      WHERE pl.id = filiais.lojista_id AND pl.user_id = auth.uid()
    )
  );

-- Política para lojistas excluírem suas filiais
CREATE POLICY "Lojistas podem excluir suas filiais" 
  ON public.filiais 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.perfis_lojistas pl 
      WHERE pl.id = filiais.lojista_id AND pl.user_id = auth.uid()
    )
  );

-- Função para expirar reservas automaticamente
CREATE OR REPLACE FUNCTION public.expirar_reservas_vencidas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.reservas 
  SET status = 'expirada', atualizado_em = now()
  WHERE status = 'ativa' AND expira_em < now();
  
  -- Liberar estoque reservado das reservas expiradas
  UPDATE public.produtos_filiais pf
  SET reservado = reservado - r.quantidade,
      atualizado_em = now()
  FROM public.reservas r
  WHERE r.produto_id = pf.produto_id 
    AND r.filial_id = pf.filial_id
    AND r.status = 'expirada'
    AND r.atualizado_em = now();
END;
$$;
