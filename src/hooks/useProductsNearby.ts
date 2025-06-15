import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Produto, Filial, EstoqueFilial } from '@/types';

interface ProdutoComEstoque extends Produto {
  estoque: EstoqueFilial;
  filial: Filial;
  distancia?: number;
}

interface UseProductsNearbyProps {
  latitude?: number;
  longitude?: number;
  raioKm?: number;
  categoria?: string;
}

export const useProductsNearby = ({ 
  latitude, 
  longitude, 
  raioKm = 10,
  categoria 
}: UseProductsNearbyProps) => {
  const [produtosProximos, setProdutosProximos] = useState<ProdutoComEstoque[]>([]);

  // Memoize the coordinates to prevent unnecessary refetches
  const coordinates = useMemo(() => {
    if (!latitude || !longitude) return null;
    return { latitude, longitude };
  }, [latitude, longitude]);

  // Exemplo de uso corrigido:
  async function buscarProximasFiliais(lat: number, lon: number, raio = 5) {
    return await api.getProximasFiliais(lat, lon, raio);
  }

  // Buscar filiais próximas
  const { data: filiais = [], isLoading: isLoadingFiliais } = useQuery({
    queryKey: ['filiais-proximas', coordinates, raioKm],
    queryFn: () => {
      if (!coordinates) return Promise.resolve([]);
      return buscarProximasFiliais(coordinates.latitude, coordinates.longitude, raioKm);
    },
    enabled: !!coordinates
  });

  // Buscar produtos das filiais próximas
  const { data: produtos = [], isLoading: isLoadingProdutos } = useQuery({
    queryKey: ['produtos', categoria],
    queryFn: () => {
      if (categoria) {
        return api.buscarProdutos(categoria);
      }
      return api.getProdutos();
    }
  });

  useEffect(() => {
    const combinarProdutosComEstoque = async () => {
      if (filiais.length === 0 || produtos.length === 0) {
        setProdutosProximos([]);
        return;
      }

      try {
        const produtosComEstoque: ProdutoComEstoque[] = [];

        for (const filial of filiais) {
          const estoque = await api.getEstoqueByFilial(filial.id);
          
          for (const itemEstoque of estoque) {
            const produto = produtos.find(p => p.id === itemEstoque.produto_id);
            if (produto && itemEstoque.quantidade > 0) {
              // Calcular distância se tivermos coordenadas
              let distancia;
              if (coordinates) {
                distancia = api.calculateDistance(
                  coordinates.latitude, 
                  coordinates.longitude, 
                  filial.latitude, 
                  filial.longitude
                );
              }

              produtosComEstoque.push({
                ...produto,
                estoque: itemEstoque,
                filial,
                distancia
              });
            }
          }
        }

        // Ordenar por distância (mais próximos primeiro)
        produtosComEstoque.sort((a, b) => {
          if (!a.distancia || !b.distancia) return 0;
          return a.distancia - b.distancia;
        });

        setProdutosProximos(produtosComEstoque);
      } catch (error) {
        console.error('Erro ao combinar produtos com estoque:', error);
        setProdutosProximos([]);
      }
    };

    combinarProdutosComEstoque();
  }, [filiais, produtos, coordinates]);

  return {
    produtos: produtosProximos,
    isLoading: isLoadingFiliais || isLoadingProdutos,
    filiais
  };
};
