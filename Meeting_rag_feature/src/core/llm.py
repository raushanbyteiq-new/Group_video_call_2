from langchain_google_genai import ChatGoogleGenerativeAI
from src.config.config import settings

class LLMFactory:
    """
    Factory to create LLM instances with consistent configurations.
    """
    @staticmethod
    def create_llm(temperature: float = 0, streaming: bool = False):
        return ChatGoogleGenerativeAI(
            model=settings.LLM_MODEL,
            temperature=temperature,
            google_api_key=settings.GOOGLE_API_KEY,
            streaming=streaming,
            max_retries=2
        )