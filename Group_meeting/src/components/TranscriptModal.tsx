import { useEffect, useState } from "react";
import type{ Transcript } from "../types/Transcript";
import { useChromeTranslator } from "../hooks/useChromeTranslator";

interface Props {
  meetingId: string;
  onClose: () => void;
}

type Lang = "en" | "ja";

export default function TranscriptModal({ meetingId, onClose }: Props) {
  const [rawMessages, setRawMessages] = useState<Transcript[]>([]);
  const [translatedMessages, setTranslatedMessages] = useState<Transcript[]>([]);

  const [selectedLang, setSelectedLang] = useState<Lang>("en");
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const {
    initTranslator,
    translateText,
    // waitUntilReady,
  } = useChromeTranslator();

  /* ============================
     FETCH (NO RENDER)
  ============================= */
  useEffect(() => {
    const meetingId = localStorage.getItem("roomId") || "";
    fetch(`https://m0cq537v-3000.inc1.devtunnels.ms/api/transcript/recent/${meetingId}`)
      .then(res => res.json())
      .then(data => setRawMessages(data))
      .finally(() => setLoading(false));
  }, [meetingId]);

  /* ============================
     TRANSLATE → THEN SHOW
  ============================= */
  const applyLanguage = async () => {
    if (!rawMessages.length) return;

    setShowChat(true);
    setTranslating(true);

    const source = selectedLang === "en" ? "ja" : "en";
    const target = selectedLang;

    await initTranslator(source, target);
    // await waitUntilReady();

    const translated: Transcript[] = [];

    for (const msg of rawMessages) {
      const translatedText = await translateText(msg.originalText);

      translated.push({
        ...msg,
        translatedText,
      });
    }

    setTranslatedMessages(translated);
    setTranslating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="relative bg-white w-[620px] max-h-[80vh] rounded-xl shadow-2xl flex flex-col">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3
                     w-8 h-8 rounded-full
                     bg-black text-white hover:bg-red-600"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className=" pt-4 pl-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">
            Last 10 Minutes Chat
          </h2>
        </div>

        {/* LANGUAGE SELECTION */}
        {!showChat && (
          <div className="p-4 border-b space-y-1">
            <div className="text-sm font-2xl text-black font-bold font-medium">
              Show chat in:
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLang("en")}
                className={`px-3 py-1.5 rounded border ${
                  selectedLang === "en"
                    ? "bg-red-500 text-white"
                    : "bg-white text-red-500 font-bold border-gray-400"
                }`}
              >
                English
              </button>

              <button
                onClick={() => setSelectedLang("ja")}
                className={`px-3 py-1.5 rounded border ${
                  selectedLang === "ja"
                   ? "bg-red-500 text-white"
                    : "bg-white text-red-500 font-bold border-gray-400"
                }`}
              >
                Japanese
              </button>

              <button
                onClick={applyLanguage}
                disabled={loading}
                className="ml-auto px-4 py-1.5 rounded
                           bg-blue-600 text-white hover:bg-blue-700"
              >
                Show Chat
              </button>
            </div>
          </div>
        )}

        {/* CHAT (ONLY TRANSLATED) */}
        {showChat && (
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {translating && (
              <div className="text-center text-gray-500">
                Translating messages...
              </div>
            )}

            {!translating &&
              translatedMessages.map((msg, i) => (
                <div key={msg._id ?? i}>
                  <div className="text-sm text-gray-600">
                    <b>{msg.participantName}</b> •{" "}
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-gray-900">
                    {msg.translatedText}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
