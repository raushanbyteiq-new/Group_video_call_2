import { useState, useEffect } from "react";
import "@livekit/components-styles";
import {
  LiveKitRoom,
  ControlBar,
  RoomAudioRenderer,
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react";

import { Captions } from "../components/Captions";
import { JoinScreen } from "./JoinScreen";
import { TranslationControls } from "../components/TranslationControls";
import { SpeakerLayout } from "../components/SpeakerLayout";

import { useSpeechToText } from "../hooks/useSpeechToText";
import { useChromeTranslator } from "../hooks/useChromeTranslator";

import TranscriptModal from "../components/TranscriptModal";

const LIVEKIT_URL = "wss://real-time-translation-0uoocd93.livekit.cloud";

/* =====================================
   ACTIVE ROOM
===================================== */
function ActiveRoom({ onLeave }: { onLeave: () => void }) {
  const room = useRoomContext();

  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  // Language state
  const [myLang, setMyLang] = useState("");
  const [targetLang, setTargetLang] = useState("ja");

  // AI Toggle
  const [isSttOn, setIsSttOn] = useState(false);

  // Transcript modal
  const [showTranscript, setShowTranscript] = useState(false);

  const {
    translator,
    initTranslator,
    status,
    resetTranslator,
  } = useChromeTranslator();

  useEffect(() => {
    if (status === "ready") resetTranslator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang]);

  const shouldActuallyListen = isSttOn && isMicrophoneEnabled;

  const { localTranscript } = useSpeechToText(
    room,
    localParticipant,
    shouldActuallyListen,
    myLang
  );

  const handleInit = () => {
    const source = targetLang === "ja" ? "en" : "ja";
    initTranslator(source, targetLang);
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col relative overflow-hidden">

      {/* TOP CONTROLS */}
      <TranslationControls
        myLang={myLang}
        setMyLang={setMyLang}
        targetLang={targetLang}
        setTargetLang={setTargetLang}
        onInit={handleInit}
        status={status}
        isSttOn={isSttOn}
        toggleStt={() => setIsSttOn(!isSttOn)}
      />

      {/* TRANSCRIPT BUTTON */}
      <button
        onClick={() => setShowTranscript(true)}
        className="absolute top-20 right-6 z-50
                   bg-white/90 hover:bg-white text-black
                   px-4 py-2 rounded-lg shadow-lg text-sm"
      >
        📝 Last 10 min chat
      </button>

      {/* MAIN CONTENT */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <SpeakerLayout />
        <Captions
          translator={translator}
          isReady={status === "ready"}
          localTranscript={localTranscript}
        />
      </div>

      {/* CONTROL BAR */}
      <div className="h-16 bg-neutral-900 border-t border-neutral-800
                      flex justify-center items-center px-4 z-50">
        <ControlBar
          variation="minimal"
          controls={{
            microphone: true,
            camera: true,
            screenShare: true,
            leave: true,
          }}
          // @ts-ignore
          onLeave={onLeave}
        />
      </div>

      <RoomAudioRenderer />

      {/* TRANSCRIPT MODAL */}
      {showTranscript && (
        <TranscriptModal
          meetingId={room.name}
          onClose={() => setShowTranscript(false)}
        />
      )}
    </div>
  );
}

/* =====================================
   MEETING PAGE
===================================== */
export default function MeetingPage() {
  const [token, setToken] = useState("");

  if (!token) return <JoinScreen onJoin={setToken} />;

  return (
    <LiveKitRoom
      video
      audio
      token={token}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      onDisconnected={() => setToken("")}
    >
      <ActiveRoom onLeave={() => setToken("")} />
    </LiveKitRoom>
  );
}
