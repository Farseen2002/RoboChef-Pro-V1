// Set ESP32 API Base URL
// For development without the ESP32, fallback to localhost endpoints or mock data.
const ESP_HOST = "http://192.168.4.1";

/**
 * Fetch status from ESP32
 */
export const fetchStatus = async () => {
  try {
    const res = await fetch(`${ESP_HOST}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    throw new Error('Machine Offline');
  }
};

/**
 * Start Cooking Recipe
 */
export const startCooking = async (recipeId) => {
  try {
    const res = await fetch(`${ESP_HOST}/start?recipe=${recipeId}`, {
      method: 'GET',
    });
    return res.ok;
  } catch (err) {
    throw new Error('Failed to start');
  }
};

/**
 * Stop Cooking
 */
export const stopCooking = async () => {
  try {
    const res = await fetch(`${ESP_HOST}/stop`, {
      method: 'GET',
    });
    return res.ok;
  } catch (err) {
    throw new Error('Failed to stop');
  }
};

/**
 * Start Custom Cooking Recipe
 */
export const startCustomRecipe = async (recipeData) => {
  try {
    const res = await fetch(`${ESP_HOST}/start_custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData)
    });
    return res.ok;
  } catch (err) {
    throw new Error('Failed to start custom recipe');
  }
};
