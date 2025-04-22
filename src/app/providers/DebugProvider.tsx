// src/app/providers/DebugProvider.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type DebugContext = { debug: boolean; toggle: () => void };
const DebugCtx = createContext<DebugContext>({ debug: false, toggle: () => {} });

export function DebugProvider({ children }: { children: ReactNode }) {
  const [debug, setDebug] = useState(false);
  return (
    <DebugCtx.Provider value={{ debug, toggle: () => setDebug(d => !d) }}>
      {children}
    </DebugCtx.Provider>
  );
}

export function useDebug() {
  return useContext(DebugCtx);
}