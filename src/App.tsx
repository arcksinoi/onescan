import React from 'react';
import { SettingsModal } from './features/settings/SettingsModal';
import { Scanner } from './features/scanner/Scanner';
import { RecentScans } from './features/decks/RecentScans';
import { DeckManager } from './features/decks/DeckManager';
import { useAppStore } from './store/useAppStore';

function App() {
  const { apiKey } = useAppStore();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-primary">OP TCG Scanner</h1>
        <SettingsModal />
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto p-4 max-w-2xl pb-24">
        {!apiKey ? (
          <div className="text-center py-10 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to OP TCG Scanner</h2>
            <p className="text-muted-foreground">Please enter your Google Gemini API Key in Settings to start scanning.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <Scanner />
            <RecentScans />
            <div className="border-t pt-8">
              <DeckManager />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
