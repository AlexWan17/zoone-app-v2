
-- Ajustar tabela perfis_lojistas para tornar telefone nullable
ALTER TABLE public.perfis_lojistas 
ALTER COLUMN telefone DROP NOT NULL;

-- Criar políticas RLS para permitir insert de perfis pelos próprios usuários
CREATE POLICY "Users can insert their own profile" 
ON public.perfis_consumidores 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.perfis_lojistas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Habilitar RLS nas tabelas se ainda não estiver habilitado
ALTER TABLE public.perfis_consumidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_lojistas ENABLE ROW LEVEL SECURITY;

-- Criar políticas para select também
CREATE POLICY "Users can view their own profile" 
ON public.perfis_consumidores 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" 
ON public.perfis_lojistas 
FOR SELECT 
USING (auth.uid() = user_id);
