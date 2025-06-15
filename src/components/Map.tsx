
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para os ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  filiais?: any[];
  onFilialClick?: (filial: any) => void;
  selectedFilialId?: string;
}

const Map: React.FC<MapProps> = ({ 
  center = [-23.5505, -46.6333], 
  zoom = 13,
  height = "400px",
  filiais = [],
  onFilialClick,
  selectedFilialId
}) => {
  return (
    <div style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filiais.map((filial) => (
          <Marker
            key={filial.id}
            position={[filial.latitude, filial.longitude]}
            eventHandlers={{
              click: () => onFilialClick?.(filial)
            }}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{filial.nome_filial}</h3>
                <p className="text-sm">{filial.endereco}</p>
                {filial.telefone_filial && (
                  <p className="text-sm">Tel: {filial.telefone_filial}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
