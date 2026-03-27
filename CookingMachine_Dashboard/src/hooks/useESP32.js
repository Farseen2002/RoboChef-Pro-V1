import { useState, useEffect, useCallback } from 'react';
import { fetchStatus, startCooking, stopCooking, startCustomRecipe } from '../api/esp32';

// 2 seconds polling
const POLLING_INTERVAL = 2000;

export const useESP32 = () => {
  const [data, setData] = useState({
    state: "IDLE",
    recipe: "None",
    step: "Ready to Cook",
    temperature: null,
    isCooking: false
  });
  
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(null);

  const pollStatus = useCallback(async () => {
    try {
      const result = await fetchStatus();
      setData(result);
      setIsOnline(true);
      setError(null);
    } catch (err) {
      setIsOnline(false);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    pollStatus();
    
    // Set interval loop
    const interval = setInterval(pollStatus, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [pollStatus]);

  const handleStart = async (recipe) => {
    try {
      if (typeof recipe === 'object') {
        await startCustomRecipe(recipe);
      } else {
        await startCooking(recipe);
      }
      pollStatus(); // Immediately update
    } catch (e) {
      console.error(e);
    }
  };

  const handleStop = async () => {
    try {
      await stopCooking();
      pollStatus();
    } catch (e) {
      console.error(e);
    }
  };

  return { data, isOnline, error, handleStart, handleStop };
};
