// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { ReactNode } from 'react';
import NavBar from './components/NavBar';
import { DebugProvider } from './providers/DebugProvider';

export const metadata = {
  title: 'RoboAdvisor',
  description: 'Mean-variance portfolio builder',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-800">
        {/* Wrap your entire app in the DebugProvider */}
        <DebugProvider>
          <NavBar />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </DebugProvider>
      </body>
    </html>
  );
}