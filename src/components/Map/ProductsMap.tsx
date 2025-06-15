
import React from 'react';
import { EstoqueFilial, Produto, Filial } from '@/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface ProductsMapProps {
  produtos?: Produto[];                // (pode ser usado para destaque)
  filiais?: Filial[];
  estoques?: EstoqueFilial[];          // NOVO: usar estoque_filial  (isso é o futuro)
  userLocation?: { lat: number; lng: number };
  onFilialClick?: (filial: Filial) => void;
  height?: string;
}

const produtoMarker = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [27, 41],
  iconAnchor: [13, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const filialMarker = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const userMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [27, 41],
  iconAnchor: [13, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const currencyFormat = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const ProductsMap: React.FC<ProductsMapProps> = ({
  produtos = [],
  filiais = [],
  estoques = [],
  userLocation,
  onFilialClick,
  height = '400px'
}) => {
  // Marca produtos em cada filial (usando estoques)
  const markers: Array<{ lat: number, lng: number, produto: Produto, filial: Filial, preco: number }> = [];
  (estoques || []).forEach(estoque => {
    if (
      estoque.filial && estoque.filial.latitude && estoque.filial.longitude &&
      estoque.produto && estoque.produto.nome && typeof estoque.preco === 'number'
      && estoque.quantidade > 0 // mostrar só se tem estoque!
    ) {
      markers.push({
        lat: estoque.filial.latitude,
        lng: estoque.filial.longitude,
        produto: estoque.produto,
        filial: estoque.filial,
        preco: estoque.preco
      });
    }
  });

  // Filiais sem produto (opcional: caso deseje mostrar markers só de filial)
  const filialMarkers = 
    (filiais || [])
      .filter(filial => !(markers.some(m => m.filial.id === filial.id)));

  // Centro do mapa
  let center: [number, number] = [-23.55052, -46.633308];
  if (userLocation) center = [userLocation.lat, userLocation.lng];
  else if (markers.length > 0) center = [markers[0].lat, markers[0].lng];

  return (
    <div className="w-full" style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ width: '100%', height }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userMarker}
          >
            <Popup>Sua Localização</Popup>
          </Marker>
        )}
        {/* Marcadores de produto/filial (estoques) */}
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={[marker.lat, marker.lng]}
            icon={produtoMarker}
          >
            <Popup>
              <div className="space-y-1">
                <div>
                  <strong>{marker.produto.nome}</strong>
                </div>
                <div>
                  Loja: <span className="font-semibold">{marker.filial.nome_filial}</span>
                </div>
                <div>
                  Preço: <span className="text-green-700 font-bold">{currencyFormat(marker.preco)}</span>
                </div>
                {/* Opcional: imagem */}
                {marker.produto.imagem_url && marker.produto.imagem_url[0] && (
                  <img
                    src={marker.produto.imagem_url[0]}
                    alt={marker.produto.nome}
                    style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 4, marginTop: 4 }}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {/* Opcional: mostram filiais sem produto */}
        {filialMarkers.map(filial => (
          <Marker
            key={filial.id}
            position={[filial.latitude, filial.longitude]}
            icon={filialMarker}
            eventHandlers={
              onFilialClick ? { click: () => onFilialClick(filial) } : undefined
            }
          >
            <Popup>
              <span>{filial.nome_filial}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ProductsMap;
