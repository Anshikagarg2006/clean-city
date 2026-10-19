/**
 * CleanCity AI - Geolocation & Spatial Utilities
 * Handles Haversine distance calculations, coordinate fuzzing for privacy,
 * reverse geocoding with caching and graceful fallbacks, and synthetic community member counting.
 */

// City reference coordinates in Punjab
export const PUNJAB_CITIES_COORDS = {
  Phagwara: { lat: 31.2240, lng: 75.7708 },
  Jalandhar: { lat: 31.3260, lng: 75.5762 },
  Ludhiana: { lat: 30.9010, lng: 75.8573 },
  Amritsar: { lat: 31.6340, lng: 74.8723 }
};

// Locality coordinates mapping
export const LOCALITY_COORDS = {
  Phagwara: {
    "Model Town": { lat: 31.2215, lng: 75.7725 },
    "Law Gate (Maheru)": { lat: 31.2485, lng: 75.7020 },
    "Hadiabad": { lat: 31.2150, lng: 75.7580 },
    "Satnampura": { lat: 31.2290, lng: 75.7650 },
    "Palahi Road": { lat: 31.2350, lng: 75.7820 },
    "Guru Hargobind Nagar": { lat: 31.2270, lng: 75.7790 },
    "Subhash Nagar": { lat: 31.2190, lng: 75.7680 },
    "Urban Estate": { lat: 31.2380, lng: 75.7610 },
    "GT Road Bypass": { lat: 31.2180, lng: 75.7850 },
    "Banga Road": { lat: 31.2120, lng: 75.7890 }
  },
  Jalandhar: {
    "Model Town": { lat: 31.3120, lng: 75.5820 },
    "Civil Lines": { lat: 31.3220, lng: 75.5780 },
    "Rama Mandi": { lat: 31.3150, lng: 75.6250 },
    "Basti Nau": { lat: 31.3280, lng: 75.5520 },
    "Jalandhar Cantt": { lat: 31.2850, lng: 75.6120 },
    "Urban Estate Phase II": { lat: 31.2980, lng: 75.5890 },
    "Jyoti Chowk": { lat: 31.3295, lng: 75.5750 },
    "Nakodar Road": { lat: 31.3050, lng: 75.5600 },
    "Ladowali Road": { lat: 31.3240, lng: 75.5880 },
    "Suranussi": { lat: 31.3650, lng: 75.5200 }
  },
  Ludhiana: {
    "Sarabha Nagar": { lat: 30.8920, lng: 75.8150 },
    "Civil Lines": { lat: 30.9080, lng: 75.8450 },
    "Ghumar Mandi": { lat: 30.9020, lng: 75.8320 },
    "Model Town": { lat: 30.8850, lng: 75.8420 },
    "Dugri Phase 1": { lat: 30.8650, lng: 75.8480 },
    "Focal Point Industrial Area": { lat: 30.8850, lng: 75.9120 },
    "Haibowal Kalan": { lat: 30.9250, lng: 75.8250 },
    "Clock Tower Market": { lat: 30.9120, lng: 75.8540 },
    "BRS Nagar": { lat: 30.8820, lng: 75.8050 },
    "Gill Road": { lat: 30.8750, lng: 75.8650 }
  },
  Amritsar: {
    "Ranjit Avenue": { lat: 31.6520, lng: 74.8650 },
    "Lawrence Road": { lat: 31.6410, lng: 74.8780 },
    "Heritage Street (Golden Temple)": { lat: 31.6210, lng: 74.8765 },
    "Majitha Road": { lat: 31.6620, lng: 74.8850 },
    "Chheharta": { lat: 31.6350, lng: 74.7950 },
    "Batala Road": { lat: 31.6550, lng: 74.9120 },
    "Mall Road": { lat: 31.6380, lng: 74.8720 },
    "Putligarh": { lat: 31.6280, lng: 74.8450 },
    "Circular Road": { lat: 31.6360, lng: 74.8680 },
    "Guru Nanak Dev University Area": { lat: 31.6370, lng: 74.8250 }
  }
};

/**
 * Calculates great-circle distance between two points on a sphere
 * using the Haversine formula. Returns distance in Kilometers.
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Human-readable distance formatter
 * e.g. "350 m away" or "1.2 km away"
 */
