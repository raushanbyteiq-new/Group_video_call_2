import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";


import { AccessToken } from "livekit-server-sdk";
import transcriptRoutes from "./routes/transcript.routes.js";
import livekitWebhook from "./webhooks/livekit.js";
import userRouter from "./routes/userRoute.js";
import meetingRoutes from "./routes/meeting.routes.js";
import groupChatRouter from "./routes/groupChat.js";
import ragRoutes from "./rag/rag.routes.js";
dotenv.config();

const app = express();

/* =======================
   CORS (FIXED FOR NGROK)
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cortez-dineric-superurgently.ngrok-free.dev",
  "https://m0cq537v-3000.inc1.devtunnels.ms"
];

app.use(cors());


// // ✅ SAFE preflight handler (NO "*")
// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }
//   next();
// });

// app.options("*", cors());

/* =======================
   JSON Parsing
======================= */
app.use(express.json());
app.use(express.json({ type: "application/webhook+json" }));

/* =======================
   MongoDB
======================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error", err));

/* =======================
   LiveKit Token
======================= */
app.post("/getToken", async (req, res) => {
  const { roomName, participantName } = req.body;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: participantName, ttl: "24h" }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true
  });

  at.metadata = JSON.stringify({
    video: {
      simulcast: true,
    },
    screenShare: {
      prioritize: true,
    },
  });

  const token = await at.toJwt();
  
  res.json({ token });
});

/* =======================
   APIs
======================= */
app.use("/api/transcript", transcriptRoutes);
app.use("/webhook/livekit", livekitWebhook);
app.use("/api/meetings", meetingRoutes);
app.use("/api/user", userRouter);
app.use("/api/group-chat", groupChatRouter);
app.use("/api/rag", ragRoutes);


app.listen(3000, () => {
  console.log("Server running on port 3000");
  console.log("Webhook endpoint: /webhook/livekit");
});
