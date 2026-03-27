import React, { useState, useEffect } from 'react';
import ConnectionOverlay from './components/ConnectionOverlay';
import MainControlPanel from './components/MainControlPanel';
import TelemetryPanel from './components/TelemetryPanel';
import CookingProgress from './components/CookingProgress';
import RecipeEditor from './components/RecipeEditor';
import SystemMonitor from './components/SystemMonitor';
import { useESP32 } from './hooks/useESP32';
import { ChefHat, Sun, Moon } from 'lucide-react';

function App() {
  const { data, isOnline, error, handleStart, handleStop } = useESP32();
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isOnline) {
      setShowOfflinePopup(false);
    }
  }, [isOnline]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen text-slate-100 font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Offline Overlay */}
      <ConnectionOverlay 
        isOnline={isOnline} 
        error={error} 
        isOpen={showOfflinePopup} 
        onClose={() => setShowOfflinePopup(false)} 
      />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/20 rounded-2xl border border-teal-500/30">
              <ChefHat className="w-8 h-8 text-teal-400 glow-text" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-200">
                RoboChef Pro
              </h1>
              <p className="text-slate-400 text-sm font-medium">Smart Machine Interface v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 sm:px-4 sm:py-2 flex items-center gap-2 bg-slate-800/50 rounded-full border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
              <span className="hidden sm:block text-sm font-bold tracking-widest uppercase text-slate-300">
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>
            <button 
              onClick={() => !isOnline && setShowOfflinePopup(true)}
              className={`hidden sm:flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 ${!isOnline ? 'cursor-pointer hover:bg-slate-700/50' : 'cursor-default'}`}
            >
               <div className="relative flex h-3 w-3">
                 {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>}
                 <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-teal-500' : 'bg-red-500'}`}></span>
               </div>
               <span className="text-sm font-bold tracking-widest uppercase text-slate-300">
                 {isOnline ? 'Online' : 'NOT CONNECTED'}
               </span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Controls & Progress) */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <MainControlPanel onStart={handleStart} onStop={handleStop} isCooking={data.isCooking} />
            <CookingProgress data={data} />
          </div>
          
          {/* Right Column (Telemetry & Data) */}
          <div className="space-y-6 flex flex-col">
            <TelemetryPanel data={data} isOnline={isOnline} />
            <SystemMonitor isOnline={isOnline} />
          </div>
          
        </div>

        {/* Full-Width Recipe Editor Section */}
        <div className="w-full min-h-[500px]">
          <RecipeEditor />
        </div>
      </div>
    </div>
  );
}

export default App;
