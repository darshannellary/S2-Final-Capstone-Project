/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { TripAssistantMain } from './components/TripAssistantMain';
import { Compass } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg animate-pulse mb-4">
          <Compass className="w-7 h-7 text-white" />
        </div>
        <div className="text-sm font-semibold tracking-wide text-slate-300">
          Initializing MMT Trip Assistant...
        </div>
      </div>
    );
  }

  // Requirement (1): Require Google or email/password sign-in before any trip planning starts
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 flex items-center justify-center p-4">
          <AuthModal />
        </div>
      </div>
    );
  }

  return <TripAssistantMain />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
