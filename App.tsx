import React, { useState } from 'react';
import { MarketCommand } from './components/MarketCommand';
import { GrowthGrid } from './components/GrowthGrid';
import { CampaignManager } from './components/CampaignManager';
import { Sidebar } from './components/Sidebar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Login } from './components/Login';

type View = 'COMMAND' | 'MATRIX' | 'CAMPAIGN';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState<string>(process.env.API_KEY || '');
  const [currentView, setCurrentView] = useState<View>('COMMAND');

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (!apiKey) {
    return <ApiKeyModal onSetKey={setApiKey} />;
  }

  return (
    <div className="flex h-screen w-screen bg-avispa-dark font-sans overflow-hidden">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 h-full relative">
        {currentView === 'COMMAND' && <MarketCommand apiKey={apiKey} />}
        {currentView === 'MATRIX' && <GrowthGrid apiKey={apiKey} />}
        {currentView === 'CAMPAIGN' && <CampaignManager apiKey={apiKey} />}
      </main>
    </div>
  );
};

export default App;