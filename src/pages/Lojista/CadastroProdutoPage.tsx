
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LojistaLayout from '@/components/LojistaLayout';
import ProductForm from '@/components/ProductForm';
import { Produto, Filial, EstoqueFilial } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const CadastroProdutoPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: produtoId } = useParams<{ id: string }>();
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFiliais, setIsLoadingFiliais] = useState(true);
  const [isLoadingProduto, setIsLoadingProduto] = useState(!!produtoId);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);
  const [estoquesEdicao, setEstoquesEdicao] = useState<EstoqueFilial[]>([]);

  useEffect(() => {
    fetchFiliais();
    if (produtoId) {
      fetchProdutoEEstoque(produtoId);
    }
  }, [produtoId]);

  const fetchFiliais = async () => {
    try {
      console.log("CadastroProdutoPage - fetchFiliais - INICIO");
      const { data, error } = await supabase
        .from('filiais')
        .select('*')
        .order('nome_filial');

      if (error) {
        console.error("CadastroProdutoPage - fetchFiliais - ERRO:", error);
        throw error;
      }

      console.log("CadastroProdutoPage - fetchFiliais - data:", data);
      setFiliais(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhuma filial encontrada. Cadastre uma filial antes de criar produtos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("CadastroProdutoPage - fetchFiliais - ERRO CAPTURADO:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar filiais",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFiliais(false);
    }
  };

  // Novo: buscar dados do produto e estoques
  const fetchProdutoEEstoque = async (produtoId: string) => {
    try {
      setIsLoadingProduto(true);
      const { data: produto, error: prodError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', produtoId)
        .maybeSingle();
      if (prodError) {
        console.error("CadastroProdutoPage - fetchProdutoEEstoque - ERRO PRODUTO:", prodError);
        throw prodError;
      }
      // Fix status_venda type
      const produtoComTipagem: Produto = {
        ...produto,
        status_venda: (["ativo", "pausado", "inativo"].includes(produto.status_venda)
          ? produto.status_venda
          : "ativo") as "ativo" | "pausado" | "inativo"
      };
      setProdutoEdicao(produtoComTipagem);

      // Busca estoques deste produto
      const { data: estoques, error: estError } = await supabase
        .from('estoque_filial')
        .select('*')
        .eq('produto_id', produtoId);
      if (estError) {
        console.error("CadastroProdutoPage - fetchProdutoEEstoque - ERRO ESTOQUE:", estError);
        throw estError;
      }
      setEstoquesEdicao(estoques || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produto para edição",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProduto(false);
    }
  };

  // Novo: Handle para update ou insert
  const handleSubmit = async (
    produtoData: Partial<Produto>,
    estoqueData: Partial<EstoqueFilial>[]
  ) => {
    try {
      setIsLoading(true);
      if (produtoId && produtoEdicao) {
        // Atualizar produto existente
        const { error: updateError } = await supabase
          .from('produtos')
          .update({
            nome: produtoData.nome,
            descricao: produtoData.descricao,
            categoria_id: produtoData.categoria_id,
            imagem_url: produtoData.imagem_url,
            status_venda: produtoData.status_venda,
            ativo: produtoData.ativo !== undefined ? produtoData.ativo : true,
            preco_venda: 0
          })
          .eq('id', produtoId);

        if (updateError) throw updateError;

        // Atualizar o estoque por filial: para simplicidade, faz upsert
        for (const estoque of estoqueData) {
          if (!estoque.filial_id) continue;
          const { data: existing, error: findError } = await supabase
            .from('estoque_filial')
            .select('id')
            .eq('produto_id', produtoId)
            .eq('filial_id', estoque.filial_id)
            .maybeSingle();

          if (findError) continue;

          if (existing) {
            // update existente
            await supabase
              .from('estoque_filial')
              .update({
                quantidade: estoque.quantidade || 0,
                preco: estoque.preco || 0,
                reservavel: estoque.reservavel ?? true,
                tempo_max_reserva: estoque.tempo_max_reserva ?? 24,
                desconto_min: estoque.desconto_min ?? 0,
                desconto_max: estoque.desconto_max ?? 0,
                localizacao_fisica: estoque.localizacao_fisica || "",
              })
              .eq('id', existing.id);
          } else {
            // criar nova entrada para filial
            await supabase
              .from('estoque_filial')
              .insert({
                produto_id: produtoId,
                filial_id: estoque.filial_id,
                quantidade: estoque.quantidade || 0,
                preco: estoque.preco || 0,
                reservavel: estoque.reservavel ?? true,
                tempo_max_reserva: estoque.tempo_max_reserva ?? 24,
                desconto_min: estoque.desconto_min ?? 0,
                desconto_max: estoque.desconto_max ?? 0,
                localizacao_fisica: estoque.localizacao_fisica || "",
              })
          }
        }

        toast({
          title: "Sucesso!",
          description: "Produto atualizado com sucesso!",
        });
        navigate(`/lojista/produtos`);
        return;
      }

      // --- Fluxo padrão de cadastro novo ---
      // Obter o usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar o lojista_id do usuário atual
      const { data: lojistaData, error: lojistaError } = await supabase
        .from('lojistas')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (lojistaError || !lojistaData) {
        throw new Error("Lojista não encontrado para o usuário atual");
      }

      // 1. Criar o produto
      const { data: novoProduto, error: produtoError } = await supabase
        .from('produtos')
        .insert({
          nome: produtoData.nome,
          descricao: produtoData.descricao,
          categoria_id: produtoData.categoria_id,
          imagem_url: produtoData.imagem_url,
          lojista_id: lojistaData.id,
          ativo: true,
          status_venda: 'ativo',
          preco_venda: 0 // Will be set per filial
        })
        .select()
        .single();

      if (produtoError) {
        throw new Error(`Erro ao criar produto: ${produtoError.message}`);
      }

      // 2. Criar o estoque para cada filial
      const estoqueParaInserir = estoqueData.map(estoque => ({
        produto_id: novoProduto.id,
        filial_id: estoque.filial_id,
        quantidade: estoque.quantidade || 0,
        preco: estoque.preco || 0,
        reservavel: estoque.reservavel || false,
        tempo_max_reserva: estoque.tempo_max_reserva || 24,
        desconto_min: estoque.desconto_min || 0,
        desconto_max: estoque.desconto_max || 0,
        localizacao_fisica: estoque.localizacao_fisica || "",
      }));

      const { error: estoqueError } = await supabase
        .from('estoque_filial')
        .insert(estoqueParaInserir);

      if (estoqueError) {
        // Se falhar, tentar deletar o produto criado
        await supabase.from('produtos').delete().eq('id', novoProduto.id);
        throw new Error(`Erro ao criar estoque: ${estoqueError.message}`);
      }

      toast({
        title: "Sucesso!",
        description: "Produto cadastrado com sucesso!",
      });
      navigate(`/lojista/produtos`);

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido ao salvar produto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingFiliais || isLoadingProduto) {
    return (
      <LojistaLayout title="Carregando...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </LojistaLayout>
    );
  }

  return (
    <LojistaLayout title={produtoId ? "Editar Produto" : "Cadastrar Produto"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{produtoId ? "Editar Produto" : "Cadastrar Novo Produto"}</h1>
          <p className="text-gray-600">{produtoId ? "Altere os dados do produto e estoque abaixo." : "Preencha as informações do produto e configure o estoque por filial"}</p>
        </div>

        <ProductForm
          filiais={filiais}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          produto={produtoEdicao || undefined}
          estoqueInicial={produtoId ? estoquesEdicao : undefined}
        />
      </div>
    </LojistaLayout>
  );
};

export default CadastroProdutoPage;
