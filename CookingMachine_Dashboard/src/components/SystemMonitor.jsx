import React from 'react';
import { Wifi, Cpu, Settings2 } from 'lucide-react';

const SystemMonitor = ({ isOnline }) => {
  return (
    <div className="glass-panel p-6 w-full space-y-4">
      <h3 className="text-lg font-semibold text-white tracking-wide border-b border-slate-700/50 pb-4">
        System Monitor
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
          <div className="flex items-center space-x-3 text-slate-300">
            <Wifi className={`w-5 h-5 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-sm font-medium">WiFi Connection</span>
          </div>
          <span className={`text-sm font-bold ${isOnline ? 'text-green-400 glow-text' : 'text-red-400'}`}>
            {isOnline ? 'Excellent' : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
          <div className="flex items-center space-x-3 text-slate-300">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium">MCU Status</span>
          </div>
          <span className="text-sm text-slate-400">Stable</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
          <div className="flex items-center space-x-3 text-slate-300">
            <Settings2 className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">Motor Activity</span>
          </div>
          <div className="flex space-x-1">
            <div className="w-1.5 h-3 bg-blue-500 rounded-sm animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-4 bg-blue-500/50 rounded-sm animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-2 bg-blue-500/30 rounded-sm animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
