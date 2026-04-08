#ifndef WEBAPI_H
#define WEBAPI_H

#include <WebServer.h>
#include <ArduinoJson.h>
#include "Config.h"
#include "Hardware.h"
#include "Recipes.h"
#include "StateMachine.h"

WebServer server(80);

void sendCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleOptions() {
  sendCORSHeaders();
  server.send(204);
}

void handleStart() {
  sendCORSHeaders();
  if (server.hasArg("recipe")) {
    String recipeId = server.arg("recipe");
    if (isCooking) {
      server.send(400, "text/plain", "Already cooking. Stop first.");
      return;
    }
    
    startRecipe(recipeId);
    if (isCooking) {
      Serial.println("[API] Target Recipe Started: " + recipeId);
      server.send(200, "text/plain", "Started " + recipeId);
    } else {
      Serial.println("[API] Target Recipe NOT FOUND: " + recipeId);
      server.send(404, "text/plain", "Recipe not found");
    }
  } else {
    server.send(400, "text/plain", "Missing recipe argument");
  }
}

void handleStop() {
  sendCORSHeaders();
  Serial.println("[API] Emergency Stop Requested!");
  stopCooking();
  server.send(200, "text/plain", "Stopped");
}

void handleStatus() {
  sendCORSHeaders();
  
  // Allocate the JSON document
  // Use StaticJsonDocument for small sizes, else dynamic
  StaticJsonDocument<256> doc;
  doc["state"] = systemStateStr;
  doc["recipe"] = activeRecipeName;
  doc["step"] = systemStep;
  doc["stepIndex"] = currentRecipeStepIndex;
  doc["temperature"] = currentTemperature;
  doc["isCooking"] = isCooking;
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handleTelemetry() {
  handleStatus(); // Telemetry responds identically to status for this implementation
}

void handleStartCustom() {
  sendCORSHeaders();
  if (isCooking) {
    server.send(400, "application/json", "{\"error\":\"Already cooking\"}");
    return;
  }
  
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\"error\":\"No body\"}");
    return;
  }
  
  String body = server.arg("plain");
  DynamicJsonDocument doc(4096);
  DeserializationError error = deserializeJson(doc, body);
  
  if (error) {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }
  
  JsonArray stepsArray = doc["steps"].as<JsonArray>();
  int count = stepsArray.size();
  
  if (count < 5 || count > 20) {
    server.send(400, "application/json", "{\"error\":\"Recipe must have between 5 and 20 steps.\"}");
    return;
  }
  
  customRecipe.name = doc["name"] | "Custom Recipe";
  customRecipe.id = "custom";
  customRecipe.stepCount = count;
  
  for (int i = 0; i < count; i++) {
    JsonObject stepObj = stepsArray[i];
    customRecipe.steps[i].state = STATE_GENERIC_STEP;
    customRecipe.steps[i].stepName = stepObj["stepName"] | "Step";
    customRecipe.steps[i].durationMs = stepObj["durationMs"] | 0;
    customRecipe.steps[i].targetTemp = stepObj["targetTemp"] | 0;
    customRecipe.steps[i].servoPartition = stepObj["servoPartition"] | -1;
    
    customRecipe.steps[i].usesHeater = stepObj["usesHeater"] | false;
    customRecipe.steps[i].usesCutter = stepObj["usesCutter"] | false;
    customRecipe.steps[i].usesMixer = stepObj["usesMixer"] | false;
    customRecipe.steps[i].usesWaterPump = stepObj["usesWaterPump"] | false;
    customRecipe.steps[i].usesOilPump = stepObj["usesOilPump"] | false;
    
    customRecipe.steps[i].waterPumpTimeMs = customRecipe.steps[i].usesWaterPump ? (stepObj["waterPumpTimeMs"] | 0) : 0;
    customRecipe.steps[i].oilPumpTimeMs = customRecipe.steps[i].usesOilPump ? (stepObj["oilPumpTimeMs"] | 0) : 0;
    customRecipe.steps[i].targetTemp = customRecipe.steps[i].usesHeater ? (stepObj["targetTemp"] | 0) : 0;
  }
  
  startRecipe("custom");
  
  Serial.println("[API] Started Custom Recipe: " + customRecipe.name);
  server.send(200, "application/json", "{\"status\":\"Success\"}");
}

void setupWebServer() {
  server.on("/start", HTTP_GET, handleStart);
  server.on("/start_custom", HTTP_POST, handleStartCustom);
  server.on("/stop", HTTP_GET, handleStop);
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/telemetry", HTTP_GET, handleTelemetry);
  
  // Handle CORS preflight options request
  server.on("/start", HTTP_OPTIONS, handleOptions);
  server.on("/start_custom", HTTP_OPTIONS, handleOptions);
  server.on("/stop", HTTP_OPTIONS, handleOptions);
  server.on("/status", HTTP_OPTIONS, handleOptions);
  server.on("/telemetry", HTTP_OPTIONS, handleOptions);
  
  server.begin();
  Serial.println("HTTP Web Server started");
}

void handleClient() {
  server.handleClient();
}

#endif
