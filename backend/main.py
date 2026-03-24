from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from api import base, graph, maps, peace_processes

app = FastAPI(
    title="Conflict Networks API",
    description="Standalone Conflict Networks visualization backend",
    version="1.0.0"
)

# Enable GZip compression
app.add_middleware(GZipMiddleware, minimum_size=500)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "https://peaceobservatory.org",
    "https://peaceobservatory.com",
    "https://peaceobservatory.net",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(base.router, tags=["Base"])
app.include_router(graph.router, tags=["Graph"])
app.include_router(maps.router, tags=["Maps"])
app.include_router(peace_processes.router, tags=["Peace Processes"])

@app.get("/")
async def root():
    return {"message": "Conflict Networks Standalone API is running."}
