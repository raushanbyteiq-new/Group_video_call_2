export interface Transcript {
  _id?: string;
  participantName: string;
  originalText: string;
  translatedText?: string;
  timestamp: string;
}