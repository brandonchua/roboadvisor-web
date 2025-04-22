// src/app/providers/DebugProvider.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DebugContext {
  debug: boolean;
  toggle: () => void;
}

const ctx = createContext<DebugContext>({ debug: false, toggle: () => {} });

export function DebugProvider({ children }: { children: ReactNode }) {
  const [debug, setDebug] = useState(false);
  return (
    <ctx.Provider value={{ debug, toggle: () => setDebug(d => !d) }}>
      {children}
    </ctx.Provider>
  );
}

export function useDebug() {
  return useContext(ctx);
}