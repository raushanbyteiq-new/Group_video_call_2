import Transcript from "../models/Transcript.js";
import Meeting from "../models/Meeting.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
/* =====================================================
   Gemini Client (FAIL FAST IF KEY IS MISSING)
===================================================== */
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing in backend .env file");
}

console.log(
  "🔑 Gemini key loaded (prefix):",
  process.env.GEMINI_API_KEY.slice(0, 6)
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =====================================================
   Summarize Meeting
   - Called when last participant leaves OR room_finished
===================================================== */
export async function summarizeMeeting(meetingId) {
  try {
    /* ===============================
       1️⃣ Fetch transcripts
    =============================== */
    const transcripts = await Transcript.find({ meetingId }).sort({
      timestamp: 1
    });

    console.log("🧠 Transcripts count:", transcripts.length);

    if (!transcripts.length) {
      console.warn("⚠️ No transcripts found, skipping summary");
      return;
    }

    /* ===============================
       2️⃣ Build conversation
    =============================== */
    const conversation = transcripts
      .map(t => `${t.participantName}: ${t.originalText}`)
      .join("\n");

    /* ===============================
       3️⃣ Gemini Model
    =============================== */
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are an AI meeting assistant.

The conversation below may contain:
- Multiple speakers
- Noisy speech-to-text
- Multiple languages

Your task:
- Create a concise meeting summary
- Extract key decisions
- Extract actionable next steps

Rules:
- Respond ONLY in English
- Do NOT invent information
- Base everything strictly on the conversation
- Be concise and clear

OUTPUT FORMAT:

Summary:
- <2–4 bullet points>

Action Items:
- <bullet list>

Conversation:
${conversation}
`;

    /* ===============================
       4️⃣ Generate summary
    =============================== */
    const result = await model.generateContent(prompt);
    const summaryText = result.response.text();

    console.log("📝 Generated Summary:\n", summaryText);

    /* ===============================
       5️⃣ Save to Meeting
    =============================== */
    await Meeting.updateOne(
      { meetingId },
      {
        summary: summaryText,
        summarizedAt: new Date()
      }
    );

    console.log(
      "✅ Summary generated with gemini-2.5-flash for meeting:",
      meetingId
    );
  } catch (err) {
    console.error("❌ Error during summarization:", err.message);
    console.error(err);
  }
}
