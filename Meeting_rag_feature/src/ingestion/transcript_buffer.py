# Keeps per-meeting in-memory buffer

from collections import defaultdict
from datetime import datetime

BUFFER_LIMIT_CHARS = 1600  # ≈ 400 tokens

class TranscriptBuffer:
    def __init__(self):
        self.buffers = defaultdict(str)
        self.timestamps = defaultdict(list)

    def append(self, meeting_id: str, speaker: str, text: str):
        line = f"[{speaker}] {text}\n"
        self.buffers[meeting_id] += line
        self.timestamps[meeting_id].append(datetime.utcnow())

        if len(self.buffers[meeting_id]) >= BUFFER_LIMIT_CHARS:
            return self.flush(meeting_id)

        return None

    def flush(self, meeting_id: str):
        text = self.buffers[meeting_id]
        times = self.timestamps[meeting_id]

        self.buffers[meeting_id] = ""
        self.timestamps[meeting_id] = []

        return {
            "text": text,
            "start_time": times[0] if times else None,
            "end_time": times[-1] if times else None
        }
