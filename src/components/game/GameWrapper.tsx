'use client';

import { ReactNode } from 'react';
import { GameProvider } from '@/src/lib/context/GameContext';

export function GameWrapper({ children }: { children: ReactNode }) {
  return (
    <GameProvider>
      {children}
    </GameProvider>
  );
}
