from pymongo import MongoClient
from src.config.config import settings

class Database:
    """
    Singleton Database Manager.
    Ensures we only create one connection pool for the entire app.
    """
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            # Pymongo handles connection pooling internally
            cls._client = MongoClient(settings.MONGO_URI)
        return cls._client

    @classmethod
    def get_collection(cls):
        client = cls.get_client()
        return client[settings.DB_NAME][settings.COLLECTION_NAME]