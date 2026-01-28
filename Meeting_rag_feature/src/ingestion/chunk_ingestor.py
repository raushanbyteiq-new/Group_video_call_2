from src.vector.vector_store import VectorStoreService
from src.ingestion.chunk_builder import build_chunk

class ChunkIngestor:
    def __init__(self):
        self.vector_store = VectorStoreService()

    def ingest(self, meeting_id: str, chunk_data: dict):
        document = build_chunk(meeting_id, chunk_data)
        self.vector_store.add_documents([document])
