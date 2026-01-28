import { useState, useEffect } from "react";
import { Track } from "livekit-client";

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

import MeetingChatbotModal from "../components/MeetingChatbotModal";
import { TranslationControls } from "../components/TranslationControls";
import { SpeakerLayout } from "../components/SpeakerLayout";

import { useSpeechToText } from "../hooks/useSpeechToText";
import { useChromeTranslator } from "../hooks/useChromeTranslator";

import TranscriptModal from "../components/TranscriptModal";
import GroupChatPanel from "../components/GroupChatPanel.tsx"; // ✅ NEW

const LIVEKIT_URL = "wss://real-time-translation-0uoocd93.livekit.cloud";

/* =====================================
   ACTIVE ROOM
===================================== */
function ActiveRoom({ onLeave }: { onLeave: () => void }) {
  const room = useRoomContext();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  // Language state
  const [myLang, setMyLang] = useState("");
  const [showBot, setShowBot] = useState(false);
  const [targetLang, setTargetLang] = useState("ja");

  // AI Toggle
  const [isSttOn, setIsSttOn] = useState(false);

  // Transcript modal
  const [showTranscript, setShowTranscript] = useState(false);

  // ✅ Group chat panel
  const [showChat, setShowChat] = useState(false);

  const { translator, initTranslator, status, resetTranslator } =
    useChromeTranslator();

  const toggleHandRaise = async () => {
    const current = localParticipant.metadata
      ? JSON.parse(localParticipant.metadata)
      : {};

    await localParticipant.setMetadata(
      JSON.stringify({
        ...current,
        handRaised: !current.handRaised,
      }),
    );
  };

  useEffect(() => {
    if (!room || !localParticipant) return;

    const handleTrackPublished = (publication: any) => {
      // Log the publishing track details
      console.log("publishing  track of video", {
        room: room.name,
        roomID: room.roomInfo?.sid || "",
        participant: publication.participant?.identity || "",
        pID: publication.participant?.sid || "",
        trackID: publication.trackSid || undefined,
        enabled: publication.isEnabled,
        kind: publication.kind,
        muted: publication.isMuted,
        source: publication.source,
        streamID: publication.track?.streamId || "",
        streamTrackID: publication.track?.streamTrackId || "",
      });

      if (publication.source === Track.Source.ScreenShare) {
        console.log("🖥️ Screen share started → disabling camera");
        localParticipant.setCameraEnabled(false);
      }
    };

    const handleTrackUnpublished = (publication: any) => {
      if (publication.source === Track.Source.ScreenShare) {
        console.log("🖥️ Screen share stopped → enabling camera");
        localParticipant.setCameraEnabled(true);
      }
    };

    room.on("trackPublished", handleTrackPublished);
    room.on("trackUnpublished", handleTrackUnpublished);

    return () => {
      room.off("trackPublished", handleTrackPublished);
      room.off("trackUnpublished", handleTrackUnpublished);
    };
  }, [room, localParticipant]);

  useEffect(() => {
    if (status === "ready") resetTranslator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang]);

  const shouldActuallyListen = isSttOn && isMicrophoneEnabled;

  useEffect(() => {
    console.log(room.roomInfo?.sid);
    localStorage.setItem("roomId", room.roomInfo?.sid || "");
  });

  const { localTranscript } = useSpeechToText(
    room,
    localParticipant,
    shouldActuallyListen,
    myLang,
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
      <div
        className="h-16 bg-neutral-900 border-t border-neutral-800
                      flex justify-between
                       flex-row items-center px-4 z-50"
      >
        <div className="m-5 flex flex-row gap-2">
          <button
            onClick={() => setShowChat(true)}
            className=" bottom-20 left-6 z-50
                   bg-white/90 hover:bg-white text-black
                   px-4 py-2 rounded-lg shadow-lg text-sm"
          >
            💬 Chat
          </button>

          <button
            onClick={() => setShowTranscript(true)}
            className=" top-20 right-6 z-50
                   bg-white/90 hover:bg-white text-black
                   px-4 py-2 rounded-lg shadow-lg text-sm"
          >
            📝 Last 10 min chat
          </button>
        </div>

        <div>
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

        <button
          onClick={toggleHandRaise}
          className=" bottom-20 right-6 z-50
             bg-yellow-200 hover:bg-yellow-500
             text-black px-4 py-2 rounded-lg shadow"
        >
          ✋ Raise Hand
        </button>

        <button
          onClick={() => setShowBot(true)}
          className="bg-purple-600 hover:bg-purple-700
             text-white px-4 py-2 rounded-lg shadow text-sm"
        >
          🧠 Ask AI
        </button>
      </div>

      <RoomAudioRenderer />

      {/* 🧠 GROUP CHAT PANEL */}
      {showChat && <GroupChatPanel onClose={() => setShowChat(false)} />}

      {/* 🧾 TRANSCRIPT MODAL */}
      {showTranscript && (
        <TranscriptModal
          meetingId={room.name}
          onClose={() => setShowTranscript(false)}
        />
      )}

      {showBot && (
        <MeetingChatbotModal
          meetingId={room.roomInfo?.sid}
          onClose={() => setShowBot(false)}
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
      video={{
        // simulcast: true,
        resolution: {
          width: 640,
          height: 360,
          frameRate: 20,
        },
      }}
      audio
      token={token}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      onDisconnected={() => setToken("")}
      options={{
        publishDefaults: {
          simulcast: true,
          videoCodec: "vp9",
        },
      }}
    >
      <ActiveRoom onLeave={() => setToken("")} />
    </LiveKitRoom>
  );
}
