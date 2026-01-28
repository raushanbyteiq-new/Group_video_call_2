from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from src.core.llm import LLMFactory
from src.vector.vector_store import VectorStoreService

class RAGPipeline:
    def __init__(self):
        self.llm = LLMFactory.create_llm()
        self.vector_service = VectorStoreService()

    def get_chain(self, meeting_id: str):
        retriever = self.vector_service.get_retriever(meeting_id)

        prompt = ChatPromptTemplate.from_template("""
You are a meeting assistant.

Context:
{context}

Rules:
- Answer strictly from the context.
- If information is missing, say "I don’t have enough information from this meeting."

Question: {input}
""")

        doc_chain = create_stuff_documents_chain(self.llm, prompt)
        return create_retrieval_chain(retriever, doc_chain)
