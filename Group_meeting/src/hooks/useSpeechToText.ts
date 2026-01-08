import { useEffect, useRef, useState } from 'react';
import type { Room, LocalParticipant } from 'livekit-client';
import { Track } from 'livekit-client';

// ⚠️ REPLACE THIS WITH YOUR REAL KEY
const DEEPGRAM_API_KEY = "19b2a3f9d9be5a9092dff1810650198119a5d76b"; 

export const useSpeechToText = (
  room: Room | undefined,
  localParticipant: LocalParticipant | undefined,
  shouldListen: boolean,
  langCode: string
) => {
  // 1. STATE: Holds the "gray" interim text for your screen
  const [localTranscript, setLocalTranscript] = useState("");
  
  // Ref to track if we should really be listening (avoids closure staleness)
  const isListeningRef = useRef(shouldListen);
  
  // Ref to hold the current interim text (needed for UtteranceEnd logic)
  const currentDraftRef = useRef(""); 

  useEffect(() => {
    isListeningRef.current = shouldListen;
    // If we stop listening, clear any leftover local text
    if (!shouldListen) setLocalTranscript("");
  }, [shouldListen]);

  useEffect(() => {    
    // Safety Checks
    if (!shouldListen) return;
    if (!localParticipant) {
      console.log("⚠️ STT: Waiting for LocalParticipant...");
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

        // 2. CONFIGURATION: Nova-3 + Hybrid Strategy Params
        const baseUrl = 'wss://api.deepgram.com/v1/listen';
        const params = new URLSearchParams({
          model: 'nova-3',
          language: langCode.startsWith('ja') ? 'ja' : 'en',
          smart_format: 'true',
          interim_results: 'true',   // Fast updates
          utterance_end_ms: '1000',  // Force finalize if silence > 1s
          vad_events: 'true'         // Voice Activity Detection
        });

        const url = `${baseUrl}?${params.toString()}`;

        socket = new WebSocket(url, ['token', DEEPGRAM_API_KEY]);

        // Helper to publish text to LiveKit
        const publishToRoom = (text: string) => {
            if (!isListeningRef.current) return;
            console.log(`📤 STT Final: "${text}"`);
            
            const payload = new TextEncoder().encode(JSON.stringify({
              text: text,
              srcLang: langCode.startsWith('ja') ? 'ja' : 'en'
            }));
            
            localParticipant.publishData(payload, { reliable: true });
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

          recorder.start(250); // Smaller chunks for lower latency
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // A. Handle "UtteranceEnd" (User paused for 1s)
            // If we have hanging text that wasn't marked final, send it now.
            if (data.type === 'UtteranceEnd') {
                if (currentDraftRef.current) {
                    publishToRoom(currentDraftRef.current);
                    setLocalTranscript(""); // Clear local view
                    currentDraftRef.current = "";
                }
                return;
            }

            const transcript = data.channel?.alternatives?.[0]?.transcript;
            const isFinal = data.is_final;

            if (transcript) {
              // B. INTERIM RESULT (Gray Text)
              if (!isFinal) {
                setLocalTranscript(transcript);
                currentDraftRef.current = transcript;
              } 
              // C. FINAL RESULT (Black Text -> Send to Room)
              else {
                publishToRoom(transcript);
                setLocalTranscript(""); // Clear local view immediately
                currentDraftRef.current = "";
              }
            }
          } catch (err) {
            console.error("Error parsing socket message", err);
          }
        };

        socket.onclose = (event) => {
            if (event.code !== 1000) console.warn(`🔌 STT Closed: ${event.code}`);
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
      setLocalTranscript(""); // Reset UI on cleanup
    };
  }, [shouldListen, langCode, localParticipant]);

  // 3. RETURN: Pass the local text back to the UI
  return { localTranscript };
};