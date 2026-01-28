// rag/ingestion/handleTranscript.js

import { appendToBuffer } from "../buffer/meetingBuffer.js";
import { ingestChunk } from "./embedChunk.js";
import { sendChunkToPython } from "./sendChunkToPython.js";
/**
 * This function is called for EVERY transcript line.
 * It buffers text per meeting and triggers embedding
 * when buffer size crosses threshold.
 */
export async function handleTranscriptForRAG(
  meetingId,
  speaker,
  text
) {
  try {
    // 1️⃣ Append transcript text to in-memory buffer
    console.log("🧩 RAG buffering:", 
        `Meeting: ${meetingId}, Speaker: ${speaker}, Text length: ${text.length}, text: ${text}`
    );
    const chunk = appendToBuffer(meetingId, speaker, text);

    // 2️⃣ If buffer is full, ingest the chunk
    console.log("🧩 RAG chunk ready:",chunk);
    if (chunk) {
      // fire-and-forget (do NOT block transcript API)
      sendChunkToPython(meetingId, chunk);
    }
  } catch (err) {
    // Never let RAG failure affect transcript saving
    console.error("❌ RAG buffer error:", err);
  }
}
