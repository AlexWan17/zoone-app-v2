
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Percent, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';

const promocaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.enum(['percentual', 'valor_fixo', 'frete_gratis']),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  data_inicio: z.string(),
  data_fim: z.string(),
  ativo: z.boolean(),
  produtos_ids: z.array(z.string()).optional(),
  valor_minimo_pedido: z.number().min(0).optional(),
  limite_uso: z.number().min(1).optional(),
  codigo_promocional: z.string().optional(),
});

type PromocaoData = z.infer<typeof promocaoSchema>;

interface Promocao extends PromocaoData {
  id: string;
  lojista_id: string;
  usos_realizados: number;
  criado_em: string;
  atualizado_em: string;
}

const PromocoesForm = () => {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPromocao, setEditingPromocao] = useState<Promocao | null>(null);
  const { toast } = useToast();

  const form = useForm<PromocaoData>({
    resolver: zodResolver(promocaoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      tipo: 'percentual',
      valor: 0,
      data_inicio: '',
      data_fim: '',
      ativo: true,
      produtos_ids: [],
      valor_minimo_pedido: 0,
      limite_uso: 1,
      codigo_promocional: '',
    },
  });

  useEffect(() => {
    carregarPromocoes();
    carregarProdutos();
  }, []);

  const carregarPromocoes = async () => {
    try {
      // Mock data for now
      setPromocoes([]);
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
    }
  };

  const carregarProdutos = async () => {
    try {
      const data = await api.getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const onSubmit = async (data: PromocaoData) => {
    try {
      setIsLoading(true);
      
      // Mock save for now
      toast({
        title: editingPromocao ? 'Promoção atualizada!' : 'Promoção criada!',
        description: 'A promoção foi salva com sucesso.',
      });

      form.reset();
      setEditingPromocao(null);
      carregarPromocoes();
    } catch (error) {
      console.error('Erro ao salvar promoção:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar promoção. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editarPromocao = (promocao: Promocao) => {
    setEditingPromocao(promocao);
    form.reset(promocao);
  };

  const cancelarEdicao = () => {
    setEditingPromocao(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            {editingPromocao ? 'Editar Promoção' : 'Nova Promoção'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Promoção</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Desconto Black Friday" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Desconto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentual">Percentual (%)</SelectItem>
                          <SelectItem value="valor_fixo">Valor Fixo (R$)</SelectItem>
                          <SelectItem value="frete_gratis">Frete Grátis</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Desconto</FormLabel>
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

                <FormField
                  control={form.control}
                  name="data_inicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_fim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Fim</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva os detalhes da promoção..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Promoção Ativa</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : editingPromocao ? 'Atualizar' : 'Criar'} Promoção
                </Button>
                {editingPromocao && (
                  <Button type="button" variant="outline" onClick={cancelarEdicao}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {promocoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Promoções Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promocoes.map((promocao) => (
                <div key={promocao.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{promocao.nome}</h4>
                    <p className="text-sm text-gray-600">{promocao.descricao}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={promocao.ativo ? 'default' : 'secondary'}>
                        {promocao.ativo ? 'Ativa' : 'Inativa'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {promocao.tipo === 'percentual' ? `${promocao.valor}%` : 
                         promocao.tipo === 'valor_fixo' ? `R$ ${promocao.valor}` : 'Frete Grátis'}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => editarPromocao(promocao)}>
                    Editar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromocoesForm;
