"""
API route handlers.
"""
import logging
from fastapi import APIRouter, HTTPException, Request
from models import ConcertRequest, ConcertResponse, ConcertEvent, HealthResponse
from services import search_concerts

logger = logging.getLogger("echo.backend")
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse()


@router.post("/api/concerts", response_model=ConcertResponse)
async def get_concerts(req: ConcertRequest):
    logger.info(
        "[REQUEST] lat=%.4f lon=%.4f city=%s radius=%dkm artists=%d",
        req.latitude, req.longitude,
        req.city or "unknown",
        req.radius_km,
        len(req.artist_names),
    )

    try:
        concerts = await search_concerts(
            latitude=req.latitude,
            longitude=req.longitude,
            artist_names=req.artist_names,
            radius_km=req.radius_km,
        )
    except ValueError as e:
        logger.error("[ERROR] Config: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error("[ERROR] Upstream: %s", e)
        raise HTTPException(status_code=502, detail=f"Upstream API error: {e}")

    matched = sum(1 for c in concerts if c["matchedArtists"])
    logger.info(
        "[RESPONSE] %d concerts returned (%d artist-matched)",
        len(concerts), matched,
    )
    for c in concerts:
        logger.info(
            "   %s | %s | %s | %.1fkm%s",
            c["name"][:60],
            c["date"][:16],
            c["venue"][:30],
            c["distanceKm"],
            f" | match: {', '.join(c['matchedArtists'][:3])}" if c["matchedArtists"] else "",
        )

    return ConcertResponse(
        concerts=[ConcertEvent(**c) for c in concerts],
        total=len(concerts),
        location={"city": req.city, "country": req.country},
        searched_artists=len([a for a in req.artist_names if a.strip()]),
    )
