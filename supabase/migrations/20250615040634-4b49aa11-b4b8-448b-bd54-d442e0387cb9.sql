
-- Remover todos os triggers que dependem das funções
DROP TRIGGER IF EXISTS after_user_insert ON auth.users;
DROP TRIGGER IF EXISTS ao_criar_usuario ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS criar_perfil_trigger ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- Agora remover as funções antigas que não são mais necessárias
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.criar_perfil_usuario();
DROP FUNCTION IF EXISTS public.criar_perfil_automatico();
DROP FUNCTION IF EXISTS public.create_user_profile();

-- Manter apenas a estrutura das tabelas de perfis sem triggers automáticos
-- Os perfis serão criados via aplicação conforme já implementado
