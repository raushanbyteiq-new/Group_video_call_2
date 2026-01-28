import { useState, useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";
import { useGroupChat } from "../hooks/useGroupChat";
import { sendGroupChat } from "../utils/sendGroupChat";

export default function GroupChatPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const room = useRoomContext();
  const { messages, addLocalMessage, loadHistory } = useGroupChat();
  const [text, setText] = useState("");

  /* ============================
     Load chat history on open
  ============================= */
  useEffect(() => {
    if (!room) return;
    loadHistory(room.name);
  }, [room, loadHistory]);
  
  const roomId = localStorage.getItem("roomId") || "";
  const send = async () => {
    if (!text.trim() || !room) return;

    const payload = {
      participantName: room.localParticipant.identity,
      message: text,
      timestamp: Date.now(),
    };

    // ✅ Show immediately
    addLocalMessage(payload);

    // ✅ Send to others
    sendGroupChat(room, text, payload.participantName);

    // ✅ Persist to DB
    fetch("https://m0cq537v-3000.inc1.devtunnels.ms/api/group-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingId: roomId,
        participantId: room.localParticipant.identity,
        ...payload,
      }),
    }).catch(() => {});

    setText("");
  };

  return (
    <div
      className="
        absolute left-4 top-20 z-50
        w-[380px] h-[85%]
        bg-white rounded-xl shadow-2xl
        flex flex-col
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-lg text-gray-800">
          Group Chat
        </h3>
        <button
          onClick={onClose}
          className="
            w-8 h-8 flex items-center justify-center
            rounded-full text-gray-600
            hover:bg-gray-200 hover:text-black
          "
        >
          ✕
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm">
            No messages yet
          </div>
        )}

        {messages.map((m, i) => {
          const isMe =
            m.participantName === room?.localParticipant.identity;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[75%] px-3 py-2 rounded-lg text-sm
                  ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }
                `}
              >
                {!isMe && (
                  <div className="text-xs text-gray-500 mb-1">
                    {m.participantName}
                  </div>
                )}
                {m.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="border-t px-3 py-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="
            flex-1 px-3 py-2 rounded-lg
            border border-gray-300 text-black
            focus:outline-none focus:ring-2 focus:ring-blue-500
            text-sm
          "
        />
        <button
          onClick={send}
          className="
            px-4 py-2 rounded-lg
            bg-blue-600 text-white text-sm
            hover:bg-blue-700
          "
        >
          Send
        </button>
      </div>
    </div>
  );
}
