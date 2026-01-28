import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";

export interface ChatMessage {
  participantName: string;
  message: string;
  timestamp: number;
}

export function useGroupChat() {
  const room = useRoomContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 🔴 Receive live messages
  useEffect(() => {
    if (!room){
        return;
    } 

    const handleData = (payload: Uint8Array) => {
      try {
        const text = new TextDecoder().decode(payload);
        const data = JSON.parse(text);

        if (data.type === "group-chat") {
          setMessages((prev) => [...prev, data]);
        }
      } catch (e) {
        console.error("Invalid chat payload", e);
      }
    };

    room.on("dataReceived", handleData);
    return () => {room.off("dataReceived", handleData);}
  }, [room]);

  // 🟢 Load history from backend
  const loadHistory = async (meetingId: string) => {
    meetingId=localStorage.getItem("roomId")||"";
    try {
      const res = await fetch(
        `https://m0cq537v-3000.inc1.devtunnels.ms/api/group-chat/${meetingId}`
      );
      const history = await res.json();
      setMessages(history);
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  };

  // 🟢 Optimistic local message
  const addLocalMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  return { messages, addLocalMessage, loadHistory };
}
