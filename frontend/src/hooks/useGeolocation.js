import { useState } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setGeoError('Failed to fetch location. Please grant permission.');
        setLoading(false);
      }
    );
  };

  return { location, geoError, fetchLocation, loading };
};

export default useGeolocation;
