import React, { useState, useEffect } from 'react';
import { Play, Square, ChefHat, Trash2 } from 'lucide-react';

const MainControlPanel = ({ onStart, onStop, isCooking }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const loadRecipes = () => {
    try {
      const recipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      setSavedRecipes(recipes);
    } catch (e) {
      console.error('Failed to load recipes', e);
    }
  };

  useEffect(() => {
    loadRecipes();
    window.addEventListener('recipesUpdated', loadRecipes);
    return () => window.removeEventListener('recipesUpdated', loadRecipes);
  }, []);

  return (
    <div className="glass-panel p-6 w-full flex flex-col space-y-6 flex-1 text-white">
      <h3 className="text-lg font-semibold tracking-wide border-b border-slate-700/50 pb-4 flex justify-between items-center">
        <span>Machine Controls</span>
        {savedRecipes.length > 0 && (
           <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700/50">
             {savedRecipes.length} Saved Recipe{savedRecipes.length > 1 ? 's' : ''}
           </span>
        )}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedRecipes.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-500 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700/50">
            No recipes saved yet. Use the Custom Recipe Builder below to create one.
          </div>
        ) : (
          savedRecipes.map((recipe, index) => (
            <div key={index} className="relative group/recipe">
              <button
                onClick={() => setSelectedRecipe(recipe)}
                disabled={isCooking}
                className={`w-full relative group overflow-hidden rounded-2xl p-6 border transition-all duration-300 ${
                  isCooking 
                    ? 'bg-slate-800/30 border-slate-700/30 opacity-50 cursor-not-allowed'
                    : selectedRecipe?.name === recipe.name
                      ? 'bg-gradient-to-br from-teal-900/40 to-slate-900/60 border-teal-500/80 shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                      : 'bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border-indigo-500/30 hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] cursor-pointer'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-4 relative z-10 text-center">
                  <div className={`p-4 rounded-full transition-transform ${
                    isCooking 
                      ? 'bg-slate-700' 
                      : selectedRecipe?.name === recipe.name
                        ? 'bg-teal-500/20 text-teal-400 scale-110'
                        : 'bg-indigo-500/20 text-indigo-400 group-hover:scale-110'
                  }`}>
                    <ChefHat className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-bold text-white tracking-wide">{recipe.name}</span>
                  <span className={`text-xs font-medium tracking-widest uppercase ${
                    selectedRecipe?.name === recipe.name ? 'text-teal-200/80' : 'text-indigo-200/60'
                  }`}>
                    {selectedRecipe?.name === recipe.name ? 'Selected' : 'Select Sequence'}
                  </span>
                </div>
              </button>

              {!isCooking && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = savedRecipes.filter((_, i) => i !== index);
                    localStorage.setItem('savedRecipes', JSON.stringify(updated));
                    setSavedRecipes(updated);
                    if (selectedRecipe?.name === recipe.name) {
                      setSelectedRecipe(null);
                    }
                    window.dispatchEvent(new Event('recipesUpdated'));
                  }}
                  className="absolute top-3 right-3 p-2 bg-slate-900/80 text-slate-400 hover:text-red-400 hover:bg-red-900/40 rounded-full border border-slate-700/50 hover:border-red-500/50 transition-all opacity-0 group-hover/recipe:opacity-100 z-20 shadow-lg"
                  title="Delete Recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Start / Stop Master Button */}
      <button
        onClick={() => {
          if (isCooking) onStop();
          else if (selectedRecipe) onStart(selectedRecipe);
        }}
        disabled={!isCooking && !selectedRecipe}
        className={`mt-4 w-full p-5 rounded-2xl font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
          isCooking
            ? 'bg-gradient-to-r from-red-600/80 to-red-500/80 hover:from-red-500 hover:to-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] border border-red-400/50'
            : selectedRecipe
              ? 'bg-gradient-to-r from-teal-600/80 to-teal-500/80 hover:from-teal-500 hover:to-teal-400 text-white shadow-[0_0_30px_rgba(20,184,166,0.3)] border border-teal-400/50 cursor-pointer'
              : 'bg-slate-800/40 text-slate-500 border border-slate-700/30 cursor-not-allowed'
        }`}
      >
        {isCooking ? (
          <Square className="fill-white" />
        ) : selectedRecipe ? (
          <Play className="fill-white" />
        ) : (
          <Square className="opacity-50" />
        )}
        {isCooking ? 'Emergency Stop' : selectedRecipe ? `Start ${selectedRecipe.name}` : 'Machine Idle'}
      </button>

    </div>
  );
};

export default MainControlPanel;
