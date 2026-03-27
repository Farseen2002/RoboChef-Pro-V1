import React from 'react';
import { WifiOff, Loader2, X } from 'lucide-react';

const ConnectionOverlay = ({ isOnline, error, isOpen, onClose }) => {
  if (isOnline || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500">
      <div className="relative glass-panel p-10 max-w-md w-full flex flex-col items-center justify-center text-center space-y-6 transform scale-100 animate-in fade-in zoom-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="bg-red-500/10 p-4 rounded-full border border-red-500/30">
            <WifiOff className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white glow-text">Machine Offline</h2>
          <p className="text-slate-400">
            {error || 'Attempting to reach CookingMachine_AP...'}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-center space-x-3 text-sm text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
          <span>Scanning network (192.168.4.1)</span>
        </div>

        <div className="w-full bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mt-4 text-xs text-left">
          <p className="font-semibold text-teal-400 mb-1">Troubleshooting:</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Ensure the ESP32 is powered on.</li>
            <li>Connect this device to the WiFi network <span className="text-white">CookingMachine_AP</span>.</li>
            <li>Use password: <span className="text-white font-mono">12345678</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectionOverlay;
