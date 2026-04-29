#ifndef STATEMACHINE_H
#define STATEMACHINE_H

#include "Hardware.h"
#include "Recipes.h"

extern CookingState systemState;

void startRecipe(String recipeId) {
  Recipe* r = getRecipeById(recipeId);
  if (r != nullptr) {
    activeRecipe = r;
    activeRecipeName = r->name;
    currentRecipeStepIndex = 0;
    isCooking = true;
    systemStateStr = "Cooking";
    systemState = activeRecipe->steps[0].state;
    systemStep = activeRecipe->steps[0].stepName;
    currentStepStartTime = millis();
    targetTempReached = false;
    cookPhaseStartTime = 0;
    
    Serial.println("\n==================================");
    Serial.println("STARTING RECIPE: " + activeRecipeName);
    Serial.println("STEP 1: " + systemStep);
    Serial.println("==================================");
    
    // Apply hardware for step 0
    setHeater(activeRecipe->steps[0].usesHeater);
    setCutter(activeRecipe->steps[0].usesCutter);
    setMixer(activeRecipe->steps[0].usesMixer);
    setWaterPump(activeRecipe->steps[0].usesWaterPump);
    setOilPump(activeRecipe->steps[0].usesOilPump);
    if(activeRecipe->steps[0].servoPartition >= 0) {
      dropIngredient(activeRecipe->steps[0].servoPartition);
    }
  }
}

void stopCooking() {
  isCooking = false;
  activeRecipe = nullptr;
  activeRecipeName = "None";
  systemState = STATE_IDLE;
  systemStateStr = "IDLE";
  systemStep = "Ready to Cook";
  turnOffAllHardware();
  
  Serial.println("\n==================================");
  Serial.println("COOKING STOPPED / MACHINE IDLE");
  Serial.println("==================================");
}

void advanceStep() {
  if (!isCooking || activeRecipe == nullptr) return;
  
  currentRecipeStepIndex++;
  
  if (currentRecipeStepIndex >= activeRecipe->stepCount) {
    // Finished
    stopCooking();
    systemStateStr = "Finished";
    systemStep = "Cooking Complete";
    
    Serial.println("\n==================================");
    Serial.println("RECIPE FINISHED SUCCESSFULLY!");
    Serial.println("==================================");
    return;
  }
  
  // Next step
  RecipeStep step = activeRecipe->steps[currentRecipeStepIndex];
  systemState = step.state;
  systemStep = step.stepName;
  currentStepStartTime = millis();
  targetTempReached = false;
  cookPhaseStartTime = 0;
  
  Serial.print("--> ADVANCING TO STEP: ");
  Serial.println(systemStep);
  
  // Apply hardware state
  setHeater(step.usesHeater);
  setCutter(step.usesCutter);
  setMixer(step.usesMixer);
  setWaterPump(step.usesWaterPump);
  setOilPump(step.usesOilPump);
  if(step.servoPartition >= 0) {
    dropIngredient(step.servoPartition);
  }
}

void runStateMachine() {
  if (!isCooking || activeRecipe == nullptr) {
    return; 
  }
  
  RecipeStep currentStep = activeRecipe->steps[currentRecipeStepIndex];
  unsigned long elapsed = millis() - currentStepStartTime;
  
  // Heater and Temperature Control with 5 degree hysteresis
  if (currentStep.targetTemp > 0) {
    if (currentTemperature <= -100.0) {
      // SENSOR FAULT! DO NOT HEAT!
      setHeater(false);
    } else {
      if (!targetTempReached) {
        // Heating phase
        if (currentTemperature >= currentStep.targetTemp) {
          targetTempReached = true;
          cookPhaseStartTime = millis();
          setHeater(false); // Reached target, turn off heater
        } else {
          setHeater(true); // Ensure heater is ON while heating to target
        }
      } else {
        // Cooking phase - maintain temperature with 5-degree hysteresis
        if (currentTemperature <= (currentStep.targetTemp - 5.0)) {
          setHeater(true);
        } else if (currentTemperature >= currentStep.targetTemp) {
          setHeater(false);
        }
      }
    }
  }

  // Turn off pumps if their specific time has elapsed 
  if (currentStep.usesWaterPump && currentStep.waterPumpTimeMs > 0) {
    if (elapsed >= currentStep.waterPumpTimeMs) {
      setWaterPump(false);
    }
  }
  if (currentStep.usesOilPump && currentStep.oilPumpTimeMs > 0) {
    if (elapsed >= currentStep.oilPumpTimeMs) {
      setOilPump(false);
    }
  }

  // Check duration
  if (currentStep.targetTemp > 0) {
    if (targetTempReached) {
      unsigned long cookElapsed = millis() - cookPhaseStartTime;
      if (currentStep.durationMs > 0 && cookElapsed >= currentStep.durationMs) {
        advanceStep();
      }
    }
  } else {
    // No target temperature needed, count from the start of the step
    if (currentStep.durationMs > 0 && elapsed >= currentStep.durationMs) {
      advanceStep();
    }
  }
}

#endif
