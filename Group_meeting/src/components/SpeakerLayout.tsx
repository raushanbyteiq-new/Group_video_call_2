import { useEffect, useState } from "react";
import {
  ParticipantTile,
  useTracks,
  useSpeakingParticipants,
} from "@livekit/components-react";
import { Track } from "livekit-client";

export function SpeakerLayout() {
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  const speakingParticipants = useSpeakingParticipants();
  const [lockedSpeakerSid, setLockedSpeakerSid] = useState<string | null>(null);

  // 🔒 Speaker lock logic (Zoom-style)
  useEffect(() => {
    if (!speakingParticipants.length) return;

    const newSpeakerSid = speakingParticipants[0].sid;

    setLockedSpeakerSid((currentSid) => {
      if (!currentSid) return newSpeakerSid;
      if (currentSid === newSpeakerSid) return currentSid;
      return newSpeakerSid;
    });
  }, [speakingParticipants]);

  const activeTrack = tracks.find(
    (t) => t.participant.sid === lockedSpeakerSid
  );

  const otherTracks = tracks.filter(
    (t) => t.participant.sid !== lockedSpeakerSid
  );

  return (
    <div className="flex flex-1 w-full h-full bg-black overflow-hidden">
      {/* MAIN SPEAKER */}
      <div className="flex-1 flex items-center justify-center bg-black
                      transition-all duration-300 ease-in-out">
        {activeTrack ? (
          <ParticipantTile
            trackRef={activeTrack}
            className="w-full h-full ring-4 ring-blue-500 transition-all"
          />
        ) : (
          <div className="text-white opacity-60">
            Waiting for speaker…
          </div>
        )}
      </div>

      {/* SIDE STRIP */}
      <div className="w-64 bg-neutral-900 flex flex-col gap-2 p-2 
                      overflow-y-auto transition-all duration-300">
        {otherTracks.map((track) => {
          const isSpeaking = speakingParticipants.some(
            (p) => p.sid === track.participant.sid
          );

          return (
            <ParticipantTile
              key={track.participant.sid}
              trackRef={track}
              className={`rounded-lg overflow-hidden transition-all duration-300
                ${isSpeaking ? "ring-2 ring-blue-500" : "opacity-80"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
