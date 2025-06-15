
-- PARTE 1: Corrigir RLS para itens_pedido
-- Políticas garantindo que o consumidor só insere, visualiza e altera itens do próprio pedido

-- Ativar RLS se não estiver ativado
ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

-- Cria política SELECT: só pode ler itens vinculados a pedidos que pertencem ao usuário autenticado
CREATE POLICY "Consumidor vê os itens dos próprios pedidos" ON public.itens_pedido
  FOR SELECT
  USING (
    public.pedido_pertence_ao_usuario(pedido_id)
  );

-- Cria política INSERT: só pode inserir itens em pedidos que pertencem ao usuário autenticado
CREATE POLICY "Consumidor insere itens em seus próprios pedidos" ON public.itens_pedido
  FOR INSERT
  WITH CHECK (
    public.pedido_pertence_ao_usuario(pedido_id)
  );

-- Cria política UPDATE: só pode atualizar itens de pedidos do usuário
CREATE POLICY "Consumidor atualiza itens de seus próprios pedidos" ON public.itens_pedido
  FOR UPDATE
  USING (
    public.pedido_pertence_ao_usuario(pedido_id)
  );

-- Cria política DELETE: só pode deletar itens de seus próprios pedidos
CREATE POLICY "Consumidor deleta itens dos próprios pedidos" ON public.itens_pedido
  FOR DELETE
  USING (
    public.pedido_pertence_ao_usuario(pedido_id)
  );
