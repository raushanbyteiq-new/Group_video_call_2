from fastapi import APIRouter
from langchain_core.documents import Document
from src.vector.vector_store import VectorStoreService
from pydantic import BaseModel

router = APIRouter()
vector_store = VectorStoreService()

class IngestChunkRequest(BaseModel):
    meetingId: str
    text: str

@router.post("/ingest-chunk")
def ingest_chunk(payload: IngestChunkRequest):
    """
    Receives a PRE-CHUNKED transcript from Node.js
    and stores its embedding in the vector DB.
    """

    doc = Document(
        page_content=payload.text,
        metadata={
            "meetingId": payload.meetingId
        }
    )

    vector_store.add_documents([doc])

    return {"status": "stored"}
