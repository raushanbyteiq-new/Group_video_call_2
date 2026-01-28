import { useEffect, useState } from "react";
import {
  ParticipantTile,
  useTracks,
  useSpeakingParticipants,
  useRoomContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";

export function SpeakerLayout() {
  const room = useRoomContext();
  const speakingParticipants = useSpeakingParticipants();

  // 🔹 Separate tracks (IMPORTANT)
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  const screenTracks = useTracks(
    [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
    { onlySubscribed: false }
  );

  // 🔒 Speaker lock
  const [lockedSpeakerSid, setLockedSpeakerSid] = useState<string | null>(null);

  // 📌 Pin logic
  const [pinnedSid, setPinnedSid] = useState<string | null>(null);

  // Auto speaker lock (only if nothing pinned)
  useEffect(() => {
    if (pinnedSid) return;
    if (!speakingParticipants.length) return;

    const timeout = setTimeout(() => {
      setLockedSpeakerSid(speakingParticipants[0].sid);
    }, 400);

    return () => clearTimeout(timeout);
  }, [speakingParticipants, pinnedSid]);

  // ✋ Hand raise helper
  const isHandRaised = (participant: any) => {
    try {
      return (
        participant.metadata &&
        JSON.parse(participant.metadata).handRaised
      );
    } catch {
      return false;
    }
  };

  // 🖥 Screen share ALWAYS wins
  const activeScreen = screenTracks[0];

  // 📌 Pin wins over speaker
  const pinnedCamera = pinnedSid
    ? cameraTracks.find((t) => t.participant.sid === pinnedSid)
    : null;

  const activeCamera = cameraTracks.find(
    (t) => t.participant.sid === lockedSpeakerSid
  );

  const activeTrack = activeScreen ?? pinnedCamera ?? activeCamera;

  const sideTracks = cameraTracks.filter(
    (t) => t.participant.sid !== activeTrack?.participant.sid
  );

  return (
    <div className="flex flex-1 w-full h-full bg-black overflow-hidden">
      {/* MAIN VIEW */}
      <div className="flex-1 flex items-center justify-center relative">
        {activeTrack ? (
          <ParticipantTile
            trackRef={activeTrack}
            className="w-full h-full ring-4 ring-blue-500"
          />
        ) : (
          <div className="text-white opacity-60">Waiting for activity…</div>
        )}
      </div>

      {/* SIDE STRIP */}
      <div className="w-64 bg-neutral-900 flex flex-col gap-2 p-2 overflow-y-auto">
        {sideTracks.map((track) => {
          const isSpeaking = speakingParticipants.some(
            (p) => p.sid === track.participant.sid
          );

          const raised = isHandRaised(track.participant);
          const pinned = pinnedSid === track.participant.sid;

          return (
            <div
              key={track.participant.sid}
              className="relative cursor-pointer"
            >
              <ParticipantTile
                trackRef={track}
                onClick={() =>
                  setPinnedSid(
                    pinned ? null : track.participant.sid
                  )
                }
                className={`rounded-lg overflow-hidden transition-all
                  ${isSpeaking ? "ring-2 ring-blue-500" : ""}
                  ${pinned ? "ring-4 ring-yellow-400" : ""}`}
              />

              {/* ✋ Hand Raised */}
              {raised && (
                <div className="absolute top-2 right-2 text-xl">✋</div>
              )}

              {/* 📌 Pin Indicator */}
              <div className="absolute bottom-2 right-2 text-sm bg-black/70 px-1 rounded">
                {pinned ? "Unpin" : "📌"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
