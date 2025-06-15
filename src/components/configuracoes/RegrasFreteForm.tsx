import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/services/api';

interface RegraFrete {
  id: string;
  filial_id: string;
  tipo: 'fixo' | 'por_km' | 'gratis';
  valor: number;
  valor_minimo_pedido?: number;
  area_geografica: string;
}

const RegrasFreteForm = () => {
  const [regras, setRegras] = useState<RegraFrete[]>([]);
  const [novaRegra, setNovaRegra] = useState<Omit<RegraFrete, 'id'>>({
    filial_id: '',
    tipo: 'fixo',
    valor: 0,
    valor_minimo_pedido: 0,
    area_geografica: ''
  });

  const { data: filiais = [] } = useQuery({
    queryKey: ['filiais'],
    queryFn: () => api.getFiliais()
  });

  useEffect(() => {
    const fetchRegras = async () => {
      try {
        const data = await api.getRegrasFrete();
        setRegras(data.map(regra => ({
          ...regra,
          tipo: regra.tipo as 'fixo' | 'por_km' | 'gratis'
        })));
      } catch (error) {
        console.error('Erro ao carregar regras de frete:', error);
      }
    };
    fetchRegras();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovaRegra(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setNovaRegra(prevState => ({
      ...prevState,
      tipo: value as 'fixo' | 'por_km' | 'gratis'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Implementar a lógica para salvar a nova regra no banco de dados
      console.log('Nova regra a ser salva:', novaRegra);
      // Após salvar, atualizar a lista de regras
      // setRegras([...regras, novaRegra]);
      setNovaRegra({
        filial_id: '',
        tipo: 'fixo',
        valor: 0,
        valor_minimo_pedido: 0,
        area_geografica: ''
      });
    } catch (error) {
      console.error('Erro ao salvar regra de frete:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Regras de Frete</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="filial_id">Filial</Label>
            <Input
              type="text"
              id="filial_id"
              name="filial_id"
              value={novaRegra.filial_id}
              onChange={handleInputChange}
              placeholder="ID da Filial"
            />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo de Frete</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de frete" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixo">Fixo</SelectItem>
                <SelectItem value="por_km">Por KM</SelectItem>
                <SelectItem value="gratis">Grátis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              type="number"
              id="valor"
              name="valor"
              value={novaRegra.valor}
              onChange={handleInputChange}
              placeholder="Valor"
            />
          </div>
          <div>
            <Label htmlFor="valor_minimo_pedido">Valor Mínimo do Pedido</Label>
            <Input
              type="number"
              id="valor_minimo_pedido"
              name="valor_minimo_pedido"
              value={novaRegra.valor_minimo_pedido}
              onChange={handleInputChange}
              placeholder="Valor Mínimo do Pedido"
            />
          </div>
          <div>
            <Label htmlFor="area_geografica">Área Geográfica</Label>
            <Input
              type="text"
              id="area_geografica"
              name="area_geografica"
              value={novaRegra.area_geografica}
              onChange={handleInputChange}
              placeholder="Área Geográfica"
            />
          </div>
          <Button type="submit">Salvar Regra</Button>
        </form>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Regras Existentes</h3>
          {regras.length === 0 ? (
            <p>Nenhuma regra de frete cadastrada.</p>
          ) : (
            <ul>
              {regras.map(regra => (
                <li key={regra.id} className="py-2 border-b">
                  {regra.tipo} - R$ {regra.valor} - {regra.area_geografica}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegrasFreteForm;
