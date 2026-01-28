from fastapi import APIRouter
from pydantic import BaseModel
from src.rag.chain import RAGPipeline

router = APIRouter()
pipeline = RAGPipeline()

class QueryRequest(BaseModel):
    meetingId: str
    question: str

@router.post("/query")
def ask(payload: QueryRequest):
    chain = pipeline.get_chain(payload.meetingId)
    result = chain.invoke({"input": payload.question})

    # result["answer"] is already a string in your setup
    return {
        "answer": result["answer"]
    }
