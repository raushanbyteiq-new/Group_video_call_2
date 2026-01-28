import mongoose from "mongoose";

const GroupChatMessageSchema = new mongoose.Schema({
  meetingId: { type: String, index: true },
  participantId: String,
  participantName: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model(
  "GroupChatMessage",
  GroupChatMessageSchema
);
