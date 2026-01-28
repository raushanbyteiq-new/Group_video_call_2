"use client";

import { useState } from "react";

interface Props {
  meetingId: string;
  onClose: () => void;
}

export default function MeetingChatbotModal({ meetingId, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askBot = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("https://m0cq537v-8000.inc1.devtunnels.ms/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId,
          question: query,
        }),
      });

      const data = await res.json();
      setAnswer(data.answer || "No answer found.");
    } catch {
      setAnswer("❌ Failed to reach AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          🧠 Meeting Assistant
        </h2>

        <p className="text-sm text-gray-500 mb-3">
          Ask anything about this meeting
        </p>

        <textarea
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What was decided about database scaling?"
          className="w-full text-black border rounded-lg p-3 text-sm focus:outline-none focus:ring"
        />

        <button
          onClick={askBot}
          disabled={loading}
          className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>

        {answer && (
          <div className="mt-4 text-black p-3 bg-gray-100 rounded-lg text-sm whitespace-pre-wrap">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}
