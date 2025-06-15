import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Upload, X } from 'lucide-react';
import { ProdutoCompleto } from '@/services/productService';
import { Filial, EstoqueFilial } from '@/types';
import CategoriaSelect from './CategoriaSelect';
import ImageUpload from './ImageUpload';

interface ProductFormEnhancedProps {
  produto?: ProdutoCompleto;
  filiais: Filial[];
  estoqueInicial?: EstoqueFilial[];
  onSubmit: (produtoData: Partial<ProdutoCompleto>, estoqueData: Partial<EstoqueFilial>[]) => Promise<void>;
  isLoading?: boolean;
}

interface EstoqueFormData {
  filial_id: string;
  quantidade: number;
  preco: number;
  localizacao_fisica: string;
  reservavel: boolean;
  tempo_max_reserva: number;
  desconto_min: number;
  desconto_max: number;
}

const ProductFormEnhanced = ({ 
  produto, 
  filiais,
  estoqueInicial = [], 
  onSubmit, 
  isLoading = false 
}: ProductFormEnhancedProps) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>(produto?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [imagens, setImagens] = useState<string[]>(produto?.imagem_url || []);
  const [estoqueData, setEstoqueData] = useState<EstoqueFormData[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      nome: produto?.nome || '',
      descricao: produto?.descricao || '',
      categoria_id: produto?.categoria_id || '',
      codigo_barras: produto?.codigo_barras || '',
      marca: produto?.marca || '',
      modelo: produto?.modelo || '',
      peso: produto?.peso || 0,
      dimensoes: produto?.dimensoes || {},
    },
  });

  useEffect(() => {
    if (estoqueInicial.length > 0) {
      const estoqueFormatado = estoqueInicial.map(item => ({
        filial_id: item.filial_id,
        quantidade: item.quantidade,
        preco: item.preco,
        localizacao_fisica: item.localizacao_fisica || '',
        reservavel: item.reservavel || false,
        tempo_max_reserva: item.tempo_max_reserva || 24,
        desconto_min: item.desconto_min || 0,
        desconto_max: item.desconto_max || 0,
      }));
      setEstoqueData(estoqueFormatado);
    } else if (filiais.length > 0) {
      // Inicializar com uma entrada para cada filial
      const estoqueInicial = filiais.map(filial => ({
        filial_id: filial.id,
        quantidade: 0,
        preco: 0,
        localizacao_fisica: '',
        reservavel: true,
        tempo_max_reserva: 24,
        desconto_min: 0,
        desconto_max: 0,
      }));
      setEstoqueData(estoqueInicial);
    }
  }, [estoqueInicial, filiais]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (newImages: string[]) => {
    setImagens(newImages);
  };

  const removeImage = (index: number) => {
    setImagens(prev => prev.filter((_, i) => i !== index));
  };

  const updateEstoque = (index: number, field: keyof EstoqueFormData, value: any) => {
    setEstoqueData(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addEstoqueFilial = () => {
    setEstoqueData(prev => [...prev, {
      filial_id: '',
      quantidade: 0,
      preco: 0,
      localizacao_fisica: '',
      reservavel: true,
      tempo_max_reserva: 24,
      desconto_min: 0,
      desconto_max: 0,
    }]);
  };

  const removeEstoqueFilial = (index: number) => {
    setEstoqueData(prev => prev.filter((_, i) => i !== index));
  };

  const getFilialNome = (filialId: string) => {
    const filial = filiais.find(f => f.id === filialId);
    return filial?.nome_filial || 'Filial não encontrada';
  };

  const onFormSubmit = async (formData: any) => {
    if (imagens.length === 0) {
      toast({
        title: "Erro",
        description: "Pelo menos uma imagem é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    const produtoData = {
      ...formData,
      imagem_url: imagens,
      tags: tags,
      peso: Number(formData.peso),
    };

    await onSubmit(produtoData, estoqueData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                {...register('nome', { required: 'Nome é obrigatório' })}
                placeholder="Ex: Produto exemplo"
              />
              {errors.nome && (
                <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="categoria_id">Categoria *</Label>
              <CategoriaSelect
                value={watch('categoria_id')}
                onValueChange={(value) => setValue('categoria_id', value)}
              />
              {errors.categoria_id && (
                <p className="text-sm text-red-500 mt-1">{errors.categoria_id.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              {...register('descricao', { required: 'Descrição é obrigatória' })}
              placeholder="Descreva seu produto..."
              rows={3}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500 mt-1">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="codigo_barras">Código de Barras</Label>
              <Input
                id="codigo_barras"
                {...register('codigo_barras')}
                placeholder="Ex: 7891234567890"
              />
            </div>

            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                {...register('marca')}
                placeholder="Ex: Nike"
              />
            </div>

            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                {...register('modelo')}
                placeholder="Ex: Air Max"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input
              id="peso"
              type="number"
              step="0.1"
              {...register('peso')}
              placeholder="0.5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens do Produto *</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload 
            onImagesChange={handleImageUpload}
            initialImages={imagens}
            maxImages={5}
          />
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags do Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Digite uma tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estoque por Filial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Estoque por Filial
            {filiais.length > estoqueData.length && (
              <Button type="button" onClick={addEstoqueFilial} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Filial
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {estoqueData.map((estoque, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">{getFilialNome(estoque.filial_id)}</h4>
                  {estoqueData.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEstoqueFilial(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Quantidade em Estoque *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={estoque.quantidade}
                      onChange={(e) => updateEstoque(index, 'quantidade', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label>Preço (R$) *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={estoque.preco}
                      onChange={(e) => updateEstoque(index, 'preco', Number(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label>Localização Física</Label>
                    <Input
                      value={estoque.localizacao_fisica}
                      onChange={(e) => updateEstoque(index, 'localizacao_fisica', e.target.value)}
                      placeholder="Ex: A1-B2"
                    />
                  </div>
                  
                  <div>
                    <Label>Tempo Máx. Reserva (horas)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={estoque.tempo_max_reserva}
                      onChange={(e) => updateEstoque(index, 'tempo_max_reserva', Number(e.target.value))}
                      placeholder="24"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : produto ? 'Atualizar Produto' : 'Criar Produto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductFormEnhanced;
