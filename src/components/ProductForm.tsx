
import { useState, useEffect } from 'react';
import { Produto, Filial, EstoqueFilial } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Plus } from "lucide-react";
import CategoriaSelect from './CategoriaSelect';

interface ProductFormProps {
  produto?: Produto;
  filiais: Filial[];
  estoqueInicial?: EstoqueFilial[];
  onSubmit: (produto: Partial<Produto>, estoque: Partial<EstoqueFilial>[]) => Promise<void>;
  isLoading?: boolean;
}

// Validação mais flexível e prática
const formSchema = z.object({
  nome: z.string().min(2, "Nome do produto deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
  imagens: z.array(z.string().url("URL inválida")).min(1, "Adicione pelo menos uma imagem"),
  estoque: z.array(z.object({
    filial_id: z.string().min(1, "Filial é obrigatória"),
    quantidade: z.number().int().min(0, "Quantidade não pode ser negativa"),
    preco: z.number().min(0, "Preço não pode ser negativo"),
    reservavel: z.boolean().optional().default(false),
    tempo_max_reserva: z.number().min(1).optional().default(24),
    desconto_min: z.number().min(0).max(100).optional().default(0),
    desconto_max: z.number().min(0).max(100).optional().default(0),
    localizacao_fisica: z.string().optional().default(""),
  })).min(1, "Configure o estoque para pelo menos uma filial")
});

type FormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFormProps> = ({ 
  produto, 
  filiais, 
  estoqueInicial = [],
  onSubmit, 
  isLoading 
}) => {
  const { toast } = useToast();
  const [imagemTemp, setImagemTemp] = useState('');
  
  console.log("ProductForm - RENDER - filiais:", filiais);
  console.log("ProductForm - RENDER - estoqueInicial:", estoqueInicial);

  // Função para criar estoque inicial para todas as filiais
  const criarEstoqueInicialCompleto = () => {
    console.log("ProductForm - criarEstoqueInicialCompleto - filiais:", filiais);
    
    if (filiais.length === 0) {
      console.warn("ProductForm - criarEstoqueInicialCompleto - NENHUMA FILIAL");
      return [];
    }

    const estoque = filiais.map(filial => {
      const item = {
        filial_id: filial.id,
        quantidade: 0,
        preco: 0,
        reservavel: false,
        tempo_max_reserva: 24,
        desconto_min: 0,
        desconto_max: 0,
        localizacao_fisica: "",
      };
      console.log(`ProductForm - criarEstoqueInicialCompleto - Filial ${filial.nome_filial}:`, item);
      return item;
    });

    return estoque;
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: produto?.nome || "",
      descricao: produto?.descricao || "",
      categoria_id: produto?.categoria_id || "",
      imagens: produto?.imagem_url || [],
      estoque: estoqueInicial.length > 0 ? 
        estoqueInicial.map(e => ({
          filial_id: e.filial_id,
          quantidade: e.quantidade || 0,
          preco: e.preco || 0,
          reservavel: e.reservavel || false,
          tempo_max_reserva: e.tempo_max_reserva || 24,
          desconto_min: e.desconto_min || 0,
          desconto_max: e.desconto_max || 0,
          localizacao_fisica: e.localizacao_fisica || "",
        })) : 
        criarEstoqueInicialCompleto()
    }
  });

  // Effect para configurar estoque quando filiais carregarem
  useEffect(() => {
    console.log("ProductForm useEffect - filiais.length:", filiais.length);
    
    if (filiais.length > 0) {
      const currentEstoque = form.getValues('estoque');
      console.log("ProductForm useEffect - currentEstoque:", currentEstoque);
      
      // Se não há estoque ou está vazio, criar para todas as filiais
      if (!currentEstoque || currentEstoque.length === 0) {
        const novoEstoque = criarEstoqueInicialCompleto();
        console.log("ProductForm useEffect - Configurando estoque:", novoEstoque);
        form.setValue('estoque', novoEstoque);
      }
      // Se há menos entradas de estoque que filiais, completar
      else if (currentEstoque.length < filiais.length) {
        const filiaisComEstoque = currentEstoque.map(e => e.filial_id);
        const filialsSemEstoque = filiais.filter(f => !filiaisComEstoque.includes(f.id));
        
        const estoqueAdicional = filialsSemEstoque.map(filial => ({
          filial_id: filial.id,
          quantidade: 0,
          preco: 0,
          reservavel: false,
          tempo_max_reserva: 24,
          desconto_min: 0,
          desconto_max: 0,
          localizacao_fisica: "",
        }));
        
        const estoqueCompleto = [...currentEstoque, ...estoqueAdicional];
        console.log("ProductForm useEffect - Completando estoque:", estoqueCompleto);
        form.setValue('estoque', estoqueCompleto);
      }
    }
  }, [filiais, form]);

  const handleAddImagem = () => {
    if (!imagemTemp.trim()) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL de imagem válida.",
        variant: "destructive",
      });
      return;
    }
    
    // Validação básica de URL
    try {
      new URL(imagemTemp);
    } catch {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive",
      });
      return;
    }
    
    const currentImages = form.getValues('imagens');
    form.setValue('imagens', [...currentImages, imagemTemp]);
    setImagemTemp('');
    form.trigger('imagens');
  };

  const handleRemoveImagem = (index: number) => {
    const currentImages = form.getValues('imagens');
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('imagens', newImages);
    form.trigger('imagens');
  };

  const handleSubmit = async (values: FormValues) => {
    console.log("=== INICIO SUBMIT PRODUCTFORM ===");
    console.log("ProductForm - handleSubmit - values:", JSON.stringify(values, null, 2));
    
    try {
      // Validações básicas
      if (filiais.length === 0) {
        toast({
          title: "Erro",
          description: "Nenhuma filial encontrada",
          variant: "destructive",
        });
        return;
      }

      if (!values.imagens || values.imagens.length === 0) {
        toast({
          title: "Erro",
          description: "Adicione pelo menos uma imagem",
          variant: "destructive",
        });
        return;
      }

      // Verificar se todos os estoques têm filial_id válido
      for (const estoque of values.estoque) {
        if (!estoque.filial_id) {
          toast({
            title: "Erro",
            description: "Erro de configuração: estoque sem filial associada",
            variant: "destructive",
          });
          return;
        }
        
        const filialExiste = filiais.find(f => f.id === estoque.filial_id);
        if (!filialExiste) {
          toast({
            title: "Erro",
            description: `Filial ${estoque.filial_id} não encontrada`,
            variant: "destructive",
          });
          return;
        }
      }

      // Preparar dados
      const produtoData: Partial<Produto> = {
        nome: values.nome,
        descricao: values.descricao,
        categoria_id: values.categoria_id,
        imagem_url: values.imagens,
      };
      
      const estoqueData: Partial<EstoqueFilial>[] = values.estoque.map(item => ({
        filial_id: item.filial_id,
        quantidade: item.quantidade,
        preco: item.preco,
        reservavel: item.reservavel || false,
        tempo_max_reserva: item.tempo_max_reserva || 24,
        desconto_min: item.desconto_min || 0,
        desconto_max: item.desconto_max || 0,
        localizacao_fisica: item.localizacao_fisica || "",
      }));
      
      console.log("ProductForm - handleSubmit - Dados preparados:");
      console.log("  produtoData:", produtoData);
      console.log("  estoqueData:", estoqueData);
      
      await onSubmit(produtoData, estoqueData);
      
    } catch (error) {
      console.error("ProductForm - handleSubmit - ERRO:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
    
    console.log("=== FIM SUBMIT PRODUCTFORM ===");
  };

  const getFilialNome = (filialId: string) => {
    const filial = filiais.find(f => f.id === filialId);
    return filial?.nome_filial || `Filial não encontrada (${filialId})`;
  };

  if (filiais.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          Carregando filiais ou nenhuma filial encontrada.
        </p>
        <p className="text-sm text-gray-400">
          É necessário ter pelo menos uma filial cadastrada para criar produtos.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoria_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <FormControl>
                    <CategoriaSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do produto" 
                      className="h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormItem>
              <FormLabel>Imagens do Produto *</FormLabel>
              <div className="flex space-x-2 mb-4">
                <Input
                  type="url"
                  value={imagemTemp}
                  onChange={(e) => setImagemTemp(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <Button
                  type="button"
                  onClick={handleAddImagem}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="imagens"
                render={() => (
                  <FormItem>
                    {form.watch('imagens').length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {form.watch('imagens').map((url, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={url} 
                              alt={`Imagem ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-md" 
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LmwzLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNjRMMTEwIDc0SDkwTDEwMCA2NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K';
                                e.currentTarget.title = 'Erro ao carregar imagem';
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 h-6 w-6 p-0"
                              onClick={() => handleRemoveImagem(index)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 border border-dashed rounded-md">
                        <p className="text-gray-500">Nenhuma imagem adicionada.</p>
                        <p className="text-sm text-red-500 mt-2">Pelo menos uma imagem é obrigatória</p>
                      </div>
                    )}
                    <FormMessage />
                    <FormDescription>
                      Adicione URLs de imagens válidas para o produto.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </FormItem>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Estoque por Filial</h3>
          
          <div className="space-y-6">
            {filiais.map((filial, index) => (
              <Card key={filial.id}>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-4">{filial.nome_filial}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`estoque.${index}.quantidade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade em Estoque *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                              value={field.value || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`estoque.${index}.preco`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              placeholder="0.00" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                              value={field.value || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name={`estoque.${index}.tempo_max_reserva`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo Máx. Reserva (horas)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="1"
                              placeholder="24"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 24)} 
                              value={field.value || 24}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`estoque.${index}.desconto_min`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desconto Mínimo (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                              value={field.value || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`estoque.${index}.desconto_max`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desconto Máximo (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                              value={field.value || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name={`estoque.${index}.reservavel`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Permite Reserva</FormLabel>
                            <FormDescription>
                              Permitir que clientes reservem este produto
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`estoque.${index}.localizacao_fisica`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Localização Física</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Corredor 5, Prateleira B"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`estoque.${index}.filial_id`}
                    render={({ field }) => (
                      <Input type="hidden" {...field} value={filial.id} />
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : produto ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