export function formatDistance(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return null;
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Fuzzes coordinates to ~3 decimal places (~100m precision)
 * to protect user location privacy when displaying public reports.
 */
export function approximateCoordinates(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return {
    lat: Math.round(lat * 1000) / 1000,
    lng: Math.round(lng * 1000) / 1000
  };
}

/**
 * Finds the nearest known Punjab city from any coordinates
 */
export function findNearestCity(lat, lng) {
  let nearestCity = "Phagwara";
  let minDistance = Infinity;

  for (const [cityName, coords] of Object.entries(PUNJAB_CITIES_COORDS)) {
    const d = haversineDistance(lat, lng, coords.lat, coords.lng);
    if (d < minDistance) {
      minDistance = d;
      nearestCity = cityName;
    }
  }

  return { city: nearestCity, distanceKm: minDistance };
}

/**
 * Finds the nearest known locality within a city
 */
export function findNearestLocality(lat, lng, city) {
  const localities = LOCALITY_COORDS[city] || LOCALITY_COORDS["Phagwara"];
  let nearestLocality = Object.keys(localities)[0];
  let minDistance = Infinity;

  for (const [locName, coords] of Object.entries(localities)) {
    const d = haversineDistance(lat, lng, coords.lat, coords.lng);
    if (d < minDistance) {
      minDistance = d;
      nearestLocality = locName;
    }
  }

  return nearestLocality;
}

// In-memory cache for reverse geocoding to prevent excessive API requests
const geocodeCache = new Map();

/**
 * Reverse geocodes coordinates to a readable locality, city, and state.
 * Uses OpenStreetMap Nominatim with a timeout, and falls back to our local
 * Punjab spatial model if network fails, times out, or returns outside Punjab.
 */
export async function reverseGeocode(lat, lng) {
  const roundedLat = Math.round(lat * 10000) / 10000;
  const roundedLng = Math.round(lng * 10000) / 10000;
  const cacheKey = `${roundedLat},${roundedLng}`;

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  // Fallback spatial resolution
  const nearest = findNearestCity(lat, lng);
  const matchedCity = nearest.city;
  const matchedLocality = findNearestLocality(lat, lng, matchedCity);

  const fallbackResult = {
    locality: matchedLocality,
    city: matchedCity,
    state: "Punjab",
    formattedAddress: `${matchedLocality}, ${matchedCity}, Punjab`,
    lat,
    lng,
    source: "Local Spatial Resolver (Punjab Hub)"
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          "Accept-Language": "en",
          "User-Agent": "CleanCityAI-Academic-Prototype/1.0"
        }
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const detectedLocality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.road ||
          addr.county ||
          matchedLocality;

        // Check if city matches one of our Punjab hubs, or use detected
        let detectedCity = addr.city || addr.town || addr.village || addr.state_district;
        
        // Normalize city to nearest Punjab hub if within reasonable regional distance
        if (nearest.distanceKm < 35) {
          detectedCity = matchedCity;
        } else if (!detectedCity) {
          detectedCity = matchedCity;
        }

        const detectedState = addr.state || "Punjab";

        const result = {
          locality: detectedLocality,
          city: detectedCity,
          state: detectedState,
          formattedAddress: `${detectedLocality}, ${detectedCity}, ${detectedState}`,
          lat,
          lng,
          source: "OpenStreetMap Nominatim"
        };

        geocodeCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    // Graceful fallback on network timeout or fetch error
    console.warn("Reverse geocode external request failed or timed out, using spatial fallback:", err.message);
  }

  geocodeCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}

// Generate ~160 synthetic community members spread across the 4 Punjab cities
// for realistic notification radius calculations
let cachedCommunityUsers = null;

export function getSyntheticCommunityUsers() {
  if (cachedCommunityUsers) return cachedCommunityUsers;

  const users = [];
  let userId = 101;
  const names = [
    "Amanpreet Singh", "Gurinder Kaur", "Simranjit Singh", "Harmanpreet Virdi",
    "Manpreet Johal", "Navneet Sandhu", "Rajinder Kumar", "Balwinder Sharma",
    "Jaspreet Bhasin", "Taranjit Deol", "Kirandeep Gill", "Amandeep Grewal",
    "Rupinder Brar", "Sukhwinder Dhillon", "Kuldeep Chawla", "Paramjit Sodhi"
  ];

  for (const [cityName, localities] of Object.entries(LOCALITY_COORDS)) {
    for (const [locName, center] of Object.entries(localities)) {
      // 4 community users per locality = 40 per city * 4 cities = 160 users
      for (let i = 0; i < 4; i++) {
        // Random offset within ~1.5 km of locality center
        const offsetLat = (Math.sin(userId * 17) * 0.012);
        const offsetLng = (Math.cos(userId * 23) * 0.012);
        const name = names[(userId + i) % names.length];

        users.push({
          id: `USR-PB-${userId++}`,
          name: `${name}`,
          city: cityName,
          locality: locName,
          lat: center.lat + offsetLat,
          lng: center.lng + offsetLng,
          role: i === 0 ? "Civic Volunteer Leader" : "Local Resident",
          registeredSince: "2026"
        });
      }
    }
  }

  cachedCommunityUsers = users;
  return users;
}

/**
 * Calculates the number of synthetic community members falling within a given radius (in km)
 * from a target coordinate using the Haversine formula.
 */
export function countUsersInRadius(targetLat, targetLng, radiusKm) {
  if (!targetLat || !targetLng || !radiusKm) {
    return { count: 0, users: [] };
  }

  const allUsers = getSyntheticCommunityUsers();
  const matched = [];

  for (const user of allUsers) {
    const dist = haversineDistance(targetLat, targetLng, user.lat, user.lng);
    if (dist !== null && dist <= radiusKm) {
      matched.push({
        ...user,
        distanceKm: dist,
        distanceFormatted: formatDistance(dist)
      });
    }
  }

  return {
    count: matched.length,
    users: matched.sort((a, b) => a.distanceKm - b.distanceKm)
  };
}
