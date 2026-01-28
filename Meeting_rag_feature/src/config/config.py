import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # --- Application Settings ---
    APP_NAME: str = "RAG Resume System"
    VERSION: str = "1.0.0"
    
    # --- Secrets (Load from .env) ---
    GOOGLE_API_KEY: str
    MONGO_URI: str
    
    # --- Database Config ---
    DB_NAME: str = "repo_chat_db"
    COLLECTION_NAME: str = "code_vectors"
    INDEX_NAME: str = "vector_index"
    
    # --- Model Config ---
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    LLM_MODEL: str = "gemini-2.5-flash-preview-09-2025"

    # Auto-load .env file
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

# Global Singleton
settings = Settings()