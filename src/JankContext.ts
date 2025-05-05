import { createContext } from 'react';

export interface JankEvent {
  timestamp: number;
  delta: number;
}

export interface JankContextValue {
  lastJank: JankEvent | null;
  setLastJank: (event: JankEvent) => void;
  deltaHistory: number[];
}

export const JankContext = createContext<JankContextValue | undefined>(undefined);
