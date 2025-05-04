import { createContext } from 'use-context-selector';

export interface JankEvent {
  timestamp: number;
  delta: number;
}

export interface JankContextValue {
  lastJank: JankEvent | null;
  setLastJank: (event: JankEvent) => void;
}

export const JankContext = createContext<JankContextValue | undefined>(undefined);
