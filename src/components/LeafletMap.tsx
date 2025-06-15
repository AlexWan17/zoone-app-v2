import React, { useEffect, useState } from 'react';
import { Filial, Produto } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Store } from 'lucide-react';

interface LeafletMapProps {
  filiais?: Filial[];
  produtos?: Produto[];
  height?: string;
  userLocation?: { lat: number; lng: number };
  onFilialClick?: (filial: Filial) => void;
  className?: string;
}

// Componente de fallback enquanto o mapa não carrega
const MapFallback = ({ filiais = [], height = "400px", onFilialClick, className = "" }: LeafletMapProps) => {
  return (
    <Card className={`${className} relative z-[1000]`}>
      <CardContent className="p-0">
        <div style={{ height }} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center p-6">
            <Store className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Mapa das Lojas</h3>
            <p className="text-sm text-gray-500 mb-4">
              {filiais.length > 0 ? `${filiais.length} lojas encontradas` : 'Nenhuma loja encontrada'}
            </p>
            
            {filiais.length > 0 && (
              <div className="w-full max-w-md space-y-2">
                {filiais.map(filial => (
                  <div 
                    key={filial.id} 
                    className="p-3 bg-white rounded-lg shadow-sm border hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onFilialClick?.(filial)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Store className="w-4 h-4 text-primary" />
                      <h4 className="font-medium text-sm">{filial.nome_filial}</h4>
                    </div>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">{filial.endereco}</p>
                    </div>
                    {filial.telefone_filial && (
                      <p className="text-xs text-gray-500 mt-1">📞 {filial.telefone_filial}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LeafletMap = (props: LeafletMapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<LeafletMapProps> | null>(null);

  useEffect(() => {
    // Tentar carregar o mapa dinâmicamente
    const loadMap = async () => {
      try {
        // Importar leaflet e react-leaflet dinamicamente
        const [leafletModule, reactLeafletModule] = await Promise.all([
          import('leaflet'),
          import('react-leaflet')
        ]);

        const L = leafletModule.default;
        const { MapContainer, TileLayer, Marker, Popup } = reactLeafletModule;

        // Fix para ícones do Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Importar CSS do Leaflet
        await import('leaflet/dist/leaflet.css');

        // Criar componente do mapa
        const DynamicMap: React.FC<LeafletMapProps> = ({ 
          filiais = [], 
          height = "400px",
          userLocation,
          onFilialClick,
          className = ""
        }) => {
          const center: [number, number] = userLocation 
            ? [userLocation.lat, userLocation.lng]
            : filiais.length > 0 
              ? [filiais[0].latitude, filiais[0].longitude]
              : [-23.5505, -46.6333]; // São Paulo default

          const storeIcon = new L.Icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" width="24" height="24">
                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
              </svg>
            `),
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          return (
            <Card className={`${className} relative z-[1000]`}>
              <CardContent className="p-0">
                <div style={{ height }}>
                  <MapContainer 
                    center={center} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Marcadores das filiais */}
                    {filiais.map((filial) => (
                      <Marker 
                        key={filial.id}
                        position={[filial.latitude, filial.longitude]}
                        icon={storeIcon}
                        eventHandlers={{
                          click: () => onFilialClick?.(filial)
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <div className="flex items-center mb-2">
                              <Store className="w-4 h-4 mr-2 text-primary" />
                              <h3 className="font-semibold text-sm">{filial.nome_filial}</h3>
                            </div>
                            <div className="flex items-start mb-2">
                              <MapPin className="w-3 h-3 mr-1 mt-0.5 text-gray-500" />
                              <p className="text-xs text-gray-600">{filial.endereco}</p>
                            </div>
                            {filial.telefone_filial && (
                              <p className="text-xs text-gray-600">📞 {filial.telefone_filial}</p>
                            )}
                            <button 
                              onClick={() => onFilialClick?.(filial)}
                              className="mt-2 bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-600"
                            >
                              Ver Produtos
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Marcador da localização do usuário */}
                    {userLocation && (
                      <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-sm">Sua Localização</h3>
                            <p className="text-xs text-gray-600">Você está aqui</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          );
        };

        setMapComponent(() => DynamicMap);
        setIsMapLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar mapa:', error);
        setIsMapLoaded(false);
      }
    };

    loadMap();
  }, []);

  // Se o mapa não carregou ou teve erro, mostrar fallback
  if (!isMapLoaded || !MapComponent) {
    return <MapFallback {...props} />;
  }

  return <MapComponent {...props} />;
};

export default LeafletMap;
