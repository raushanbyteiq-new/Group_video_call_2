import { DataPacket_Kind } from "livekit-client";

export function sendGroupChat(
  room: any,
  message: string,
  participantName: string
) {
  const payload = JSON.stringify({
    type: "group-chat",
    participantName,
    message,
    timestamp: Date.now(),
  });

  room.localParticipant.publishData(
    new TextEncoder().encode(payload),
    DataPacket_Kind.RELIABLE
  );
}
