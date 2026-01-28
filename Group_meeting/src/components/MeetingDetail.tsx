import { useEffect, useState } from "react";
import type { Meeting } from "../types/meeting";


const API_BASE = "https://m0cq537v-3000.inc1.devtunnels.ms";

interface Props {
  meetingId: string;
  onClose: () => void;
}

export default function MeetingDetail({ meetingId, onClose }: Props) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/meetings/${meetingId}`)
      .then(res => res.json())
      .then(setMeeting)
      .catch(console.error);
  }, [meetingId]);

  if (!meeting) return null;

  const [summaryPart, actionPart] =
    meeting.summary?.split("Action Items:") ?? [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-3xl w-full rounded-xl shadow-lg p-8 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Meeting Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Metadata */}
        <div className="text-sm text-gray-500 mb-6">
          <span className="font-medium text-gray-700">
            {meeting.roomName}
          </span>
          {" · "}
          Ended at{" "}
          {meeting.endedAt
            ? new Date(meeting.endedAt).toLocaleString()
            : "—"}
        </div>

        {/* Participants */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <div className="flex flex-wrap gap-2">
            {meeting.participants?.map(p => (
              <span
                key={p.participantId}
                className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
              >
                {p.name}
              </span>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <div className="bg-gray-50 border rounded-lg p-4 whitespace-pre-line">
            {summaryPart || "No summary available"}
          </div>
        </section>

        {/* Action Items */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Action Items</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 whitespace-pre-line">
            {actionPart || "No action items"}
          </div>
        </section>
      </div>
    </div>
  );
}
