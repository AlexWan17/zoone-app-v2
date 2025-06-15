
import { useState, useEffect } from 'react';

type GeoLocation = {
  latitude: number;
  longitude: number;
};

export function useGeoLocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setPermissionDenied(true);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      }
    );
  }, []);

  return { location, loading, permissionDenied };
}
