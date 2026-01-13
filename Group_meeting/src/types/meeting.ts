export interface Participant {
  participantId: string;
  name: string;
  joinedAt: string;
}

export interface Meeting {
  meetingId: string;
  roomName: string;
  startedAt?: string;
  endedAt?: string;
  participantCount: number;
  summary?: string;
  participants: Participant[];
}
