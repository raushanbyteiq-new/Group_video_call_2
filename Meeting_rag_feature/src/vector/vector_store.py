from langchain_mongodb import MongoDBAtlasVectorSearch
from src.core.database import Database
from src.core.embedding import EmbeddingFactory
from src.config.config import settings

class VectorStoreService:
    def __init__(self):
        self.collection = Database.get_collection()
        self.embeddings = EmbeddingFactory.get_embedding_model()

    def add_documents(self, documents):
        MongoDBAtlasVectorSearch.from_documents(
            documents=documents,
            embedding=self.embeddings,
            collection=self.collection,
            index_name=settings.INDEX_NAME
        )

    def get_retriever(self, meeting_id: str, k: int = 5):
        vector_store = MongoDBAtlasVectorSearch(
            collection=self.collection,
            embedding=self.embeddings,
            index_name=settings.INDEX_NAME
        )

        return vector_store.as_retriever(
            search_kwargs={
                "k": k,
                "filter": {"meetingId": meeting_id}
            }
        )
