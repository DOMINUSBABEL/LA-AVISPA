import React, { useState } from 'react';
import { MarketCommand } from './components/MarketCommand';
import { GrowthGrid } from './components/GrowthGrid';
import { CampaignManager } from './components/CampaignManager';
import { Sidebar } from './components/Sidebar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Login } from './components/Login';
import { LanguageProvider, useLanguage } from './i18n';

type View = 'COMMAND' | 'MATRIX' | 'CAMPAIGN';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState<string>(process.env.API_KEY || '');
  const [currentView, setCurrentView] = useState<View>('COMMAND');
  const { language } = useLanguage();

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
        {currentView === 'COMMAND' && <MarketCommand apiKey={apiKey} language={language} />}
        {currentView === 'MATRIX' && <GrowthGrid apiKey={apiKey} language={language} />}
        {currentView === 'CAMPAIGN' && <CampaignManager apiKey={apiKey} language={language} />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;