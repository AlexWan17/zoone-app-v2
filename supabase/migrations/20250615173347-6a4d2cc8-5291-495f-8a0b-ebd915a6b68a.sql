
-- Remove o constraint existente de consumidor_id apontando para "consumidores"
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_consumidor_id_fkey;

-- Cria nova constraint apontando para perfis_consumidores
ALTER TABLE public.pedidos
  ADD CONSTRAINT pedidos_consumidor_id_fkey
  FOREIGN KEY (consumidor_id)
  REFERENCES public.perfis_consumidores(id)
  ON DELETE RESTRICT;
