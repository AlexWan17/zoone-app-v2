import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Percent, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { stockApi } from '@/services/stockApi';

const estoqueSchema = z.object({
  produto_id: z.string().min(1, 'Produto é obrigatório'),
  filial_id: z.string().min(1, 'Filial é obrigatória'),
  quantidade: z.number().min(0, 'Quantidade deve ser positiva'),
  preco: z.number().min(0, 'Preço deve ser positivo'),
  reservavel: z.boolean(),
  tempo_max_reserva: z.number().min(1, 'Tempo deve ser pelo menos 1 minuto'),
  desconto_min: z.number().min(0).max(100, 'Desconto deve estar entre 0 e 100'),
  desconto_max: z.number().min(0).max(100, 'Desconto deve estar entre 0 e 100'),
  localizacao_fisica: z.string().optional(),
});

type EstoqueData = z.infer<typeof estoqueSchema>;

interface EstoqueFilialFormProps {
  produtoId?: string;
  filialId?: string;
  onSave?: (estoque: EstoqueData) => void;
  onCancel?: () => void;
}

const EstoqueFilialForm: React.FC<EstoqueFilialFormProps> = ({
  produtoId,
  filialId,
  onSave,
  onCancel
}) => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [filiais, setFiliais] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EstoqueData>({
    resolver: zodResolver(estoqueSchema),
    defaultValues: {
      produto_id: produtoId || '',
      filial_id: filialId || '',
      quantidade: 0,
      preco: 0,
      reservavel: true,
      tempo_max_reserva: 60,
      desconto_min: 0,
      desconto_max: 0,
      localizacao_fisica: '',
    },
  });

  useEffect(() => {
    carregarProdutos();
    carregarFiliais();
  }, []);

  const carregarProdutos = async () => {
    try {
      const data = await api.getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const carregarFiliais = async () => {
    try {
      const data = await api.getFiliais();
      setFiliais(data);
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
    }
  };

  const onSubmit = async (data: EstoqueData) => {
    setIsLoading(true);
    try {
      let existente = null;
      try {
        existente = await stockApi.getByProdutoAndFilial(data.produto_id, data.filial_id);
      } catch { existente = null; }

      if (existente && existente.id) {
        await stockApi.updateEstoqueFilial(existente.id, {
          quantidade: data.quantidade,
          preco: data.preco,
          reservavel: data.reservavel,
          tempo_max_reserva: data.tempo_max_reserva,
          desconto_min: data.desconto_min,
          desconto_max: data.desconto_max,
          localizacao_fisica: data.localizacao_fisica,
        });
        toast({
          title: "Estoque atualizado!",
          description: "O estoque da filial foi atualizado com sucesso.",
        });
      } else {
        await stockApi.createEstoqueFilial({
          produto_id: data.produto_id,
          filial_id: data.filial_id,
          quantidade: data.quantidade,
          preco: data.preco,
          reservavel: data.reservavel,
          tempo_max_reserva: data.tempo_max_reserva,
          desconto_min: data.desconto_min,
          desconto_max: data.desconto_max,
          localizacao_fisica: data.localizacao_fisica,
        });
        toast({
          title: "Estoque salvo!",
          description: "O estoque da filial foi cadastrado com sucesso.",
        });
      }
      if (onSave) onSave(data);
    } catch (error) {
      console.error('Erro ao salvar estoque:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar estoque. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Configurar Estoque da Filial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="produto_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {produtos.map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="filial_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filial</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a filial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filiais.map((filial) => (
                          <SelectItem key={filial.id} value={filial.id}>
                            {filial.nome_filial}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade em Estoque</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço na Filial</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="localizacao_fisica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização Física</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Estante A3, Prateleira 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Configurações de Reserva</h3>
              
              <FormField
                control={form.control}
                name="reservavel"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Permitir Reserva</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tempo_max_reserva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Máximo de Reserva (minutos)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="60" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="desconto_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desconto Mínimo (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desconto_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desconto Máximo (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'} Estoque
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EstoqueFilialForm;
