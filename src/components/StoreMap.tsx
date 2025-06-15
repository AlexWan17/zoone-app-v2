
import { MapPin, Phone, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filial } from '@/types';

interface StoreMapProps {
  filiais: Filial[];
  userLocation?: { lat: number; lng: number };
}

const StoreMap: React.FC<StoreMapProps> = ({ filiais, userLocation }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mapa Placeholder */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Lojas Próximas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-80 flex items-center justify-center border-2 border-dashed border-gray-200">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-medium">Mapa Interativo</p>
                <p className="text-sm text-gray-500">Em desenvolvimento com geolocalização</p>
                {userLocation && (
                  <p className="text-xs text-primary mt-2">
                    📍 Sua localização: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Lojas */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Lojas Encontradas ({filiais.length})</h3>
        {filiais.map((filial) => (
          <Card key={filial.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h4 className="font-medium text-primary mb-2">{filial.nome_filial}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{filial.endereco}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{filial.telefone_filial}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Seg-Sex: 9h às 18h</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3" variant="outline">
                Ver Produtos da Loja
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoreMap;
