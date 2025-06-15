
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Search, Store, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProductsNearby } from '@/hooks/useProductsNearby';
import Map from '@/components/Map';

interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

const LocationMap = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);

  const { produtos, isLoading, filiais } = useProductsNearby({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    raioKm: searchRadius
  });

  const requestUserLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocalização não disponível',
        description: 'Seu navegador não suporta geolocalização.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: 'Sua localização atual'
        };
        
        setUserLocation(location);
        
        toast({
          title: 'Localização encontrada',
          description: 'Buscando produtos próximos...',
        });
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast({
          title: 'Erro de localização',
          description: 'Não foi possível obter sua localização. Digite um endereço.',
          variant: 'destructive',
        });
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const searchByAddress = () => {
    if (!searchAddress.trim()) {
      toast({
        title: 'Digite um endereço',
        description: 'Por favor, digite um endereço para buscar produtos.',
        variant: 'destructive',
      });
      return;
    }

    // Simulação de geocoding - em produção usar API real
    const mockLocation = {
      latitude: -23.5505 + (Math.random() - 0.5) * 0.1,
      longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
      address: searchAddress
    };
    
    setUserLocation(mockLocation);
    
    toast({
      title: 'Endereço encontrado',
      description: `Buscando produtos próximos a ${searchAddress}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Controles de Localização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Onde você está?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite seu endereço ou bairro..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchByAddress()}
                />
                <Button onClick={searchByAddress} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Raio (km)"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-20"
                min="1"
                max="50"
              />
              <Button 
                onClick={requestUserLocation}
                disabled={isLoadingLocation}
                className="flex items-center gap-2"
              >
                {isLoadingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {isLoadingLocation ? 'Localizando...' : 'Usar GPS'}
              </Button>
            </div>
          </div>

          {userLocation && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <MapPin className="h-4 w-4" />
              <span>📍 {userLocation.address} • Raio de {searchRadius}km</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mapa Interativo */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos e Lojas Próximas</CardTitle>
        </CardHeader>
        <CardContent>
          {userLocation && filiais.length > 0 ? (
            <Map 
              filiais={filiais}
              height="400px"
              onFilialClick={(filial) => console.log('Filial selecionada:', filial)}
            />
          ) : (
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Store className="h-12 w-12 mx-auto text-primary mb-2" />
                <p className="text-gray-700 font-medium">Mapa Interativo</p>
                <p className="text-sm text-gray-500">
                  {userLocation ? 
                    `${produtos.length} produtos • ${filiais.length} lojas encontradas` :
                    'Defina sua localização para ver produtos próximos'
                  }
                </p>
                {isLoading && (
                  <p className="text-sm text-blue-600 mt-2 flex items-center justify-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Carregando produtos...
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Produtos em Destaque */}
      {produtos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Produtos em Destaque na Região</span>
              <Badge variant="secondary">{produtos.length} encontrados</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produtos.slice(0, 6).map((produto) => (
                <div
                  key={`${produto.id}-${produto.filial.id}`}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{produto.nome}</h3>
                    {produto.distancia && (
                      <Badge variant="outline" className="text-xs">
                        {produto.distancia < 1 
                          ? `${(produto.distancia * 1000).toFixed(0)}m`
                          : `${produto.distancia.toFixed(1)}km`
                        }
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{produto.descricao}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(produto.estoque.preco)}
                      </p>
                      <p className="text-xs text-gray-500">{produto.filial.nome_filial}</p>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {!userLocation && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="text-center py-8">
            <Navigation className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Encontre produtos perto de você
            </h3>
            <p className="text-blue-700 mb-4">
              Permita acesso à sua localização ou digite seu endereço para ver produtos disponíveis na sua região
            </p>
            <Button onClick={requestUserLocation} className="bg-blue-600 hover:bg-blue-700">
              <Navigation className="w-4 h-4 mr-2" />
              Usar Minha Localização
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationMap;
