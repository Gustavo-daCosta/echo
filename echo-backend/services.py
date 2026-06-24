import logging
import httpx
from geopy.distance import geodesic
from config import get_settings

logger = logging.getLogger("echo.backend")

TICKETMASTER_URL = "https://app.ticketmaster.com/discovery/v2/events.json"
MAX_RESULTS = 15


def _normalize(name: str) -> str:
    return name.strip().lower()


async def search_concerts(
    latitude: float,
    longitude: float,
    artist_names: list[str],
    radius_km: int = 30,
) -> list[dict]:
    settings = get_settings()

    if not settings.ticketmaster_api_key:
        raise ValueError("TICKETMASTER_API_KEY is not configured")

    artist_set = {_normalize(a) for a in artist_names if a.strip()}

    params = {
        "apikey": settings.ticketmaster_api_key,
        "latlong": f"{latitude},{longitude}",
        "radius": str(radius_km),
        "unit": "km",
        "size": "50",
        "sort": "date,asc",
        "classificationName": "music",
    }

    logger.info("[TICKETMASTER] Querying: %s", {k: v for k, v in params.items() if k != "apikey"})

    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.get(TICKETMASTER_URL, params=params)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            logger.error("[TICKETMASTER] HTTP error: %s", e)
            return []
        except Exception as e:
            logger.error("[TICKETMASTER] Request failed: %s", e)
            return []

        data = resp.json()

    total_events = data.get("page", {}).get("totalElements", 0)
    events_raw = data.get("_embedded", {}).get("events", [])
    logger.info("[TICKETMASTER] API reports %d total events, returned %d in this page",
                total_events, len(events_raw))

    if not events_raw:
        logger.info("[TICKETMASTER] No events found in response")
        return []

    user_location = (latitude, longitude)
    results: list[dict] = []

    for event in events_raw:
        try:
            venues = event.get("_embedded", {}).get("venues", [])
            if not venues:
                continue
            venue = venues[0]

            venue_name = venue.get("name", "Unknown Venue")
            venue_city = venue.get("city", {}).get("name", "Unknown")
            venue_country = venue.get("country", {}).get("name", "")
            venue_lat = float(venue.get("location", {}).get("latitude", 0))
            venue_lon = float(venue.get("location", {}).get("longitude", 0))

            distance = geodesic(user_location, (venue_lat, venue_lon)).km

            images = event.get("images", [])
            image_url = None
            if images:
                for img in images:
                    if img.get("ratio") in ("16_9", "4_3"):
                        image_url = img.get("url")
                        break
                if not image_url:
                    image_url = images[0].get("url")

            dates = event.get("dates", {})
            start = dates.get("start", {})
            event_date = start.get("dateTime") or start.get("localDate", "")

            # Extract genre info for logging
            classifications = event.get("classifications", [])
            genre = classifications[0].get("genre", {}).get("name", "") if classifications else ""

            event_url = event.get("url", f"https://www.ticketmaster.com/event/{event.get('id', '')}")

            attractions = event.get("_embedded", {}).get("attractions", [])
            performer_names = [
                attr.get("name", "") for attr in attractions
                if attr.get("name")
            ]

            matched_artists = []
            for performer in performer_names:
                if _normalize(performer) in artist_set:
                    matched_artists.append(performer)

            results.append({
                "id": event.get("id", ""),
                "name": event.get("name", "Unknown Event"),
                "date": event_date,
                "venue": venue_name,
                "city": venue_city,
                "country": venue_country,
                "imageUrl": image_url,
                "url": event_url,
                "distanceKm": round(distance, 1),
                "matchedArtists": matched_artists,
            })

        except (KeyError, ValueError, TypeError) as e:
            logger.warning("[TICKETMASTER] Skipping malformed event: %s", e)
            continue

    results.sort(key=lambda e: (
        0 if e["matchedArtists"] else 1,
        e["date"],
        e["distanceKm"],
    ))
    logger.info("[TICKETMASTER] %d events processed, returning %d", len(results), min(len(results), MAX_RESULTS))
    return results[:MAX_RESULTS]
