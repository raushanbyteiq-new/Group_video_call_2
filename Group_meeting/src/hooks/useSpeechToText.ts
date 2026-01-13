import { useEffect, useRef, useState } from 'react';
import type { Room, LocalParticipant } from 'livekit-client';
import { Track } from 'livekit-client';

// ⚠️ REPLACE THIS WITH YOUR REAL KEY
const DEEPGRAM_API_KEY = ""; 

export const useSpeechToText = (
  room: Room | undefined,
  localParticipant: LocalParticipant | undefined,
  shouldListen: boolean,
  langCode: string
) => {
  const [localTranscript, setLocalTranscript] = useState("");
  console.log(room.roomInfo?.sid);
  localStorage.setItem("roomId", room.roomInfo?.sid || "");
  const isListeningRef = useRef(shouldListen);
  const currentDraftRef = useRef(""); 

  useEffect(() => {
    isListeningRef.current = shouldListen;
    if (!shouldListen) setLocalTranscript("");
  }, [shouldListen]);

  useEffect(() => {    
    if (!shouldListen) return;
    if (!localParticipant || !room) {
      console.log("⚠️ STT: Waiting for Room / LocalParticipant...");
      return;
    }

    console.log(`🚀 STT: Starting for language: ${langCode}`);

    let socket: WebSocket | null = null;
    let recorder: MediaRecorder | null = null;

    const startStreaming = async () => {
      try {
        const microphonePub = localParticipant.getTrackPublication(Track.Source.Microphone);
        const audioTrack = microphonePub?.track?.mediaStreamTrack;

        if (!audioTrack) {
          console.error("❌ STT: No Microphone Track found. Please unmute.");
          return;
        }

        const baseUrl = 'wss://api.deepgram.com/v1/listen';
        const params = new URLSearchParams({
          model: 'nova-3',
          language: langCode.startsWith('ja') ? 'ja' : 'en',
          smart_format: 'true',
          interim_results: 'true',
          utterance_end_ms: '1000',
          vad_events: 'true'
        });

        const url = `${baseUrl}?${params.toString()}`;
        socket = new WebSocket(url, ['token', DEEPGRAM_API_KEY]);

        // 🔹 FINALIZED TEXT HANDLER (SINGLE SOURCE OF TRUTH)
        const publishFinalText = async (text: string) => {
          if (!isListeningRef.current) return;
          if (!text.trim()) return;

          console.log(`📤 STT Final: "${text}"`);

          // 1️⃣ Publish to LiveKit (UNCHANGED)
          const payload = new TextEncoder().encode(JSON.stringify({
            text,
            srcLang: langCode.startsWith('ja') ? 'ja' : 'en'
          }));

          localParticipant.publishData(payload, { reliable: true });

          // 2️⃣ Persist to backend (NEW, NON-BLOCKING)
          fetch("https://cortez-dineric-superurgently.ngrok-free.dev/api/transcript", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meetingId: room.roomInfo?.sid,
              participantId: localParticipant.sid,
              participantName: localParticipant.identity,
              originalText: text,
              language: langCode
            })
          }).catch(err => {
            console.error("❌ Transcript save failed:", err);
          });
        };

        socket.onopen = () => {
          console.log("✅ STT: WebSocket Connected!");
          const stream = new MediaStream([audioTrack]);
          recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

          recorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0 && socket?.readyState === 1) {
              socket.send(event.data);
            }
          });

          recorder.start(250);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // A️⃣ Utterance end (forced finalize)
            if (data.type === 'UtteranceEnd') {
              if (currentDraftRef.current) {
                publishFinalText(currentDraftRef.current);
                setLocalTranscript("");
                currentDraftRef.current = "";
              }
              return;
            }

            const transcript = data.channel?.alternatives?.[0]?.transcript;
            const isFinal = data.is_final;

            if (!transcript) return;

            // B️⃣ Interim (gray text)
            if (!isFinal) {
              setLocalTranscript(transcript);
              currentDraftRef.current = transcript;
            }
            // C️⃣ Final (black text)
            else {
              publishFinalText(transcript);
              setLocalTranscript("");
              currentDraftRef.current = "";
            }
          } catch (err) {
            console.error("Error parsing socket message", err);
          }
        };

        socket.onclose = (event) => {
          if (event.code !== 1000) {
            console.warn(`🔌 STT Closed: ${event.code}`);
          }
        };

      } catch (error) {
        console.error("❌ STT Setup Exception:", error);
      }
    };

    startStreaming();

    return () => {
      console.log("🛑 STT: Cleaning up...");
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      if (socket) socket.close();
      setLocalTranscript("");
    };
  }, [shouldListen, langCode, localParticipant, room]);

  return { localTranscript };
};
