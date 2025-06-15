
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { CategoriaProduto } from '@/types/categoria';
import { useToast } from '@/hooks/use-toast';

interface CategoriaSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const CategoriaSelect: React.FC<CategoriaSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Selecione uma categoria"
}) => {
  const [categorias, setCategorias] = useState<CategoriaProduto[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data, error } = await supabase
          .from('categorias_produto')
          .select('*')
          .eq('ativo', true)
          .order('nome');

        if (error) throw error;

        setCategorias(data || []);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [toast]);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Carregando categorias..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categorias.map((categoria) => (
          <SelectItem key={categoria.id} value={categoria.id}>
            <div className="flex items-center gap-2">
              <span>{categoria.icone}</span>
              <span>{categoria.nome}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoriaSelect;
