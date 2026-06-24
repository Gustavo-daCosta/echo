from pydantic import BaseModel, Field
from typing import Optional


class ConcertRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    city: Optional[str] = None
    country: Optional[str] = None
    artist_names: list[str] = Field(default_factory=list, max_length=50)
    radius_km: int = Field(default=30, ge=1, le=500)


class ConcertEvent(BaseModel):
    id: str
    name: str
    date: str
    venue: str
    city: str
    country: str
    imageUrl: Optional[str] = None
    url: str
    distanceKm: float
    matchedArtists: list[str] = Field(default_factory=list)


class ConcertResponse(BaseModel):
    concerts: list[ConcertEvent]
    total: int
    location: dict[str, Optional[str]] = {}
    searched_artists: int



class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
