import React, { useState, useEffect, useRef } from 'react';
import { Flame, Droplet, CheckCircle2, RotateCw, Scissors, Clock, Info } from 'lucide-react';

const CookingProgress = ({ data }) => {
  const [activeRecipe, setActiveRecipe] = useState(null);
  
  useEffect(() => {
    if (data.recipe && data.recipe !== "None") {
      try {
        const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        const found = saved.find(r => r.name === data.recipe);
        if (found) {
          setActiveRecipe(found);
        } else {
          setActiveRecipe({ name: data.recipe, steps: [] });
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setActiveRecipe(null);
    }
  }, [data.recipe]);

  const isCooking = data.isCooking;
  
  // Determine active stage index
  let activeIndex = -1;
  const isFinished = data.state === "Finished" || data.step === "Cooking Complete";
  
  if (isCooking && activeRecipe && activeRecipe.steps && activeRecipe.steps.length > 0) {
    if (data.stepIndex !== undefined) {
      activeIndex = data.stepIndex;
    } else {
      activeIndex = activeRecipe.steps.findIndex(s => s.stepName === data.step);
    }
  } else if (isFinished) {
    activeIndex = activeRecipe?.steps?.length || 0;
  }

  // Auto-scroll to active step
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current && activeIndex >= 0) {
      const activeElement = scrollRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (!activeRecipe || !activeRecipe.steps || activeRecipe.steps.length === 0) {
    return (
      <div className="glass-panel p-6 w-full flex flex-col items-center justify-center min-h-[200px] text-slate-500">
        <Info className="w-10 h-10 mb-3 opacity-50" />
        <p>{data.recipe && data.recipe !== "None" ? `Executing legacy recipe: ${data.recipe}` : "Machine Idle. Start a recipe to see its timeline."}</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 w-full overflow-hidden">
      <div className="flex justify-between items-center border-b border-slate-700/50 pb-4 mb-8">
        <h3 className="text-lg font-semibold text-white tracking-wide">
          Cooking Progress <span className="text-teal-400 text-sm ml-2">({activeRecipe.name})</span>
        </h3>
        <div className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700/50">
          {activeIndex >= 0 && activeIndex < activeRecipe.steps.length 
            ? `Step ${activeIndex + 1} of ${activeRecipe.steps.length}`
            : isFinished ? "Completed" : "Preparing..."}
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex items-start gap-8 overflow-x-auto pb-6 pt-2 px-4 fancy-scrollbar snap-x"
        >
          {activeRecipe.steps.map((step, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex || isFinished;
            
            return (
              <div key={index} className="flex flex-col items-center relative min-w-[140px] snap-center shrink-0">
                {/* Connecting Line */}
                {index > 0 && (
                  <div className={`absolute top-6 -left-[calc(50%+2rem)] w-full h-1 -translate-y-1/2 -z-10 ${
                    isPast || isActive ? 'bg-teal-500 glow-primary' : 'bg-slate-700/50'
                  }`} />
                )}

                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-[#09090b] z-10 ${
                    isActive 
                      ? `bg-slate-800 ring-2 ring-teal-400 shadow-[0_0_20px_rgba(0,255,204,0.4)] scale-110 relative overflow-hidden` 
                      : isPast 
                        ? 'bg-teal-900/50' 
                        : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isActive && <div className="absolute inset-0 bg-teal-500/20 animate-pulse rounded-full"></div>}
                  {isFinished && index === activeRecipe.steps.length - 1 ? (
                    <CheckCircle2 className={`w-5 h-5 ${isPast ? 'text-teal-500' : 'text-slate-600'}`} />
                  ) : (
                    <span className={`font-bold text-sm ${isActive ? 'text-teal-300' : isPast ? 'text-teal-500' : 'text-slate-500'}`}>{index + 1}</span>
                  )}
                </div>
                
                <span className={`mt-4 text-sm font-bold text-center w-full truncate transition-colors ${
                  isActive ? 'text-teal-300' : isPast ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {step.stepName}
                </span>

                {/* Sub-badges for exact timing & hardware */}
                <div className="mt-3 flex flex-col gap-1.5 w-full">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] bg-slate-800/80 rounded px-2 py-1 text-slate-400 border border-slate-700/50">
                    <Clock className="w-3 h-3 text-indigo-400" /> {(step.durationMs / 1000).toFixed(1)}s
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-1">
                    {step.usesHeater && <div title={`Heater ${step.targetTemp}°C`} className="p-1 rounded bg-rose-900/40 text-rose-400 border border-rose-800/50"><Flame className="w-3 h-3"/></div>}
                    {step.usesWaterPump && <div title={`Water ${(step.waterPumpTimeMs/1000).toFixed(1)}s`} className="p-1 rounded bg-blue-900/40 text-blue-400 border border-blue-800/50"><Droplet className="w-3 h-3"/></div>}
                    {step.usesOilPump && <div title={`Oil ${(step.oilPumpTimeMs/1000).toFixed(1)}s`} className="p-1 rounded bg-yellow-900/40 text-yellow-400 border border-yellow-800/50"><Droplet className="w-3 h-3"/></div>}
                    {step.usesMixer && <div title="Mixer" className="p-1 rounded bg-teal-900/40 text-teal-400 border border-teal-800/50"><RotateCw className="w-3 h-3"/></div>}
                    {step.usesCutter && <div title="Cutter" className="p-1 rounded bg-indigo-900/40 text-indigo-400 border border-indigo-800/50"><Scissors className="w-3 h-3"/></div>}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CookingProgress;
