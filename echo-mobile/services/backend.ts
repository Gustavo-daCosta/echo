import type { ConcertEvent } from '@/types';
import type { EchoLocation } from './location';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://10.0.2.2:8000';

export async function fetchConcerts(
  location: EchoLocation,
  artistNames: string[],
  radiusKm = 30,
): Promise<ConcertEvent[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/concerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        country: location.country,
        artist_names: artistNames,
        radius_km: radiusKm,
      }),
    });

    if (!res.ok) {
      console.warn('Backend error:', res.status);
      return [];
    }

    const data = await res.json();
    return data.concerts ?? [];
  } catch (err) {
    console.warn('Backend unreachable:', err);
    return [];
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
