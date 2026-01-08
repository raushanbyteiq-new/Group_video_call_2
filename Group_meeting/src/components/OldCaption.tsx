import { useState, useEffect, useRef } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

interface Props {
  translator: any;
  isReady: boolean;
  localTranscript?: string; // <--- 1. Added this prop
}

export const Captions = ({ translator, isReady, localTranscript }: Props) => {
  const room = useRoomContext();
  const [remoteCaption, setRemoteCaption] = useState<{ text: string, sender: string } | null>(null);
  
  // Keep live reference to translator to avoid stale closures
  const translatorRef = useRef(translator);

  useEffect(() => {
    translatorRef.current = translator;
  }, [translator]);

  useEffect(() => {
    const handleData = async (payload: Uint8Array, participant: any) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        let textToShow = data.text;
        
        // --- DEBUG LOGS ---
        console.group("🎤 Caption Received");
        // console.log("Original Text:", data.text);
        
        const currentTranslator = translatorRef.current;

        if (isReady && currentTranslator) {
          try {
            // console.log("🔄 Attempting translation...");
            const result = await currentTranslator.translate(data.text);
            // console.log("✅ Translation Result:", result);
            textToShow = result;
          } catch (err) {
            console.error("❌ Translation API Error:", err);
            // console.log("Translator keys:", Object.keys(currentTranslator));
          }
        } else {
          // console.warn("⚠️ Skipping translation: Translator not ready or null.");
        }
        console.groupEnd();

        // Update the REMOTE caption state
        setRemoteCaption({ text: textToShow, sender: participant?.identity || "Unknown" });
        
        // Hide remote caption after 6 seconds
        setTimeout(() => setRemoteCaption(null), 6000);
      } catch (e) {
        console.error("Error parsing caption data:", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => { room.off(RoomEvent.DataReceived, handleData); };
  }, [room, isReady]);

  // 2. LOGIC: Decide what to show
  // Priority: Show Remote text (finalized/translated) if it exists. 
  // Otherwise, show your Local text (interim/gray).
  const activeText = remoteCaption?.text || localTranscript;
  const isLocal = !remoteCaption && !!localTranscript;

  if (!activeText) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl text-center z-40 pointer-events-none">
      <div className={`
        bg-neutral-900/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4
        ${isLocal ? 'border-neutral-700' : 'border-white/10'}
      `}>
        
        {/* Only show Sender Name if it is NOT local */}
        {!isLocal && remoteCaption && (
          <p className="text-blue-400 text-xs font-bold mb-1 uppercase tracking-wider">
            {remoteCaption.sender}
          </p>
        )}

        {/* The Caption Text */}
        <p className={`text-xl md:text-2xl font-medium leading-relaxed transition-colors duration-300
          ${isLocal ? 'text-neutral-400 italic' : 'text-white'}
        `}>
          {activeText}
          {/* Add a blinking cursor if it's local to show it's "live" */}
          {isLocal && <span className="animate-pulse ml-1">|</span>}
        </p>
      </div>
    </div>
  );
};