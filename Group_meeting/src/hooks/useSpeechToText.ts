import { useEffect, useRef, useState } from "react";
import type { Room, LocalParticipant } from "livekit-client";
import { Track } from "livekit-client";

// ⚠️ MOVE THIS TO .env IN REAL DEPLOYMENT
const DEEPGRAM_API_KEY = "";

export const useSpeechToText = (
  room: Room | undefined,
  localParticipant: LocalParticipant | undefined,
  shouldListen: boolean,
  langCode: string
) => {
  const [localTranscript, setLocalTranscript] = useState("");

  const isListeningRef = useRef(false);
  const currentDraftRef = useRef("");

  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    isListeningRef.current = shouldListen;
    if (!shouldListen) {
      setLocalTranscript("");
      currentDraftRef.current = "";
    }
  }, [shouldListen]);

  useEffect(() => {
    if (!shouldListen) return;
    if (!room || !localParticipant) return;

    const microphonePub =
      localParticipant.getTrackPublication(Track.Source.Microphone);
    const audioTrack = microphonePub?.track?.mediaStreamTrack;

    if (!audioTrack) {
      console.warn("🎙️ STT: Microphone not available");
      return;
    }

    console.log("🚀 STT started");

    /* ============================
       CONNECT TO DEEPGRAM
    ============================ */

    const params = new URLSearchParams({
      model: "nova-3",
      language: langCode.startsWith("ja") ? "ja" : "en",
      interim_results: "true",
      smart_format: "true",
      utterance_end_ms: "1500",
      vad_events: "true",
      encoding: "linear16",
      sample_rate: "16000",
      channels: "1",
    });

    const socket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?${params.toString()}`,
      ["token", DEEPGRAM_API_KEY]
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ STT WebSocket connected");
       console.log(room.roomInfo?.sid);

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(
        new MediaStream([audioTrack])
      );
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (event) => {
        if (!isListeningRef.current) return;
        if (socket.readyState !== WebSocket.OPEN) return;

        const input = event.inputBuffer.getChannelData(0);

        const buffer = new ArrayBuffer(input.length * 2);
        const view = new DataView(buffer);

        let offset = 0;
        for (let i = 0; i < input.length; i++, offset += 2) {
          let sample = Math.max(-1, Math.min(1, input[i]));
          view.setInt16(
            offset,
            sample < 0 ? sample * 0x8000 : sample * 0x7fff,
            true
          );
        }

        socket.send(buffer);
      };
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "UtteranceEnd") {
          if (currentDraftRef.current) {
            await publishFinal(currentDraftRef.current);
            currentDraftRef.current = "";
            setLocalTranscript("");
          }
          return;
        }

        const transcript = data.channel?.alternatives?.[0]?.transcript;
        if (!transcript) return;

        if (!data.is_final) {
          currentDraftRef.current = transcript;
          setLocalTranscript(transcript);
        } else {
          await publishFinal(transcript);
          currentDraftRef.current = "";
          setLocalTranscript("");
        }
      } catch (err) {
        console.error("STT parse error", err);
      }
    };

    socket.onerror = (err) => {
      console.error("STT socket error", err);
    };

    /* ============================
       FINAL TEXT HANDLER
    ============================ */

    const publishFinal = async (text: string) => {
      if (!text.trim()) return;
      if (!isListeningRef.current) return;

      console.log("📤 STT Final:", text);

      // 1️⃣ Publish to LiveKit (captions / translation)
      const payload = new TextEncoder().encode(
        JSON.stringify({
          text,
          srcLang: langCode.startsWith("ja") ? "ja" : "en",
        })
      );

      localParticipant.publishData(payload, { reliable: true });

      // 2️⃣ Persist transcript (non-blocking)
     
      fetch(
        "https://m0cq537v-3000.inc1.devtunnels.ms/api/transcript",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingId: room.roomInfo?.sid,
            participantId: localParticipant.sid,
            participantName: localParticipant.identity,
            originalText: text,
            language: langCode,
          }),
        }
      ).catch(() => {});
    };

    /* ============================
       CLEANUP
    ============================ */

    return () => {
      console.log("🛑 STT cleanup");

      isListeningRef.current = false;

      processorRef.current?.disconnect();
      sourceRef.current?.disconnect();

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }

      socketRef.current?.close();

      processorRef.current = null;
      sourceRef.current = null;
      audioContextRef.current = null;
      socketRef.current = null;

      setLocalTranscript("");
      currentDraftRef.current = "";
    };
  }, [shouldListen, langCode, localParticipant, room]);

  return { localTranscript };
};
