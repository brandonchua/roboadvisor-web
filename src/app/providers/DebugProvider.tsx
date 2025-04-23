'use client';               // ← this is absolutely critical
import { createContext, useContext, useState, ReactNode } from 'react';

interface DebugContext {
  debug: boolean;
  toggle: () => void;
}

const _DebugContext = createContext<DebugContext | null>(null);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [debug, setDebug] = useState(false);
  return (
    <_DebugContext.Provider
      value={{
        debug,
        toggle: () => setDebug((d) => !d),
      }}
    >
      {children}
    </_DebugContext.Provider>
  );
}

export function useDebug(): DebugContext {
  const ctx = useContext(_DebugContext);
  if (!ctx) throw new Error('useDebug must be inside a <DebugProvider>');
  return ctx;
}