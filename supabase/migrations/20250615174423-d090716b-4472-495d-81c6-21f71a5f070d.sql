
-- Remover políticas antigas da tabela pedidos
DROP POLICY IF EXISTS "Consumidor pode criar pedido" ON public.pedidos;
DROP POLICY IF EXISTS "Consumidor pode ver seus próprios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Consumidor pode atualizar apenas seus próprios pedidos" ON public.pedidos;

-- Função Definer que retorna TRUE se o pedido (consumidor_id) está associado ao usuário autenticado
CREATE OR REPLACE FUNCTION public.pedido_pertence_ao_usuario(pedido_consumidor_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.perfis_consumidores pc
    WHERE pc.id = pedido_consumidor_id
      AND pc.user_id = auth.uid()
  );
$$;

-- Política INSERT: consumidor pode criar pedido se perfil vinculado ao user
CREATE POLICY "Consumidor pode criar pedido via perfil" ON public.pedidos
  FOR INSERT
  WITH CHECK (public.pedido_pertence_ao_usuario(consumidor_id));

-- Política SELECT: consumidor só vê seus próprios pedidos (via perfil)
CREATE POLICY "Consumidor só vê seu pedido via perfil" ON public.pedidos
  FOR SELECT
  USING (public.pedido_pertence_ao_usuario(consumidor_id));

-- Política UPDATE: consumidor só pode atualizar seus próprios pedidos (via perfil)
CREATE POLICY "Consumidor atualiza próprio pedido via perfil" ON public.pedidos
  FOR UPDATE
  USING (public.pedido_pertence_ao_usuario(consumidor_id));
