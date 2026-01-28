from functools import lru_cache
from langchain_huggingface import HuggingFaceEmbeddings
from src.config.config import settings

class EmbeddingFactory:
    """
    Factory to load the embedding model.
    Uses lru_cache to ensure we don't reload the heavy model into RAM multiple times.
    """
    @staticmethod
    @lru_cache(maxsize=1)
    def get_embedding_model():
        print(f"🧠 Loading Embedding Model: {settings.EMBEDDING_MODEL}")
        return HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)