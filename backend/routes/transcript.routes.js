import express from "express";
import Transcript from "../models/Transcript.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("📥 Transcript:", req.body); // TEMP LOG
  await Transcript.create(req.body);
  res.sendStatus(201);
});

router.get("/", async (req, res) => {
  //extracting 
  res.json(transcripts);
});

router.get("/recent/:meetingId", async (req, res) => {
  try {
    const { meetingId } = req.params;
     console.log("Fetching recent transcripts for meetingId:", meetingId);
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    console.log("Time threshold (10 mins ago):", tenMinutesAgo);
    const transcripts = await Transcript.find({
      meetingId,
      timestamp: { $gte: tenMinutesAgo }
    })
      .sort({ timestamp: 1 })
      .select("participantName originalText translatedText timestamp language");
     
    console.log(`Found ${transcripts.length} transcripts`);
    res.json(transcripts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transcripts" });
  }
});

export default router;
