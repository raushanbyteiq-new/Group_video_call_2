import fetch from "node-fetch";

export async function sendChunkToPython(meetingId, chunk) {
  try {
    await fetch("http://localhost:8000/ingest-chunk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingId,
        text: chunk
      })
    });
  } catch (err) {
    console.error("❌ Failed to send chunk to Python:", err);
  }
}