import type { Timestamp } from 'firebase/firestore';

export interface Team {
  id: string;
  teamName: string;
  collegeName: string;
  round1: number;
  round2: number;
  round3: number;
  total: number;
  createdAt: Timestamp;
  manualRank: number | null;
}
