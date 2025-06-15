
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import ProductsMap from '@/components/Map/ProductsMap';
import LandingProductCarousel from '@/components/LandingProductCarousel';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { useProductsNearby } from '@/hooks/useProductsNearby';

const categoriasMock = [
  { id: '1', nome: 'Eletrônicos', icone: '📱' },
  { id: '2', nome: 'Roupas', icone: '👕' },
  { id: '3', nome: 'Casa', icone: '🏠' },
  { id: '4', nome: 'Livros', icone: '📚' }
];

const lojistasMock = [
  { id: '1', nome_loja: 'Tech Store', especialidades: ['Eletrônicos'] },
  { id: '2', nome_loja: 'Fashion Place', especialidades: ['Roupas'] }
];

const LandingPage = () => {
  const navigate = useNavigate();

  // Localização
  const { location, loading: geoLoading, permissionDenied } = useGeoLocation();

  // Produtos por região
  const { produtos, isLoading, filiais } = useProductsNearby({
    latitude: location?.latitude,
    longitude: location?.longitude,
    raioKm: 12,
  });

  // Produtos destaque: pegar (por exemplo) os 8 da região, ordenados por estoque/preço
  const produtosDestaque = useMemo(
    () => produtos.slice(0, 8),
    [produtos]
  );
  // Produtos promocionais (simples: filtra por desconto)
  const produtosPromocao = useMemo(
    () => produtos.filter(p => p.estoque.desconto_max > 0).slice(0, 8),
    [produtos]
  );

  // Categorias populares: exibe mock ou do backend futuramente
  // Lojistas em destaque: exibe mock

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mapa */}
      <div className="container mx-auto mb-6">
        <Card className="shadow-md overflow-hidden p-0">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              Produtos na sua região
              <Badge variant="outline" className="ml-2 text-xs">
                {location
                  ? `Busca regionalizada`
                  : permissionDenied
                  ? "Sem permissão p/ localização"
                  : "Localizando..."}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-3">
            <div className="w-full h-56 sm:h-64 lg:h-96">
              <ProductsMap
                userLocation={location ? { lat: location.latitude, lng: location.longitude } : undefined}
                estoques={produtos.map(p => ({
                  ...p.estoque,
                  produto: p,
                  filial: p.filial,
                }))}
                filiais={filiais}
                height="100%"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto px-2 md:px-4 pb-4">
        {/* Carrossel de Promoções */}
        <LandingProductCarousel
          title="Promoções na sua região"
          produtos={produtosPromocao.map(p => ({ produto: p, estoque: p.estoque }))}
          loading={isLoading || geoLoading}
          emptyMessage="Nenhuma promoção regional encontrada no momento"
        />

        {/* Carrossel de Destaques */}
        <LandingProductCarousel
          title="Destaques na sua região"
          produtos={produtosDestaque.map(p => ({ produto: p, estoque: p.estoque }))}
          loading={isLoading || geoLoading}
          emptyMessage="Nenhum produto em destaque próximo a você"
        />

        {/* Categorias Populares */}
        <section className="mb-8">
          <Card className="shadow-md">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-semibold">Categorias Populares</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 pt-2">
              {categoriasMock.map((categoria) => (
                <Button
                  key={categoria.id}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/busca?categoria=${categoria.id}`)}
                >
                  <span className="text-2xl">{categoria.icone}</span>
                  <span className="text-sm mt-1">{categoria.nome}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Lojistas em Destaque */}
        <section>
          <Card className="shadow-md">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-semibold">Lojistas em Destaque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-2">
              {lojistasMock.map((lojista) => (
                <div
                  key={lojista.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="text-md font-semibold">{lojista.nome_loja}</h3>
                    <p className="text-sm text-gray-500">
                      Especialidades: {lojista.especialidades.join(', ')}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/lojista/${lojista.id}`)}
                  >
                    Visitar Loja <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
