// rag/summary/summarizeMeeting.js
export async function summarizeMeeting(meetingId) {
  const summaries = await getChunkSummaries(meetingId);
  return generateFinalSummary(summaries);
}
