
-- 1. Cria tabela para registrar cada tentativa de importação de produtos
CREATE TABLE public.import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'done', 'error'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  finished_at TIMESTAMP WITH TIME ZONE,
  error_msg TEXT,
  total_rows INTEGER,
  imported_rows INTEGER,
  raw_file BYTEA -- armazenamento temporário do arquivo original (opcional)
);

-- 2. Cria tabela para armazenamento detalhado das linhas importadas, resultados e erros linha-a-linha 
CREATE TABLE public.import_products_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.import_jobs(id),
  row_num INTEGER NOT NULL,
  raw_data JSONB, -- tudo da linha
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending','imported','error'
  error_msg TEXT,
  imported_produto_id UUID
);

-- 3. Ativa RLS para haver segurança
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_products_detail ENABLE ROW LEVEL SECURITY;

-- 4. Cada usuário só pode ver seus uploads
CREATE POLICY "Usuário vê só seus imports"
  ON public.import_jobs
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuário vê detalhes só dos seus jobs"
  ON public.import_products_detail
  FOR SELECT
  USING (
    job_id IN (SELECT id FROM public.import_jobs WHERE user_id = auth.uid())
  );

-- 5. User pode inserir seus jobs
CREATE POLICY "Usuário pode inserir seu próprio job"
  ON public.import_jobs
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 6. User pode inserir detalhes só de jobs dele
CREATE POLICY "Usuário pode inserir detalhes de seus jobs"
  ON public.import_products_detail
  FOR INSERT
  WITH CHECK (
    job_id IN (SELECT id FROM public.import_jobs WHERE user_id = auth.uid())
  );

