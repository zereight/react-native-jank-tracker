import React from 'react';

export interface JankEvent {
  timestamp: number;
  delta: number;
}

export interface JankContextValue {
  lastJank: JankEvent | null;
  setLastJank: (event: JankEvent) => void;
}

export const JankContext = React.createContext<JankContextValue | undefined>(undefined);
