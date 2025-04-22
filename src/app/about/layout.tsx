// src/app/about/layout.tsx
import type { ReactNode } from 'react';

export const metadata = {
  title: 'About • RoboAdvisor',
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}