// rag/query/askMeeting.js
export async function askMeeting(meetingId, question) {
  const chunks = await retrieveRelevantChunks(meetingId, question);
  const answer = await callLLM(chunks, question);
  return answer;
}
