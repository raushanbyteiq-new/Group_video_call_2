from fastapi import FastAPI
from src.api import ingest, query, summarize
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Meeting RAG Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],  # allows OPTIONS, POST, GET
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(query.router)
app.include_router(summarize.router)
