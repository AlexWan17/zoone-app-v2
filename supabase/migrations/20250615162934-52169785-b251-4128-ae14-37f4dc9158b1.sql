
-- Habilitar RLS na tabela pedidos
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT para consumidores autenticados (os próprios usuários)
CREATE POLICY "Consumidor pode criar pedido" ON public.pedidos
  FOR INSERT
  WITH CHECK (consumidor_id = auth.uid());

-- Permitir SELECT apenas dos próprios pedidos
CREATE POLICY "Consumidor pode ver seus próprios pedidos" ON public.pedidos
  FOR SELECT
  USING (consumidor_id = auth.uid());

-- Permitir UPDATE apenas dos próprios pedidos
CREATE POLICY "Consumidor pode atualizar apenas seus próprios pedidos" ON public.pedidos
  FOR UPDATE
  USING (consumidor_id = auth.uid());
