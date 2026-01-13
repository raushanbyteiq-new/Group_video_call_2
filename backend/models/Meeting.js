import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true },
  roomName: String,

  participants: [
    {
      participantId: String,
      name: String,
      joinedAt: Date
    }
  ],

  participantCount: { type: Number, default: 0 },

  startedAt: Date,
  endedAt: Date,

  // 🔑 STATE FLAGS
  isActive: { type: Boolean, default: true },
  summarized: { type: Boolean, default: false },

  // 🧠 AI OUTPUT
  summary: String,
  actionItems: [String],

  summarizedAt: Date
});

export default mongoose.model("Meeting", MeetingSchema);
