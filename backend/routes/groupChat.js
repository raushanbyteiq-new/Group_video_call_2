import express from "express";
import GroupChatMessage from "../models/GroupChatMessage.js";

const router = express.Router();

/* Fetch chat history */
router.get("/:meetingId", async (req, res) => {
  const { meetingId } = req.params;
  console.log("Fetching chat messages for meetingId:", meetingId);
  const messages = await GroupChatMessage.find({ meetingId })
    .sort({ timestamp: 1 })
    .limit(200);

  res.json(messages);
});

/* Save chat message (called from webhook or optional REST) */
router.post("/", async (req, res) => {
    console.log("Saving chat message:", req.body);
  const message = await GroupChatMessage.create(req.body);
  res.json(message);
});

export default router;
