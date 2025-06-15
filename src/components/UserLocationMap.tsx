
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

function useUserLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });

        // Reverse geocode (OpenStreetMap's Nominatim)
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await resp.json();
          setAddress(
            data.display_name ||
              [data.road, data.neighbourhood, data.city, data.state, data.country].filter(Boolean).join(", ")
          );
        } catch {
          setAddress("Endereço não identificado");
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  return { location, address, loading };
}

function CenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
    // eslint-disable-next-line
  }, [center]);
  return null;
}

// Fix para icones do Leaflet (se necessário)
// Se já tiver global, pode omitir.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function UserLocationMap({
  mapHeight = "300px"
}: {
  mapHeight?: string
}) {
  const { location, address, loading } = useUserLocation();

  if (loading) return <div className="text-center py-4">Detectando localização...</div>;
  if (!location) return <p className="text-red-500">Não foi possível obter a localização.</p>;

  return (
    <div style={{ height: mapHeight, width: "100%", zIndex: 10, position: "relative" }}>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={16}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        className="shadow-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div>
              <span className="font-bold">Sua localização:</span>
              <br />
              <span>{address}</span>
            </div>
          </Popup>
        </Marker>
        <CenterMap center={[location.lat, location.lng]} />
      </MapContainer>
      <div className="bg-white/80 rounded-lg absolute px-3 py-2 bottom-2 left-2 pointer-events-auto text-xs ring-1 ring-gray-200">
        <b>Endereço detectado:</b> {address}
      </div>
    </div>
  );
}

