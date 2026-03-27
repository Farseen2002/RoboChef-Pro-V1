#ifndef RECIPES_H
#define RECIPES_H

#include <Arduino.h>

#define MAX_STEPS 20

enum CookingState {
  STATE_IDLE,
  STATE_HEATING,
  STATE_ADDING_ONION,
  STATE_CUTTING_ONION,
  STATE_ADDING_PASTE,
  STATE_ADDING_MASALA,
  STATE_ADDING_CHICKEN,
  STATE_ADDING_WATER,
  STATE_COOKING,
  STATE_ADDING_CURRY_LEAVES,
  STATE_FINISHED,
  STATE_GENERIC_STEP 
};

struct RecipeStep {
  CookingState state;
  String stepName;
  unsigned long durationMs;   
  float targetTemp;           
  int servoPartition;         
  
  bool usesHeater;
  bool usesCutter;
  bool usesMixer;
  bool usesWaterPump;
  bool usesOilPump;
  
  unsigned long waterPumpTimeMs;
  unsigned long oilPumpTimeMs;
};

struct Recipe {
  String name;
  String id;
  int stepCount;
  RecipeStep steps[MAX_STEPS];
};

const int NUM_RECIPES = 2;
Recipe recipes[NUM_RECIPES];
Recipe customRecipe; // Variable for dynamic recipes


Recipe* activeRecipe = nullptr;

void loadRecipes() {
  // 1. Chicken Curry
  recipes[0].name = "Chicken Curry";
  recipes[0].id = "chicken";
  recipes[0].stepCount = 9;
  
  recipes[0].steps[0] = { STATE_HEATING, "Add oil", 5000, 0, -1, true, false, false, false, true, 0, 5000 };
  recipes[0].steps[1] = { STATE_ADDING_ONION, "Add onion", 2000, 0, 1, false, false, false, false, false, 0, 0 };
  recipes[0].steps[2] = { STATE_CUTTING_ONION, "Cut onion", 10000, 0, -1, false, true, true, false, false, 0, 0 };
  recipes[0].steps[3] = { STATE_ADDING_PASTE, "Add ginger garlic tomato", 2000, 0, 2, false, false, false, false, false, 0, 0 };
  recipes[0].steps[4] = { STATE_ADDING_MASALA, "Add masala", 2000, 0, 3, false, false, false, false, false, 0, 0 };
  recipes[0].steps[5] = { STATE_ADDING_CHICKEN, "Add chicken", 2000, 0, 4, false, false, false, false, false, 0, 0 };
  recipes[0].steps[6] = { STATE_ADDING_WATER, "Add water", 8000, 0, -1, false, false, true, true, false, 8000, 0 };
  recipes[0].steps[7] = { STATE_COOKING, "Cook", 30000, 85, -1, true, false, true, false, false, 0, 0 }; 
  recipes[0].steps[8] = { STATE_ADDING_CURRY_LEAVES, "Add curry leaves", 2000, 0, 5, false, false, false, false, false, 0, 0 };

  // 2. Vegetable Curry
  recipes[1].name = "Vegetable Curry";
  recipes[1].id = "vegetable";
  recipes[1].stepCount = 5;
  
  recipes[1].steps[0] = { STATE_HEATING, "Add oil", 3000, 0, -1, true, false, false, false, true, 0, 3000 };
  recipes[1].steps[1] = { STATE_GENERIC_STEP, "Add vegetables", 2000, 0, 1, false, false, false, false, false, 0, 0 };
  recipes[1].steps[2] = { STATE_GENERIC_STEP, "Add water", 5000, 0, -1, false, false, true, true, false, 5000, 0 };
  recipes[1].steps[3] = { STATE_COOKING, "Cook", 20000, 90, -1, true, false, true, false, false, 0, 0 };
  recipes[1].steps[4] = { STATE_FINISHED, "Finished", 1000, 0, 0, false, false, false, false, false, 0, 0 };
}

Recipe* getRecipeById(String id) {
  if (id == "custom") {
    return &customRecipe;
  }
  for (int i = 0; i < NUM_RECIPES; i++) {
    if (recipes[i].id == id) {
      return &recipes[i];
    }
  }
  return nullptr;
}

#endif
