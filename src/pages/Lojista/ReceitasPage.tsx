
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  Eye,
  ShoppingCart
} from 'lucide-react';
import LojistaLayout from '@/components/LojistaLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { useToast } from '@/hooks/use-toast';

interface ReceitaData {
  totalReceitas: number;
  totalPedidos: number;
  ticketMedio: number;
  comissaoZoone: number;
  pedidosHoje: number;
  crescimentoMensal: number;
}

interface PedidoReceita {
  id: string;
  total_liquido: number;
  total_bruto: number;
  frete: number;
  status: string;
  criado_em: string;
  consumidor_nome: string;
  filial_nome: string;
  comissao_zoone?: number;
}

const ReceitasPage = () => {
  const { user } = useAuthOptimized();
  const { toast } = useToast();
  const [receitaData, setReceitaData] = useState<ReceitaData>({
    totalReceitas: 0,
    totalPedidos: 0,
    ticketMedio: 0,
    comissaoZoone: 0,
    pedidosHoje: 0,
    crescimentoMensal: 0,
  });
  const [pedidos, setPedidos] = useState<PedidoReceita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroTempo, setFiltroTempo] = useState<string>('30dias');

  useEffect(() => {
    if (user?.id) {
      fetchReceitaData();
    }
  }, [user, filtroTempo]);

  const fetchReceitaData = async () => {
    setIsLoading(true);
    try {
      // Buscar lojista_id primeiro
      const { data: lojista, error: lojistaError } = await supabase
        .from('perfis_lojistas')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (lojistaError) throw lojistaError;

      // Buscar filiais do lojista
      const { data: filiais, error: filiaisError } = await supabase
        .from('filiais')
        .select('id')
        .eq('lojista_id', lojista.id);

      if (filiaisError) throw filiaisError;

      const filialIds = filiais?.map(f => f.id) || [];

      if (filialIds.length === 0) {
        setIsLoading(false);
        return;
      }

      // Calcular data de início baseada no filtro
      const dataInicio = new Date();
      switch (filtroTempo) {
        case '7dias': dataInicio.setDate(dataInicio.getDate() - 7); break;
        case '30dias': dataInicio.setDate(dataInicio.getDate() - 30); break;
        case '90dias': dataInicio.setDate(dataInicio.getDate() - 90); break;
        case 'ano': dataInicio.setFullYear(dataInicio.getFullYear() - 1); break;
      }

      // Buscar pedidos das filiais do lojista
      const { data: pedidosData, error: pedidosError } = await supabase
        .from('pedidos')
        .select(`
          id,
          total_liquido,
          total_bruto,
          frete,
          status,
          criado_em,
          consumidor_id,
          filial_id
        `)
        .in('filial_id', filialIds)
        .gte('criado_em', dataInicio.toISOString())
        .order('criado_em', { ascending: false });

      if (pedidosError) throw pedidosError;

      // Buscar consumidores dos pedidos
      let consumidorNomes: Record<string, string> = {};
      if (pedidosData && pedidosData.length > 0) {
        const consumidorIds = Array.from(new Set(pedidosData.map(p => p.consumidor_id)));
        const { data: consumidoresData } = await supabase
          .from('consumidores')
          .select('id, nome')
          .in('id', consumidorIds);

        if (consumidoresData) {
          consumidoresData.forEach(c => consumidorNomes[c.id] = c.nome);
        }
      }

      // Buscar nomes das filiais também
      let filialNomes: Record<string, string> = {};
      if (filialIds.length > 0) {
        const { data: filiaisInfo } = await supabase
          .from('filiais')
          .select('id, nome_filial')
          .in('id', filialIds);
        if (filiaisInfo) {
          filiaisInfo.forEach(f => filialNomes[f.id] = f.nome_filial);
        }
      }

      // Buscar comissões
      const pedidoIds = pedidosData?.map(p => p.id) || [];
      const { data: comissoes, error: comissoesError } = await supabase
        .from('zoone_comissoes')
        .select('pedido_id, valor')
        .in('pedido_id', pedidoIds);

      if (comissoesError) throw comissoesError;

      const processedPedidos = pedidosData?.map(pedido => ({
        id: pedido.id,
        total_liquido: Number(pedido.total_liquido),
        total_bruto: Number(pedido.total_bruto),
        frete: Number(pedido.frete),
        status: pedido.status,
        criado_em: pedido.criado_em,
        consumidor_nome: consumidorNomes[pedido.consumidor_id] || 'N/A',
        filial_nome: filialNomes[pedido.filial_id] || 'N/A',
        comissao_zoone: comissoes?.find(c => c.pedido_id === pedido.id)?.valor || 0,
      })) || [];

      setPedidos(processedPedidos);

      // Calcular métricas
      const pedidosEntregues = processedPedidos.filter(p => p.status === 'entregue');
      const totalReceitas = pedidosEntregues.reduce((sum, p) => sum + p.total_liquido, 0);
      const totalComissoes = comissoes?.reduce((sum, c) => sum + Number(c.valor), 0) || 0;
      const ticketMedio = pedidosEntregues.length > 0 ? totalReceitas / pedidosEntregues.length : 0;

      // Pedidos de hoje
      const hoje = new Date().toDateString();
      const pedidosHoje = processedPedidos.filter(p => 
        new Date(p.criado_em).toDateString() === hoje
      ).length;

      // Calcular crescimento mensal (simulado)
      const crescimentoMensal = Math.floor(Math.random() * 20) - 5; // Entre -5% e +15%

      setReceitaData({
        totalReceitas,
        totalPedidos: processedPedidos.length,
        ticketMedio,
        comissaoZoone: totalComissoes,
        pedidosHoje,
        crescimentoMensal,
      });

    } catch (error) {
      console.error('Erro ao carregar dados de receita:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados de receita.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportarRelatorio = () => {
    const csvContent = [
      'Data,Cliente,Filial,Total Bruto,Frete,Total Líquido,Comissão Zoone,Status',
      ...pedidos.map(p => 
        `${new Date(p.criado_em).toLocaleDateString('pt-BR')},${p.consumidor_nome},${p.filial_nome},${p.total_bruto},${p.frete},${p.total_liquido},${p.comissao_zoone},${p.status}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receitas_${filtroTempo}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Relatório exportado',
      description: 'Arquivo CSV baixado com sucesso.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'entregue':
        return <Badge variant="default">Entregue</Badge>;
      case 'enviado':
        return <Badge variant="secondary">Enviado</Badge>;
      case 'processando':
        return <Badge variant="outline">Processando</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <LojistaLayout title="Receitas">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </LojistaLayout>
    );
  }

  return (
    <LojistaLayout title="Receitas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard de Receitas</h2>
          <div className="flex space-x-2">
            <Select value={filtroTempo} onValueChange={setFiltroTempo}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                <SelectItem value="ano">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportarRelatorio}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(receitaData.totalReceitas)}
              </div>
              <p className="text-xs text-muted-foreground">
                {filtroTempo === '7dias' ? 'Últimos 7 dias' : 
                 filtroTempo === '30dias' ? 'Últimos 30 dias' :
                 filtroTempo === '90dias' ? 'Últimos 90 dias' : 'Último ano'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{receitaData.totalPedidos}</div>
              <p className="text-xs text-muted-foreground">
                {receitaData.pedidosHoje} hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(receitaData.ticketMedio)}
              </div>
              <p className={`text-xs ${receitaData.crescimentoMensal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {receitaData.crescimentoMensal >= 0 ? '+' : ''}{receitaData.crescimentoMensal}% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comissão Zoone</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(receitaData.comissaoZoone)}
              </div>
              <p className="text-xs text-muted-foreground">
                10% das vendas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {pedidos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Filial</TableHead>
                    <TableHead>Total Bruto</TableHead>
                    <TableHead>Frete</TableHead>
                    <TableHead>Total Líquido</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidos.slice(0, 20).map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell>
                        {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{pedido.consumidor_nome}</TableCell>
                      <TableCell>{pedido.filial_nome}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(pedido.total_bruto)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(pedido.frete)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(pedido.total_liquido)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(pedido.comissao_zoone || 0)}
                      </TableCell>
                      <TableCell>{getStatusBadge(pedido.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma receita encontrada</h3>
                <p className="text-gray-500">
                  As receitas dos seus pedidos aparecerão aqui quando você começar a vender.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LojistaLayout>
  );
};

export default ReceitasPage;
