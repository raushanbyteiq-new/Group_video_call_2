import mongoose from "mongoose";

const TranscriptSchema = new mongoose.Schema({
  meetingId: String,
  participantId: String,
  participantName: String,

  originalText: String,
  translatedText: String,
  language: String,

  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Transcript", TranscriptSchema);
