import React, { useState } from 'react';
import { AppMode } from './types';
import ArabicDetector from './components/ArabicDetector';
import TextHumanizer from './components/TextHumanizer';
import LiveConversation from './components/LiveConversation';
import MediaStudio from './components/MediaStudio';
import SearchTool from './components/SearchTool';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.ARABIC_DETECTOR);

  const renderContent = () => {
    switch (mode) {
      case AppMode.ARABIC_DETECTOR:
        return <ArabicDetector />;
      case AppMode.HUMANIZE_TEXT:
        return <TextHumanizer />;
      case AppMode.LIVE_CONVERSATION:
        return <LiveConversation />;
      case AppMode.IMAGE_STUDIO:
      case AppMode.VIDEO_VEO:
        return <MediaStudio />;
      case AppMode.SMART_SEARCH:
        return <SearchTool />;
      default:
        return <ArabicDetector />;
    }
  };

  const navItems = [
    { id: AppMode.ARABIC_DETECTOR, label: 'Arabic Detector', icon: '📝' },
    { id: AppMode.HUMANIZE_TEXT, label: 'Humanizer', icon: '✨' },
    { id: AppMode.IMAGE_STUDIO, label: 'Media Studio', icon: '🎨' },
    { id: AppMode.LIVE_CONVERSATION, label: 'Live Voice', icon: '🎙️' },
    { id: AppMode.SMART_SEARCH, label: 'Smart Search', icon: '🔍' },
  ];

  return (
    <div className="flex h-screen bg-dark text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-surface border-r border-slate-700 flex flex-col justify-between py-6">
        <div>
          <div className="px-6 mb-8 flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-white">K</div>
            <span className="text-xl font-bold hidden lg:block tracking-tight">Kashif AI</span>
          </div>
          
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  mode === item.id 
                    ? 'bg-slate-700 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden lg:block font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-6 hidden lg:block">
           <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-400">
             <p className="font-semibold text-slate-300 mb-1">Gemini Powered</p>
             <p>2.5 Flash, 3 Pro & Veo 3.1</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
         <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-dark/50 backdrop-blur-md z-10">
            <h1 className="text-lg font-semibold text-white opacity-80">
                {navItems.find(n => n.id === mode)?.label}
            </h1>
            <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>System Operational</span>
                </span>
            </div>
         </header>

         <div className="flex-1 overflow-auto bg-gradient-to-br from-dark to-slate-900">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};

export default App;