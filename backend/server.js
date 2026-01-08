import express from 'express';
import cors from 'cors';
import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/getToken', async (req, res) => {
  const { roomName, participantName } = req.body;
  
  if (!roomName || !participantName) {
    return res.status(400).json({ error: 'Missing roomName or participantName' });
  }

  try {
    // 1. Log BEFORE creating the object
    console.log(`Using API Key: ${process.env.LIVEKIT_API_KEY}`);
    console.log(`Using API Secret: ${process.env.LIVEKIT_API_SECRET}`);

    // 2. Create AccessToken with correct arguments (key, secret, options)
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        ttl: '24h',
      }
    );

    console.log('AccessToken created successfully');

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    console.log('Grants added to AccessToken');

    const token = await at.toJwt();
    
    console.log(`Generated token for ${participantName}`);
    console.log(`Token: ${token}`);
    
    res.json({ token });

  } catch (e) {
    console.error("Error generating token:", e); // Log error to terminal so you can see it
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Ensure your .env file has LIVEKIT_API_KEY and LIVEKIT_API_SECRET set correctly.');
});