// rag/ingestion/embedChunk.js
import { embedText, storeVector } from "./vectorClient.js";

export async function ingestChunk(meetingId, text) {
  const embedding = await embedText(text);

  await storeVector({
    meetingId,
    text,
    embedding,
    createdAt: new Date()
  });
}
