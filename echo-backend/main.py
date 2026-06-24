"""
Echo Backend — FastAPI proxy server

Securely queries Ticketmaster Discovery API for concert data
without exposing developer credentials to the mobile client.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import router
from config import get_settings

# ── Logging ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("echo.backend")

settings = get_settings()

app = FastAPI(
    title="Echo Backend",
    description="Concert discovery proxy for the Echo mobile app",
    version="1.0.0",
)

# ── CORS — allow mobile app connections ─────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ──────────────────────────────────────────────────────
app.include_router(router)


# ── Startup ─────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    logger.info("Echo Backend starting on %s:%d", settings.host, settings.port)
    if not settings.ticketmaster_api_key:
        logger.warning("TICKETMASTER_API_KEY is not set — concert search will fail")
    else:
        masked = settings.ticketmaster_api_key[:4] + "****" + settings.ticketmaster_api_key[-4:]
        logger.info("Ticketmaster API key loaded: %s", masked)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
