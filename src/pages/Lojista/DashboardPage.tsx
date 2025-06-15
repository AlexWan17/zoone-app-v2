import { useState, useEffect } from 'react';
import LojistaLayout from '@/components/LojistaLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Search,
  Download,
  Eye,
  Clock,
  AlertCircle
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardData {
  totalProdutos: number;
  totalPedidos: number;
  totalReceitas: number;
  produtosBaixoEstoque: number;
  pedidosPendentes: number;
  vendasMes: number;
}

interface ProdutoData {
  id: string;
  nome: string;
  estoque_total: number;
  vendas_mes: number;
  status_venda: string;
  preco_venda: number;
}

interface PedidoData {
  id: string;
  total_liquido: number;
  status: string;
  created_at: string;
  consumidor_id: string;
}

const DashboardPage = () => {
  const { toast } = useToast();
  const { user } = useAuthOptimized();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProdutos: 0,
    totalPedidos: 0,
    totalReceitas: 0,
    produtosBaixoEstoque: 0,
    pedidosPendentes: 0,
    vendasMes: 0,
  });
  const [produtos, setProdutos] = useState<ProdutoData[]>([]);
  const [pedidos, setPedidos] = useState<PedidoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [consumidorNomes, setConsumidorNomes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Buscar lojista_id primeiro
      const { data: lojista, error: lojistaError } = await supabase
        .from('perfis_lojistas')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (lojistaError) throw lojistaError;

      // Buscar produtos do lojista
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select(`
          id,
          nome,
          preco_venda,
          status_venda,
          produtos_filiais(estoque_disponivel)
        `)
        .eq('lojista_id', lojista.id);

      if (produtosError) throw produtosError;

      const processedProdutos = produtosData?.map(produto => ({
        id: produto.id,
        nome: produto.nome,
        estoque_total: produto.produtos_filiais?.reduce((sum, pf) => sum + (pf.estoque_disponivel || 0), 0) || 0,
        vendas_mes: Math.floor(Math.random() * 50),
        status_venda: produto.status_venda,
        preco_venda: Number(produto.preco_venda),
      })) || [];

      setProdutos(processedProdutos);

      const { data: filiaisData, error: filiaisError } = await supabase
        .from('filiais')
        .select('id')
        .eq('lojista_id', lojista.id);

      if (filiaisError) throw filiaisError;

      const filialIds = filiaisData?.map(f => f.id) || [];

      if (filialIds.length > 0) {
        const { data: pedidosData, error: pedidosError } = await supabase
          .from('pedidos')
          .select(`
            id,
            total_liquido,
            status,
            criado_em,
            consumidor_id
          `)
          .in('filial_id', filialIds)
          .order('criado_em', { ascending: false })
          .limit(10);

        if (pedidosError) throw pedidosError;

        // Buscar consumidores dos pedidos
        let consumidorNomesMap: Record<string, string> = {};
        if (pedidosData && pedidosData.length > 0) {
          const consumidorIds = Array.from(new Set(pedidosData.map(pedido => pedido.consumidor_id)));
          const { data: consumidoresData } = await supabase
            .from('consumidores')
            .select('id, nome')
            .in('id', consumidorIds);

          if (consumidoresData) {
            consumidoresData.forEach(c => {
              consumidorNomesMap[c.id] = c.nome;
            });
          }
        }

        setConsumidorNomes(consumidorNomesMap);

        // Now build the processedPedidos with all needed PedidoData fields (no consumidor_nome in the object)
        const processedPedidos = pedidosData?.map(pedido => ({
          id: pedido.id,
          total_liquido: Number(pedido.total_liquido),
          status: pedido.status,
          created_at: pedido.criado_em,
          consumidor_id: pedido.consumidor_id,
        })) || [];

        setPedidos(processedPedidos);

        // Calcular métricas do dashboard
        const totalReceitas = processedPedidos
          .filter(p => p.status === 'entregue')
          .reduce((sum, p) => sum + p.total_liquido, 0);

        const pedidosPendentes = processedPedidos
          .filter(p => ['pendente', 'processando'].includes(p.status)).length;

        const produtosBaixoEstoque = processedProdutos
          .filter(p => p.estoque_total < 10).length;

        setDashboardData({
          totalProdutos: processedProdutos.length,
          totalPedidos: processedPedidos.length,
          totalReceitas,
          produtosBaixoEstoque,
          pedidosPendentes,
          vendasMes: Math.floor(Math.random() * 100), // Mock
        });
      }

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do dashboard.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportarRelatorio = () => {
    const csvContent = [
      'Produto,Estoque,Vendas Mês,Status,Preço',
      ...produtos.map(p => 
        `${p.nome},${p.estoque_total},${p.vendas_mes},${p.status_venda},${p.preco_venda}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_produtos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Relatório exportado',
      description: 'Arquivo CSV baixado com sucesso.',
    });
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || produto.status_venda === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dados para gráficos
  const chartData = [
    { name: 'Jan', vendas: 12 },
    { name: 'Fev', vendas: 19 },
    { name: 'Mar', vendas: 15 },
    { name: 'Abr', vendas: 25 },
    { name: 'Mai', vendas: 22 },
    { name: 'Jun', vendas: 30 },
  ];

  const statusData = [
    { name: 'Ativos', value: produtos.filter(p => p.status_venda === 'ativo').length, color: '#0088FE' },
    { name: 'Pausados', value: produtos.filter(p => p.status_venda === 'pausado').length, color: '#00C49F' },
    { name: 'Inativos', value: produtos.filter(p => p.status_venda === 'inativo').length, color: '#FFBB28' },
  ];

  if (isLoading) {
    return (
      <LojistaLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </LojistaLayout>
    );
  }

  return (
    <LojistaLayout title="Dashboard - Gestão Ativa">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Visão Geral do Negócio</h1>
          <Button onClick={exportarRelatorio} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalProdutos}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.produtosBaixoEstoque} com baixo estoque
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Totais</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalPedidos}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.pedidosPendentes} pendentes
              </p>
            </CardContent>
          </Card>

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
                }).format(dashboardData.totalReceitas)}
              </div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground">
                Vs. mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  vendas: {
                    label: "Vendas",
                    color: "#0088FE",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="vendas" fill="var(--color-vendas)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  ativos: { label: "Ativos", color: "#0088FE" },
                  pausados: { label: "Pausados", color: "#00C49F" },
                  inativos: { label: "Inativos", color: "#FFBB28" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alertas e Notificações */}
        {(dashboardData.produtosBaixoEstoque > 0 || dashboardData.pedidosPendentes > 0) && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-5 w-5" />
                Atenção Necessária
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashboardData.produtosBaixoEstoque > 0 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Package className="h-4 w-4" />
                  {dashboardData.produtosBaixoEstoque} produtos com estoque baixo
                </div>
              )}
              {dashboardData.pedidosPendentes > 0 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Clock className="h-4 w-4" />
                  {dashboardData.pedidosPendentes} pedidos pendentes
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Gestão de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Gestão de Produtos</CardTitle>
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="pausado">Pausados</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Vendas/Mês</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.slice(0, 10).map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>
                      <span className={produto.estoque_total < 10 ? 'text-red-600 font-semibold' : ''}>
                        {produto.estoque_total}
                      </span>
                    </TableCell>
                    <TableCell>{produto.vendas_mes}</TableCell>
                    <TableCell>
                      <Badge variant={
                        produto.status_venda === 'ativo' ? 'default' : 
                        produto.status_venda === 'pausado' ? 'secondary' : 'destructive'
                      }>
                        {produto.status_venda}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(produto.preco_venda)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Últimos Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.slice(0, 5).map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>
                      {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{consumidorNomes[pedido.consumidor_id] ?? 'N/A'}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(pedido.total_liquido)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        pedido.status === 'entregue' ? 'default' : 
                        ['pendente', 'processando'].includes(pedido.status) ? 'secondary' : 'destructive'
                      }>
                        {pedido.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LojistaLayout>
  );
};

export default DashboardPage;
