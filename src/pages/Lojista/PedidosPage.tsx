import { useState, useEffect } from 'react';
import LojistaLayout from '@/components/LojistaLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Pedido, Filial } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Eye, Filter, Package } from 'lucide-react';
import { api } from '@/services/api';

const PedidosPage = () => {
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroFilial, setFiltroFilial] = useState<string>("todas");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Mock data for demo
        const mockPedidos: Pedido[] = [
          {
            id: "1",
            consumidor_id: "consumidor1",
            filial_id: "1",
            status: "pendente",
            total_bruto: 159.9,
            frete: 10,
            total_liquido: 169.9,
            endereco_entrega: "Rua Exemplo, 123, São Paulo - SP",
            tipo_entrega: "entrega",
            stripe_payment_intent_id: "pi_123456",
            criado_em: "2025-05-19T15:30:00Z",
            atualizado_em: "2025-05-19T15:30:00Z",
            consumidor: {
              id: "consumidor1",
              user_id: "user_consumer1",
              nome: "Maria Silva",
              email: "maria@example.com",
            }
          },
          {
            id: "2",
            consumidor_id: "consumidor2",
            filial_id: "1",
            status: "processando",
            total_bruto: 79.9,
            frete: 0,
            total_liquido: 79.9,
            tipo_entrega: "retirada_filial",
            stripe_payment_intent_id: "pi_234567",
            criado_em: "2025-05-18T10:15:00Z",
            atualizado_em: "2025-05-18T14:30:00Z",
            consumidor: {
              id: "consumidor2",
              user_id: "user_consumer2",
              nome: "João Santos",
              email: "joao@example.com",
            }
          },
          {
            id: "3",
            consumidor_id: "consumidor1",
            filial_id: "2",
            status: "pronto_retirada",
            total_bruto: 299.9,
            frete: 15,
            total_liquido: 314.9,
            endereco_entrega: "Rua Exemplo, 123, São Paulo - SP",
            tipo_entrega: "entrega",
            stripe_payment_intent_id: "pi_345678",
            criado_em: "2025-05-17T09:45:00Z",
            atualizado_em: "2025-05-19T08:30:00Z",
            consumidor: {
              id: "consumidor1",
              user_id: "user_consumer1",
              nome: "Maria Silva",
              email: "maria@example.com",
            }
          }
        ];
        
        // Get filiais
        const filiaisData = await api.getFiliais();
        
        // Attach filial info to each pedido
        const pedidosWithFilialInfo = await Promise.all(
          mockPedidos.map(async (pedido) => {
            const filial = filiaisData.find(f => f.id === pedido.filial_id);
            return { ...pedido, filial };
          })
        );
        
        setPedidos(pedidosWithFilialInfo);
        setFiliais(filiaisData);
      } catch (error) {
        console.error("Error fetching pedidos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os pedidos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesFilial = filtroFilial === "todas" || pedido.filial_id === filtroFilial;
    const matchesStatus = filtroStatus === "todos" || pedido.status === filtroStatus;
    return matchesFilial && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case "processando":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processando</Badge>;
      case "pronto_retirada":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Pronto para Retirada</Badge>;
      case "enviado":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Enviado</Badge>;
      case "entregue":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Entregue</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTipoEntrega = (tipo: "entrega" | "retirada_filial") => {
    return tipo === "entrega" ? "Entrega" : "Retirada na Loja";
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    // In a real app, this would call an API
    setPedidos(
      pedidos.map(pedido => 
        pedido.id === id ? 
        { ...pedido, status: newStatus as any, atualizado_em: new Date().toISOString() } : 
        pedido
      )
    );
    
    toast({
      title: "Status atualizado",
      description: `Pedido #${id.substring(0, 8)} atualizado para ${newStatus}.`,
    });
  };

  const statusOptions = [
    { value: "pendente", label: "Pendente" },
    { value: "processando", label: "Processando" },
    { value: "pronto_retirada", label: "Pronto para Retirada" },
    { value: "enviado", label: "Enviado" },
    { value: "entregue", label: "Entregue" },
    { value: "cancelado", label: "Cancelado" },
  ];

  const formatCurrency = (value: number) => api.formatCurrency(value);

  return (
    <LojistaLayout title="Pedidos">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Filial</label>
              <Select value={filtroFilial} onValueChange={setFiltroFilial}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas as filiais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as filiais</SelectItem>
                  {filiais.map(filial => (
                    <SelectItem key={filial.id} value={filial.id}>{filial.nome_filial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 mx-auto"></div>
          <p className="mt-4">Carregando pedidos...</p>
        </div>
      ) : filteredPedidos.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Filial</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">
                      #{pedido.id.substring(0, 8)}
                      <div className="text-xs text-gray-500">
                        {getTipoEntrega(pedido.tipo_entrega)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pedido.consumidor?.nome || "Cliente"}
                      <div className="text-xs text-gray-500">
                        {pedido.consumidor?.email || "Email não disponível"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pedido.filial?.nome_filial || "Filial"}
                    </TableCell>
                    <TableCell>
                      {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}
                      <div className="text-xs text-gray-500">
                        {new Date(pedido.criado_em).toLocaleTimeString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(pedido.total_liquido)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(pedido.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" className="h-8">
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        
                        <Select
                          value={pedido.status}
                          onValueChange={(value) => handleUpdateStatus(pedido.id, value)}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <span className="flex items-center text-xs">
                              <Package className="h-3 w-3 mr-1" />
                              Atualizar
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum pedido encontrado</h3>
          <p className="text-gray-500">
            Não existem pedidos com os filtros selecionados.
          </p>
        </div>
      )}
    </LojistaLayout>
  );
};

export default PedidosPage;
