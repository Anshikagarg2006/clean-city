import { useState, useEffect, useCallback } from 'react';
import { 
  reverseGeocode, 
  approximateCoordinates, 
  PUNJAB_CITIES_COORDS, 
  LOCALITY_COORDS 
} from '../utils/geoUtils';

const SESSION_KEY = 'cleancity_user_geo_v1';

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'unsupported'

  // Initialize from session storage if already detected earlier in this session
  const [location, setLocation] = useState(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read stored location:", e);
    }
    // Default fallback starting point in Phagwara
    return {
      lat: 31.2240,
      lng: 75.7708,
      approxLat: 31.224,
      approxLng: 75.771,
      city: "Phagwara",
      locality: "Model Town",
      state: "Punjab",
      formattedAddress: "Model Town, Phagwara, Punjab",
      isLiveGps: false,
      isManual: true,
      timestamp: null
    };
  });

  // Check initial permission status if available
  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionState('unsupported');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setPermissionState(result.state);
          result.onchange = () => {
            setPermissionState(result.state);
          };
        })
        .catch(() => {
          // Permissions API might not support geolocation in some browsers
        });
    }
  }, []);

  /**
   * Triggers browser GPS location request
   */
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const errObj = {
        type: 'UNSUPPORTED',
        message: 'Location access is unavailable. Please choose your location manually.'
      };
      setError(errObj);
      setPermissionState('unsupported');
      return;
    }

    setLoading(true);
    setError(null);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 second timeout
      maximumAge: 30000 // Cache for 30s
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const rawLat = position.coords.latitude;
        const rawLng = position.coords.longitude;
        const approx = approximateCoordinates(rawLat, rawLng);

        try {
          // Reverse geocode to city and locality
          const geocoded = await reverseGeocode(rawLat, rawLng);

          const locData = {
            lat: rawLat,
            lng: rawLng,
            approxLat: approx.lat,
            approxLng: approx.lng,
            city: geocoded.city,
            locality: geocoded.locality,
            state: geocoded.state || "Punjab",
            formattedAddress: geocoded.formattedAddress,
            source: geocoded.source,
            isLiveGps: true,
            isManual: false,
            timestamp: new Date().toISOString()
          };

          setLocation(locData);
          setPermissionState('granted');
          setLoading(false);

          try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(locData));
          } catch (e) {
            console.warn("Could not save location to sessionStorage:", e);
          }
        } catch (geoErr) {
          console.warn("Reverse geocode failed, using coordinates:", geoErr);
          // Retain coordinates even if reverse geocoding fails
          const locData = {
            lat: rawLat,
            lng: rawLng,
            approxLat: approx.lat,
            approxLng: approx.lng,
            city: "Phagwara",
            locality: "Manual Entry Required",
            state: "Punjab",
            formattedAddress: `Lat: ${rawLat.toFixed(4)}, Lng: ${rawLng.toFixed(4)}`,
            isLiveGps: true,
            isManual: false,
            timestamp: new Date().toISOString()
          };
          setLocation(locData);
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        let errorType = 'UNKNOWN';
        let userMessage = 'Could not determine location.';

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorType = 'PERMISSION_DENIED';
            userMessage = 'Location access is unavailable. Please choose your location manually.';
            setPermissionState('denied');
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorType = 'POSITION_UNAVAILABLE';
            userMessage = 'Location access is unavailable. Please choose your location manually.';
            break;
          case geoError.TIMEOUT:
            errorType = 'TIMEOUT';
            userMessage = 'Location request timed out. Please choose your location manually.';
            break;
          default:
            errorType = 'ERROR';
            userMessage = 'Location access is unavailable. Please choose your location manually.';
        }

        setError({
          type: errorType,
          message: userMessage,
          code: geoError.code
        });
      },
      geoOptions
    );
  }, []);

  /**
   * Allows manual update of city & locality
   */
  const setManualLocation = useCallback((city, locality, customCoords = null) => {
    let lat = customCoords?.lat;
    let lng = customCoords?.lng;

    if (!lat || !lng) {
      const locMatch = LOCALITY_COORDS[city]?.[locality];
      const cityCenter = PUNJAB_CITIES_COORDS[city] || PUNJAB_CITIES_COORDS["Phagwara"];
      lat = locMatch ? locMatch.lat : cityCenter.lat;
      lng = locMatch ? locMatch.lng : cityCenter.lng;
    }

    const approx = approximateCoordinates(lat, lng);
    const locData = {
      lat,
      lng,
      approxLat: approx.lat,
      approxLng: approx.lng,
      city,
      locality,
      state: "Punjab",
      formattedAddress: `${locality}, ${city}, Punjab`,
      isLiveGps: false,
      isManual: true,
      timestamp: new Date().toISOString()
    };

    setLocation(locData);
    setError(null);

    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(locData));
    } catch (e) {
      console.warn("Could not save manual location to sessionStorage:", e);
    }
  }, []);

  return {
    location,
    loading,
    error,
    permissionState,
    requestLocation,
    setManualLocation
  };
}
