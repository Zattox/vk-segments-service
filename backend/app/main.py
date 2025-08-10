import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.db_helper import engine
from backend.app.models import Base
from backend.app.api import user_router, segment_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="User Segments API",
    description="API for managing user segments for VK practice",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router, prefix="/api")
app.include_router(segment_router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
    )
