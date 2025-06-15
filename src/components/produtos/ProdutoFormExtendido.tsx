import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import ImageUpload from '@/components/ImageUpload';

const formSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  descricao: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres." }),
  categoria_id: z.string().uuid({ message: "Categoria inválida." }),
  preco_custo: z.number(),
  preco_venda: z.number(),
  estoque_minimo: z.number(),
  status_venda: z.enum(['ativo', 'pausado', 'inativo']),
  ativo: z.boolean(),
  imagem_url: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

const ProdutoFormExtendido = () => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState<Partial<FormData>>({
    imagem_url: [],
  });

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      categoria_id: '',
      preco_custo: 0,
      preco_venda: 0,
      estoque_minimo: 0,
      status_venda: 'ativo',
      ativo: true,
      imagem_url: [],
    },
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      // Mock data since getCategorias doesn't exist in api
      setCategorias([
        { id: '1', nome: 'Eletrônicos' },
        { id: '2', nome: 'Roupas' },
        { id: '3', nome: 'Casa' },
        { id: '4', nome: 'Livros' }
      ]);
    };

    fetchCategorias();
  }, []);

  const onSubmit = async (data: FormData) => {
    console.log("Dados do formulário:", data);
    // Aqui você pode adicionar a lógica para enviar os dados para o backend
  };

  const handleImagesChange = useCallback((newImages: string[]) => {
    setFormData(prev => ({ ...prev, imagem_url: newImages }));
    setValue('imagem_url', newImages);
  }, [setValue]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto</Label>
            <Controller
              control={control}
              name="nome"
              render={({ field }) => (
                <Input id="nome" placeholder="Nome do produto" {...field} />
              )}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Controller
              control={control}
              name="descricao"
              render={({ field }) => (
                <Textarea id="descricao" placeholder="Descrição do produto" {...field} />
              )}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">{errors.descricao.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria_id">Categoria</Label>
            <Controller
              control={control}
              name="categoria_id"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria: any) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoria_id && (
              <p className="text-sm text-red-500">{errors.categoria_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco_custo">Preço de Custo</Label>
              <Controller
                control={control}
                name="preco_custo"
                render={({ field }) => (
                  <Input
                    id="preco_custo"
                    type="number"
                    placeholder="Preço de custo"
                    {...field}
                  />
                )}
              />
              {errors.preco_custo && (
                <p className="text-sm text-red-500">{errors.preco_custo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco_venda">Preço de Venda</Label>
              <Controller
                control={control}
                name="preco_venda"
                render={({ field }) => (
                  <Input
                    id="preco_venda"
                    type="number"
                    placeholder="Preço de venda"
                    {...field}
                  />
                )}
              />
              {errors.preco_venda && (
                <p className="text-sm text-red-500">{errors.preco_venda.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
            <Controller
              control={control}
              name="estoque_minimo"
              render={({ field }) => (
                <Input
                  id="estoque_minimo"
                  type="number"
                  placeholder="Estoque mínimo"
                  {...field}
                />
              )}
            />
            {errors.estoque_minimo && (
              <p className="text-sm text-red-500">{errors.estoque_minimo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status_venda">Status de Venda</Label>
            <Controller
              control={control}
              name="status_venda"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status_venda && (
              <p className="text-sm text-red-500">{errors.status_venda.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="ativo">Ativo</Label>
            <Controller
              control={control}
              name="ativo"
              render={({ field }) => (
                <Switch
                  id="ativo"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            {errors.ativo && (
              <p className="text-sm text-red-500">{errors.ativo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Imagens do Produto</Label>
            <ImageUpload 
              onImagesChange={handleImagesChange}
            />
            {formData.imagem_url?.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {formData.imagem_url.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Produto ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <Button type="submit">Cadastrar Produto</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProdutoFormExtendido;
