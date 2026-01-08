import { useState, useEffect, useRef } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

interface Props {
  translator: any;
  isReady: boolean;
  localTranscript?: string;
}

interface CaptionMessage {
  id: number;
  text: string;
  sender: string;
  isLocal: boolean;
}

export const Captions = ({ translator, isReady, localTranscript }: Props) => {
  const room = useRoomContext();
  
  // 1. CHANGE: Use an array (Queue) instead of a single object
  const [queue, setQueue] = useState<CaptionMessage[]>([]);
  
  const translatorRef = useRef(translator);

  useEffect(() => {
    translatorRef.current = translator;
  }, [translator]);

  useEffect(() => {
    const handleData = async (payload: Uint8Array, participant: any) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        let textToShow = data.text;
        
        const currentTranslator = translatorRef.current;

        // --- Translation Logic ---
        if (isReady && currentTranslator) {
          try {
            const result = await currentTranslator.translate(data.text);
            textToShow = result;
          } catch (err) {
            console.error("Translation failed:", err);
          }
        }

        // 2. LOGIC: Add to Queue instead of overwriting
        const newMsg: CaptionMessage = {
          id: Date.now(), // Unique ID
          text: textToShow,
          sender: participant?.identity || "Unknown",
          isLocal: false
        };

        setQueue((prev) => {
          // Keep only the last 3 messages to avoid clutter
          const updated = [...prev, newMsg];
          return updated.slice(-3);
        });

        // 3. LOGIC: Remove THIS specific message after 5 seconds
        setTimeout(() => {
          setQueue((prev) => prev.filter((msg) => msg.id !== newMsg.id));
        }, 5000);

      } catch (e) {
        console.error("Error parsing caption data:", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => { room.off(RoomEvent.DataReceived, handleData); };
  }, [room, isReady]);

  // If nothing to show, return null
  if (queue.length === 0 && !localTranscript) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl flex flex-col items-center gap-2 z-40 pointer-events-none">
      
      {/* 4. RENDER: The Queue (Past finalized sentences) */}
      {queue.map((msg) => (
        <div 
          key={msg.id}
          className="bg-neutral-900/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <p className="text-blue-400 text-xs font-bold mb-1 uppercase tracking-wider text-center">
            {msg.sender}
          </p>
          <p className="text-lg md:text-xl font-medium text-white text-center leading-snug">
            {msg.text}
          </p>
        </div>
      ))}

      {/* 5. RENDER: Local Transcript (What you are saying RIGHT NOW) */}
      {/* This stays separate so it doesn't jump around or get hidden */}
      {localTranscript && (
        <div className="bg-neutral-900/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-neutral-700 mt-2 animate-pulse">
          <p className="text-lg md:text-xl font-medium text-neutral-400 italic text-center">
            {localTranscript}
            <span className="animate-pulse ml-1">|</span>
          </p>
        </div>
      )}
      
    </div>
  );
};