import express from "express";
import Meeting from "../models/Meeting.js";

const router = express.Router();

router.post("/join", async (req, res) => {
  const { meetingId, roomName, participant } = req.body;

  let meeting = await Meeting.findOne({ meetingId });

  if (!meeting) {
    meeting = await Meeting.create({
      meetingId,
      roomName,
      startedAt: new Date()
    });
  }

  meeting.participants.push({
    participantId: participant.pID,
    name: participant.name,
    joinedAt: new Date()
  });

  meeting.participantCount += 1;
  await meeting.save();

  res.sendStatus(200);
});

router.get("/", async (req, res) => {
  const meetings = await Meeting.find({})
    .sort({ endedAt: -1 })
    .select("meetingId roomName startedAt endedAt  participants summary");
  console.log("Fetched meetings:", meetings);
  res.json(meetings);
});

router.get("/:meetingId", async (req, res) => {
  const meeting = await Meeting.findOne({ meetingId: req.params.meetingId });

  if (!meeting) return res.status(404).json({ error: "Meeting not found" });

  res.json(meeting);
});

export default router;
