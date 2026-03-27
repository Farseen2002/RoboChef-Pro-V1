import React from 'react';
import { Thermometer, Activity, ChefHat, PlayCircle } from 'lucide-react';

const TelemetryPanel = ({ data, isOnline }) => {
  const isCooking = data.isCooking;

  return (
    <div className="glass-panel p-6 w-full space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <h3 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          Live Telemetry
        </h3>
        {isCooking ? (
          <span className="flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-medium animate-pulse">
            <div className="w-2 h-2 rounded-full bg-teal-400 glow-primary"></div>
            Cooking Active
          </span>
        ) : (
          <span className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 text-slate-400 border border-slate-600/50 rounded-full text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
            Standby
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Temperature Block */}
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
            <Thermometer className="w-16 h-16 text-rose-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Pot Temp</p>
          <div className="flex items-baseline space-x-1">
            <span className={`text-4xl font-bold tracking-tighter ${!isOnline || data.temperature == null ? 'text-slate-500' : 'text-white'}`}>
              {!isOnline || data.temperature == null ? "--" : data.temperature.toFixed(1)}
            </span>
            <span className="text-rose-400 font-semibold cursor-default">°C</span>
          </div>
        </div>

        {/* Recipe Info Block */}
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
             <ChefHat className="w-16 h-16 text-teal-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Recipe</p>
          <div className={`text-xl font-bold mt-1 truncate ${!isOnline ? 'text-slate-500' : 'text-white'}`}>
            {!isOnline ? "Offline" : (data.recipe === "None" ? "Waiting..." : data.recipe)}
          </div>
        </div>

        {/* Current State */}
        <div className="col-span-2 bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
             <PlayCircle className="w-24 h-24 text-blue-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Current State</p>
          <div className="flex flex-col gap-1">
            <span className={`text-2xl font-bold uppercase tracking-wider ${!isOnline ? 'text-slate-500' : 'text-teal-300'}`}>
              {!isOnline ? 'OFFLINE' : data.state}
            </span>
            <span className="text-md text-slate-300 italic">
              " {!isOnline ? 'No connection' : data.step} "
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryPanel;
