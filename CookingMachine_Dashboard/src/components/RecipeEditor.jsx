import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Save, AlertCircle, Check } from 'lucide-react';

const defaultStep = {
  stepName: "New Step",
  durationMs: 5000,
  targetTemp: 0,
  servoPartition: -1,
  usesHeater: false,
  usesCutter: false,
  usesMixer: false,
  usesWaterPump: false,
  usesOilPump: false,
  waterPumpTimeMs: 0,
  oilPumpTimeMs: 0
};

const RecipeEditor = () => {
  const [steps, setSteps] = useState([
    { ...defaultStep, stepName: "Add Oil", usesOilPump: true, oilPumpTimeMs: 2000, durationMs: 5000 },
    { ...defaultStep, stepName: "Add Onion", servoPartition: 1, durationMs: 3000 },
    { ...defaultStep, stepName: "Cook", usesHeater: true, targetTemp: 85, usesMixer: true, durationMs: 10000 },
    { ...defaultStep, stepName: "Add Water", usesWaterPump: true, waterPumpTimeMs: 3000, durationMs: 5000 },
    { ...defaultStep, stepName: "Finished", durationMs: 2000 }
  ]);
  const [recipeName, setRecipeName] = useState("My Custom Recipe");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddStep = () => {
    if (steps.length < 20) {
      setSteps([...steps, { ...defaultStep }]);
    }
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleSaveRecipe = async () => {
    if (!recipeName.trim()) {
      setErrorMsg("Please enter a recipe name.");
      return;
    }
    if (steps.length < 5) {
      setErrorMsg("Minimum 5 steps required.");
      return;
    }
    if (steps.length > 20) {
      setErrorMsg("Maximum 20 steps allowed.");
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsSaving(true);
    
    try {
      const payload = {
        name: recipeName.trim(),
        steps: steps.map(s => ({
          ...s,
          durationMs: parseInt(s.durationMs) || 0,
          targetTemp: parseFloat(s.targetTemp) || 0,
          waterPumpTimeMs: parseInt(s.waterPumpTimeMs) || 0,
          oilPumpTimeMs: parseInt(s.oilPumpTimeMs) || 0,
          servoPartition: parseInt(s.servoPartition) || -1
        }))
      };
      
      const existing = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      existing.push(payload);
      localStorage.setItem('savedRecipes', JSON.stringify(existing));
      
      window.dispatchEvent(new Event('recipesUpdated'));
      setSuccessMsg("Recipe saved successfully!");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 3000);
    }
  };

  return (
    <div className="glass-panel p-6 w-full flex flex-col h-full space-y-4 relative">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <h3 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Custom Recipe Builder (Steps: {steps.length}/20)
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="bg-slate-900/80 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 min-w-[200px]"
            placeholder="Recipe Name"
          />
          <button 
            onClick={handleAddStep}
            disabled={steps.length >= 20}
            className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
          <button 
            onClick={handleSaveRecipe}
            disabled={isSaving || steps.length < 5 || steps.length > 20 || !recipeName.trim()}
            className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <AlertCircle className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
            Save Recipe
          </button>
        </div>
      </div>

      {(errorMsg || successMsg) && (
        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${errorMsg ? 'bg-red-900/30 text-red-400 border border-red-900/50' : 'bg-green-900/30 text-green-400 border border-green-900/50'}`}>
          {errorMsg ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {errorMsg || successMsg}
        </div>
      )}

      {steps.length < 5 && (
        <div className="text-amber-400/80 text-xs px-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Add at least {5 - steps.length} more step(s) to start cooking.
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[600px] pb-10 fancy-scrollbar">
        {steps.map((step, index) => (
          <div key={index} className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-4 group hover:border-indigo-500/30 transition-colors flex flex-col gap-3 shadow-sm hover:shadow-indigo-500/10">
            <div className="flex justify-between items-start gap-3">
               <div className="flex items-center gap-3 flex-1 flex-wrap">
                 <span className="bg-indigo-900 text-indigo-200 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shrink-0 border border-indigo-700">
                  {index + 1}
                 </span>
                 <input 
                   type="text" 
                   value={step.stepName}
                   onChange={(e) => updateStep(index, 'stepName', e.target.value)}
                   className="bg-slate-900/80 border border-slate-700/50 rounded px-3 py-1.5 text-sm text-white flex-1 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 min-w-[120px]"
                   placeholder="Step Name"
                 />
                 <div className="flex flex-col gap-0.5">
                   <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Delay (ms)</span>
                   <input 
                     type="number" 
                     value={step.durationMs}
                     onChange={(e) => updateStep(index, 'durationMs', parseInt(e.target.value) || 0)}
                     className="bg-slate-900/80 border border-slate-700/50 rounded px-2 py-1.5 text-sm text-white w-24 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                     placeholder="Delay (ms)"
                     title="Time Delay for next process (ms)"
                   />
                 </div>
               </div>
               <button 
                 onClick={() => handleRemoveStep(index)}
                 className="p-1.5 mt-4 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded transition-colors"
                 title="Remove Step"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 pl-9 pt-2 mt-2 border-t border-slate-700/30">
              {/* Components Toggles */}
              <label className={`flex items-center justify-start gap-2.5 text-sm font-medium cursor-pointer p-2 rounded-lg transition-colors border ${step.servoPartition > 0 ? "bg-indigo-900/40 text-indigo-300 border-indigo-700/50" : "bg-slate-800 text-slate-400 border-slate-700/60 hover:bg-slate-700"}`}>
                <input type="checkbox" checked={step.servoPartition > 0} onChange={(e) => updateStep(index, 'servoPartition', e.target.checked ? 1 : -1)} className="w-4 h-4 accent-indigo-500 bg-slate-900 border-slate-600 rounded cursor-pointer" />
                <span>Servo</span>
              </label>
              <label className={`flex items-center justify-start gap-2.5 text-sm font-medium cursor-pointer p-2 rounded-lg transition-colors border ${step.usesOilPump ? "bg-indigo-900/40 text-indigo-300 border-indigo-700/50" : "bg-slate-800 text-slate-400 border-slate-700/60 hover:bg-slate-700"}`}>
                <input type="checkbox" checked={step.usesOilPump} onChange={(e) => updateStep(index, 'usesOilPump', e.target.checked)} className="w-4 h-4 accent-indigo-500 bg-slate-900 border-slate-600 rounded cursor-pointer" />
                <span>Oil Pump</span>
              </label>
              <label className={`flex items-center justify-start gap-2.5 text-sm font-medium cursor-pointer p-2 rounded-lg transition-colors border ${step.usesWaterPump ? "bg-indigo-900/40 text-indigo-300 border-indigo-700/50" : "bg-slate-800 text-slate-400 border-slate-700/60 hover:bg-slate-700"}`}>
                <input type="checkbox" checked={step.usesWaterPump} onChange={(e) => updateStep(index, 'usesWaterPump', e.target.checked)} className="w-4 h-4 accent-indigo-500 bg-slate-900 border-slate-600 rounded cursor-pointer" />
                <span>Water Pump</span>
              </label>
              <label className={`flex items-center justify-start gap-2.5 text-sm font-medium cursor-pointer p-2 rounded-lg transition-colors border ${step.usesHeater ? "bg-rose-900/40 text-rose-300 border-rose-700/50" : "bg-slate-800 text-slate-400 border-slate-700/60 hover:bg-slate-700"}`}>
                <input type="checkbox" checked={step.usesHeater} onChange={(e) => updateStep(index, 'usesHeater', e.target.checked)} className="w-4 h-4 accent-rose-500 bg-slate-900 border-slate-600 rounded cursor-pointer" />
                <span>Heater</span>
              </label>
              <label className={`flex items-center justify-start gap-2.5 text-sm font-medium cursor-pointer p-2 rounded-lg transition-colors border ${step.usesMixer ? "bg-indigo-900/40 text-indigo-300 border-indigo-700/50" : "bg-slate-800 text-slate-400 border-slate-700/60 hover:bg-slate-700"}`}>
                <input type="checkbox" checked={step.usesMixer} onChange={(e) => updateStep(index, 'usesMixer', e.target.checked)} className="w-4 h-4 accent-indigo-500 bg-slate-900 border-slate-600 rounded cursor-pointer" />
                <span>Mixer</span>
              </label>
              <label className={`flex items-center justify-start gap-2.5 text-sm font-medium cursor-pointer p-2 rounded-lg transition-colors border ${step.usesCutter ? "bg-indigo-900/40 text-indigo-300 border-indigo-700/50" : "bg-slate-800 text-slate-400 border-slate-700/60 hover:bg-slate-700"}`}>
                <input type="checkbox" checked={step.usesCutter} onChange={(e) => updateStep(index, 'usesCutter', e.target.checked)} className="w-4 h-4 accent-indigo-500 bg-slate-900 border-slate-600 rounded cursor-pointer" />
                <span>Cutter</span>
              </label>
            </div>

            {/* Component Specific Settings */}
            {(step.servoPartition > 0 || step.usesOilPump || step.usesWaterPump || step.usesHeater) && (
              <div className="pl-9 pt-2 mt-1 border-t border-slate-700/30 flex gap-4 flex-wrap">
                {step.servoPartition > 0 && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Partition</span>
                    <select 
                      value={step.servoPartition}
                      onChange={(e) => updateStep(index, 'servoPartition', parseInt(e.target.value))}
                      className="bg-slate-900/80 border border-slate-700/50 rounded px-2 py-1.5 text-xs text-indigo-300 outline-none focus:border-indigo-500"
                    >
                      {[1,2,3,4,5].map(v => <option key={v} value={v}>SERVO {v}</option>)}
                    </select>
                  </div>
                )}
                {step.usesOilPump && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Oil (ms)</span>
                    <input type="number" value={step.oilPumpTimeMs} onChange={(e) => updateStep(index, 'oilPumpTimeMs', parseInt(e.target.value) || 0)} className="bg-slate-900/80 border border-slate-700/50 rounded px-2 py-1 text-xs text-indigo-300 w-24 outline-none focus:border-indigo-500" />
                  </div>
                )}
                {step.usesWaterPump && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Water (ms)</span>
                    <input type="number" value={step.waterPumpTimeMs} onChange={(e) => updateStep(index, 'waterPumpTimeMs', parseInt(e.target.value) || 0)} className="bg-slate-900/80 border border-slate-700/50 rounded px-2 py-1 text-xs text-indigo-300 w-24 outline-none focus:border-indigo-500" />
                  </div>
                )}
                {step.usesHeater && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Temp (°C)</span>
                    <input type="number" value={step.targetTemp} onChange={(e) => updateStep(index, 'targetTemp', parseFloat(e.target.value) || 0)} className="bg-slate-900/80 border border-slate-700/50 rounded px-2 py-1 text-xs text-rose-300 w-20 outline-none focus:border-rose-500" />
                  </div>
                )}
              </div>
            )}
            
          </div>
        ))}
        {steps.length === 0 && (
          <div className="text-center text-slate-500 py-10 bg-slate-800/20 rounded-lg border border-dashed border-slate-700/50">
            No steps defined. Add a step to begin your recipe builder. 
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeEditor;
