from fastapi import APIRouter
from src.vector.vector_store import VectorStoreService
from src.core.llm import LLMFactory

router = APIRouter()

vector_store = VectorStoreService()
llm = LLMFactory.create_llm()

@router.post("/summarize")
def summarize(meetingId: str):
    retriever = vector_store.get_retriever(meetingId, k=10)

    # 🔧 FIX deprecated call + safer invoke
    print("🧩 RAG summarization invoked for meeting:", meetingId,"retriever",retriever)
    docs = retriever.invoke("summarize the meeting")
    
    if not docs:
        return {"summary": "No data available for this meeting yet."}

    context = "\n\n".join(doc.page_content for doc in docs)

    prompt = f"""
You are a meeting summarizer.

Summarize the following meeting discussion.
Focus on:
- Key topics
- Decisions
- Action items

Meeting transcript:
{context}
"""

    # 🔧 FIX: extract text from AIMessage
    response = llm.invoke(prompt)

    summary_text = (
        response.content
        if hasattr(response, "content")
        else str(response)
    )

    return {"summary": summary_text}
