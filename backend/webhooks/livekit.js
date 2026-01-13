import express from "express";
import Meeting from "../models/Meeting.js";
import { summarizeMeeting } from "../services/summarize.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { event, room, participant } = req.body || {};
  if (!event || !room) return res.sendStatus(200);

  console.log("📩 LiveKit Event:", event);

  /* ================================
     PARTICIPANT JOINED
  ================================= */
  if (event === "participant_joined") {
    const existing = await Meeting.findOne({ meetingId: room.sid });

    // 🚫 Ignore joins after meeting ended
    if (existing && existing.isActive === false) {
      console.log("🚫 Ignoring join to ended meeting");
      return res.sendStatus(200);
    }

    await Meeting.updateOne(
      { meetingId: room.sid },
      {
        $setOnInsert: {
          meetingId: room.sid,
          roomName: room.name,
          startedAt: new Date(),
          isActive: true,
          summarized: false
        },
        $inc: { participantCount: 1 },
        $push: {
          participants: {
            participantId: participant.sid,
            name: participant.identity,
            joinedAt: new Date()
          }
        }
      },
      { upsert: true }
    );

    console.log("👤 Participant joined:", participant.identity);
  }

  /* ================================
     PARTICIPANT LEFT
  ================================= */
  if (event === "participant_left") {
    const meeting = await Meeting.findOne({ meetingId: room.sid });

    if (!meeting || meeting.isActive === false) {
      return res.sendStatus(200);
    }

    meeting.participantCount -= 1;
    await meeting.save();

    console.log("👋 Participant left:", participant.identity);
    console.log("👥 Remaining:", meeting.participantCount);

    // 🔥 LAST PARTICIPANT → SUMMARIZE NOW
    if (meeting.participantCount === 0 && meeting.summarized !== true) {
      console.log("🔥 Last participant left → summarizing");

      meeting.isActive = false;
      meeting.endedAt = new Date();
      meeting.summarized = true;
      await meeting.save();

      await summarizeMeeting(room.sid);
    }
  }

  /* ================================
     ROOM FINISHED (FALLBACK ONLY)
  ================================= */
  if (event === "room_finished") {
    const meeting = await Meeting.findOne({ meetingId: room.sid });

    if (!meeting || meeting.summarized === true) {
      return res.sendStatus(200);
    }

    console.log("⏱ room_finished fallback → summarizing");

    meeting.isActive = false;
    meeting.endedAt = new Date();
    meeting.participantCount = 0;
    meeting.summarized = true;
    await meeting.save();

    await summarizeMeeting(room.sid);
  }

  res.sendStatus(200);
});

export default router;
