// rag/rag.routes.js
import express from "express";
import { askMeeting } from "./query/askMeeting.js";
import { summarizeMeeting } from "./summary/summarizeMeetings.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { meetingId, question } = req.body;
  const answer = await askMeeting(meetingId, question);
  res.json({ answer });
});

router.post("/summarize", async (req, res) => {
  const { meetingId } = req.body;
  const summary = await summarizeMeeting(meetingId);
  res.json({ summary });
});

export default router;
