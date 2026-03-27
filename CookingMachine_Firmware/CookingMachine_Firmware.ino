#include <Arduino.h>
#include <WiFi.h>
#include "Config.h"
#include "Hardware.h"
#include "Recipes.h"
#include "StateMachine.h"
#include "WebAPI.h"

// Define the global system state (declared as extern in StateMachine.h)
CookingState systemState = STATE_IDLE;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- Cooking Machine Firmware Starting ---");

  // Initialize hardware components
  initHardware();
  Serial.println("Hardware Initialized.");

  // Load predefined recipes
  loadRecipes();
  Serial.println("Recipes Loaded.");

  // Setup WiFi Access Point
  Serial.print("Setting up WiFi AP: ");
  Serial.println(WIFI_SSID);
  
  WiFi.softAP(WIFI_SSID, WIFI_PASS);
  
  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  // Setup Web Server
  setupWebServer();
  Serial.println("Web Server Initialized.");
  
  Serial.println("Cooking Machine Ready.");
  Serial.println("==================================");
}

void loop() {
  // Update sensors (Temperature)
  updateSensors();

  // Run cooking state machine logic if cooking is active
  runStateMachine();

  // Handle incoming HTTP requests
  handleClient();
}
