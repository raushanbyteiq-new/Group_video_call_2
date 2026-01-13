import { useEffect, useState } from "react";
import type { Meeting } from "../types/meeting";
import MeetingDetail from "../components/MeetingDetail";

const API_BASE = "http://localhost:3000";

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetch(`${API_BASE}/api/meetings`)
      .then((res) => res.json())
      .then(setMeetings)
      .catch(console.error);
  }, []);

  useEffect(() => {
    console.log("Meetings loaded:", meetings);
  }, [meetings]);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <h1 className="text-3xl font-semibold mb-6">Meeting History</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4">Room</th>
              <th className="p-4">Started At</th>
              <th className="p-4">Ended At</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Participants</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting.meetingId} className="border-t">
                <td className="p-4 font-medium">{meeting.roomName}</td>

                <td className="p-4">
                  {meeting.startedAt
                    ? new Date(meeting.startedAt).toLocaleString()
                    : "—"}
                </td>
                <td className="p-4">
                  {meeting.endedAt
                    ? new Date(meeting.endedAt).toLocaleString()
                    : "—"}
                </td>
              



                <td className="p-4">
                  {meeting?.endedAt && meeting?.startedAt
                    ? ((new Date(meeting.endedAt).getTime() - new Date(meeting.startedAt).getTime()) / 1000 / 60).toFixed(1) + " mins"
                    : "—"}
                </td>
                <td className="p-4">{meeting.participants?.length}</td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedMeetingId(meeting.meetingId)}
                    className="text-blue-600 hover:underline"
                  >
                    View Details →
                  </button>
                </td>
              </tr>
            ))}

            {meetings.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No meetings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedMeetingId && (
        <MeetingDetail
          meetingId={selectedMeetingId}
          onClose={() => setSelectedMeetingId(null)}
        />
      )}
    </div>
  );
}
