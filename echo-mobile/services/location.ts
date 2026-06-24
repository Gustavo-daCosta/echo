import * as Location from 'expo-location';

export interface EchoLocation {
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
}

let currentLocation: EchoLocation | null = null;

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getLocationPermission(): Promise<boolean> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<EchoLocation | null> {
  try {
    const hasPermission = await getLocationPermission();
    if (!hasPermission) return null;

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const geocode = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    const city = geocode[0]?.city ?? geocode[0]?.subregion ?? null;
    const country = geocode[0]?.country ?? null;

    currentLocation = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      city,
      country,
    };

    return currentLocation;
  } catch (err) {
    console.warn('Location error:', err);
    return null;
  }
}

export function getCachedLocation(): EchoLocation | null {
  return currentLocation;
}
