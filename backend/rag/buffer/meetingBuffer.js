// rag/buffer/meetingBuffer.js
const buffers = new Map();

const CHAR_LIMIT = 150; // ~400 tokens

export function appendToBuffer(meetingId, speaker, text) {
  if (!buffers.has(meetingId)) {
    buffers.set(meetingId, "");
  }

  const updated =
    buffers.get(meetingId) + ` [${speaker}] ${text}`;
  buffers.set(meetingId, updated);

  console.log("🧩 RAG buffer updated:",updated);
  if (updated.length >= CHAR_LIMIT) {
    const chunk = buffers.get(meetingId);
    buffers.set(meetingId, "");
    return chunk;
  }

  return null;
}

export function flushBuffer(meetingId) {
  if (!buffers.has(meetingId)) return null;

  const chunk = buffers.get(meetingId);
  buffers.delete(meetingId);

  return chunk || null;
}