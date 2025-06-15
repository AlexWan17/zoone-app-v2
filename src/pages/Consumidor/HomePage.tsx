import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import ProductCard from '@/components/ProductCard';
import ProductsMap from '@/components/Map/ProductsMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Gift, Star, Clock, Truck } from 'lucide-react';
import { api } from '@/services/api';

const ConsumidorHomePage = () => {
  const { user } = useAuthOptimized();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Buscar produtos em destaque
  const { data: produtosDestaque = [], isLoading: isLoadingDestaque } = useQuery({
    queryKey: ['produtos-destaque'],
    queryFn: () => api.getProdutos(),
    select: (data) => data.slice(0, 8)
  });

  // Buscar produtos em promoção
  const { data: produtosPromocao = [], isLoading: isLoadingPromocao } = useQuery({
    queryKey: ['produtos-promocao'],
    queryFn: () => api.getProdutos(),
    select: (data) => data.filter(produto => produto.promocao_ativa).slice(0, 6)
  });

  const { data: filiais = [] } = useQuery({
    queryKey: ['filiais-all'],
    queryFn: () => api.getFiliais()
  });

  // Buscar estoques de destaque (produtos + filiais)
  const { data: estoquesDestaque = [] } = useQuery({
    queryKey: ['estoque-destaque'],
    queryFn: async () => {
      // Busca todos estoques para os 8 produtos em destaque
      if (produtosDestaque.length === 0) return [];
      const results = await Promise.all(
        produtosDestaque.map(produto => api.getEstoqueProduto(produto.id))
      );
      // Retorna todos estoques (achatar)
      return results.flat();
    }
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Mapa de Localização e Produtos (produtos em destaque próximos) */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Lojas e Produtos Perto de Você
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsMap
            // produtos={produtosDestaque}
            filiais={filiais}
            estoques={estoquesDestaque}
            userLocation={userLocation ?? undefined}
            height="320px"
          />
        </CardContent>
      </Card>

      {/* Produtos em Promoção */}
      {produtosPromocao.length > 0 && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Gift className="w-5 h-5" />
              🔥 Ofertas Especiais
              <Badge variant="destructive" className="ml-2">
                {produtosPromocao.length} produtos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {produtosPromocao.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Produtos em Destaque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Produtos em Destaque
            <Badge variant="secondary" className="ml-2">
              {produtosDestaque.length} produtos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDestaque ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : produtosDestaque.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {produtosDestaque.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Produtos serão carregados em breve</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vantagens da Plataforma */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">🎉 Vantagens para Você</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Frete Grátis</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Em compras acima de R$ 50 na sua região
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Ver Produtos
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Primeira Compra</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                15% de desconto no seu primeiro pedido
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Usar Cupom
              </Button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Reserva Rápida</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Reserve produtos e retire na loja
              </p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Descobrir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumidorHomePage;
