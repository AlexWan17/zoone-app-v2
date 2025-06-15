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
import { Check, X, Clock, Package, User, MapPin } from 'lucide-react';
import LojistaLayout from '@/components/LojistaLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Reserva, ReservaStatus } from '@/types/reserva';

const ReservasPage = () => {
  const { user } = useAuthOptimized();
  const { toast } = useToast();
  const [reservas, setReservas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('todas');

  useEffect(() => {
    if (user?.id) {
      fetchReservas();
      // Executar função para expirar reservas vencidas
      api.expirarReservasVencidas();
    }
  }, [user]);

  const fetchReservas = async () => {
    setIsLoading(true);
    try {
      // Buscar lojista_id primeiro
      const { data: lojista, error: lojistaError } = await supabase
        .from('perfis_lojistas')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (lojistaError) throw lojistaError;

      // Usar a API para buscar reservas
      const reservasData = await api.getReservasByLojista(lojista.id);
      // Corrigindo status para ser tipado corretamente
      const reservasComStatus: any[] = (reservasData || []).map((item: any) => ({
        ...item,
        status: (["ativa", "confirmada", "cancelada", "expirada"].includes(item.status) ? item.status : "ativa") as ReservaStatus,
      }));
      setReservas(reservasComStatus);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as reservas.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmarReserva = async (reservaId: string) => {
    try {
      await api.updateReservaStatus(reservaId, 'confirmada');

      toast({
        title: 'Reserva confirmada',
        description: 'Reserva confirmada com sucesso.',
      });

      fetchReservas();
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível confirmar a reserva.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelarReserva = async (reservaId: string) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    try {
      await api.updateReservaStatus(reservaId, 'cancelada');

      toast({
        title: 'Reserva cancelada',
        description: 'Reserva cancelada com sucesso.',
      });

      fetchReservas();
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar a reserva.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge variant="secondary">Ativa</Badge>;
      case 'confirmada':
        return <Badge variant="default">Confirmada</Badge>;
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'expirada':
        return <Badge variant="outline">Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isExpiringSoon = (expiraEm: string) => {
    const expiry = new Date(expiraEm);
    const now = new Date();
    const diffMinutes = (expiry.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes <= 30 && diffMinutes > 0;
  };

  const filteredReservas = reservas.filter(reserva => {
    if (statusFilter === 'todas') return true;
    return reserva.status === statusFilter;
  });

  const totalReservasAtivas = reservas.filter(r => r.status === 'ativa').length;
  const totalReservasExpirando = reservas.filter(r => 
    r.status === 'ativa' && isExpiringSoon(r.expira_em)
  ).length;

  return (
    <LojistaLayout title="Reservas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestão de Reservas</h2>
          <Button onClick={fetchReservas}>
            Atualizar
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReservasAtivas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expirando em Breve</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalReservasExpirando}</div>
              <p className="text-xs text-muted-foreground">Próximos 30 minutos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservas.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex space-x-2">
          {['todas', 'ativa', 'confirmada', 'cancelada', 'expirada'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'todas' ? 'Todas' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Tabela de Reservas */}
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredReservas.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Filial</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservas.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{reserva.consumidor.nome}</p>
                            <p className="text-sm text-gray-500">{reserva.consumidor.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{reserva.produto.nome}</p>
                            {reserva.produto.codigo_barras && (
                              <p className="text-sm text-gray-500">Cód: {reserva.produto.codigo_barras}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{reserva.filial.nome_filial}</span>
                        </div>
                      </TableCell>
                      <TableCell>{reserva.quantidade}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(Number(reserva.preco_reserva))}
                      </TableCell>
                      <TableCell>{getStatusBadge(reserva.status)}</TableCell>
                      <TableCell>
                        <div className={isExpiringSoon(reserva.expira_em) ? 'text-orange-600 font-medium' : ''}>
                          {new Date(reserva.expira_em).toLocaleString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {reserva.status === 'ativa' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConfirmarReserva(reserva.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelarReserva(reserva.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {statusFilter === 'todas' ? 'Nenhuma reserva encontrada' : `Nenhuma reserva ${statusFilter}`}
            </h3>
            <p className="text-gray-500">
              {statusFilter === 'todas' 
                ? 'As reservas dos clientes aparecerão aqui.'
                : 'Não há reservas com este status no momento.'
              }
            </p>
          </div>
        )}
      </div>
    </LojistaLayout>
  );
};

export default ReservasPage;
