#ifndef HARDWARE_H
#define HARDWARE_H

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ESP32Servo.h>
#include "Config.h"

// Globals
OneWire oneWire(PIN_TEMP_DATA);
DallasTemperature tempSensor(&oneWire);
Servo ingredientServo;

// Variables
float currentTemperature = 25.0;
unsigned long lastTempUpdate = 0;

// State string representation
String systemStateStr = "IDLE";
String systemStep = "Ready to Cook";
bool isCooking = false;
unsigned long currentStepStartTime = 0;
int currentRecipeStepIndex = 0;
String activeRecipeName = "None";
bool targetTempReached = false;
unsigned long cookPhaseStartTime = 0;

void initHardware() {
  // Pin Modes
  pinMode(PIN_HEATER_SSR, OUTPUT);
  pinMode(PIN_CUTTER_SSR, OUTPUT);
  pinMode(PIN_MIXER_RELAY, OUTPUT);
  pinMode(PIN_WATER_PUMP, OUTPUT);
  pinMode(PIN_OIL_PUMP, OUTPUT);

  // Initial States (Assuming Active Low for Relays to initially stay OFF, Active High for SSRs)
  digitalWrite(PIN_HEATER_SSR, LOW);
  digitalWrite(PIN_CUTTER_SSR, LOW);
  digitalWrite(PIN_MIXER_RELAY, HIGH); 
  digitalWrite(PIN_WATER_PUMP, HIGH);
  digitalWrite(PIN_OIL_PUMP, HIGH);

  // Servo
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  ingredientServo.setPeriodHertz(50);
  ingredientServo.attach(PIN_SERVO, 500, 2400); 
  ingredientServo.write(0); // Home position

  // Temp Sensor
  tempSensor.begin();
}

void updateSensors() {
  unsigned long currentMillis = millis();
  if (currentMillis - lastTempUpdate >= TEMP_SENSOR_UPDATE_INTERVAL_MS) {
    lastTempUpdate = currentMillis;
    tempSensor.requestTemperatures();
    float temp = tempSensor.getTempCByIndex(0);
    if (temp > -100.0) {
      currentTemperature = temp;
    }
  }
}

// Hardware Abstraction Functions
void setHeater(bool state) { digitalWrite(PIN_HEATER_SSR, state ? HIGH : LOW); }
void setCutter(bool state) { digitalWrite(PIN_CUTTER_SSR, state ? HIGH : LOW); }
void setMixer(bool state) { digitalWrite(PIN_MIXER_RELAY, state ? LOW : HIGH); } // Active Low
void setWaterPump(bool state) { digitalWrite(PIN_WATER_PUMP, state ? LOW : HIGH); }
void setOilPump(bool state) { digitalWrite(PIN_OIL_PUMP, state ? LOW : HIGH); }

void dropIngredient(int partitionNumber) {
  if (partitionNumber < 0) return;
  int angle = partitionNumber * 36; // Maps 0-5 to 0-180 degrees
  ingredientServo.write(angle);
}

void turnOffAllHardware() {
  setHeater(false);
  setCutter(false);
  setMixer(false);
  setWaterPump(false);
  setOilPump(false);
  ingredientServo.write(0);
}

#endif
