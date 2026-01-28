from langchain_core.documents import Document

def build_chunk(meeting_id: str, chunk_data: dict):
    return Document(
        page_content=chunk_data["text"],
        metadata={
            "meetingId": meeting_id,
            "startTime": chunk_data["start_time"],
            "endTime": chunk_data["end_time"]
        }
    )
