# Smart Cooking Machine - Hardware Connection Guide

This document details the component requirements, purposes, and pin assignments for the ESP32 Smart Cooking Machine.

---

## Component List and Purpose

| Component | Quantity | Purpose | ESP32 Pin Assignment |
| :--- | :---: | :--- | :--- |
| **ESP32 Development Board** | 1 | Main controller that runs firmware, hosts the WiFi Access Point (`CookingMachine_AP`), and provides the REST API to the web dashboard. | N/A |
| **Heating Coil** | 1 | Used to heat the cooking pot. | D23 (GPIO23) via SSR |
| **Heavy-Duty SSR Relay** | 1 | Controls the heating coil safely. Solid State Relays (SSR) are required for high-current AC loads like the heating coil. | - |
| **Mixing Motor (12V)** | 1 | Stirs ingredients during the cooking process to ensure even heat distribution and prevent burning. | D21 (GPIO21) via Module |
| **Cutting Motor (12V/24V)** | 1 | Powers the blades used to chop ingredients such as onions. | D22 (GPIO22) via SSR |
| **Motor SSR Relay** | 1 | Controls the cutting motor reliably under load. | - |
| **Water Pump (5V/12V)** | 1 | Pumps water from a reservoir into the cooking pot at precise times. | D19 (GPIO19) via Module |
| **Oil Pump (5V/12V)** | 1 | Dispenses cooking oil into the pan. | D18 (GPIO18) via Module |
| **Relay Module (Multiple Channels)** | 1 | Used to control the Mixing Motor, Water Pump, and Oil Pump. Standard electromechanical relays are sufficient for these components. | - |
| **DS18B20 Temperature Sensor** | 1 | Measures the cooking temperature of the pan/pot. Requires a 4.7kΩ pull-up resistor on the data line. | D4 (GPIO4) |
| **Servo Motor** | 1 | Rotates the 6-partition ingredient container to drop specific ingredients into the pot sequentially. | D5 (GPIO5) |
| **Ingredient Container** | 1 | A rotating 3D-printed/mechanical container with 6 partitions for placing pre-measured ingredients like onions, spices, tomatoes, and meat. | - |

---

## ESP32 Pin Wiring Summary

| GPIO Pin | Function | Notes |
| :--- | :--- | :--- |
| **GPIO23** | Heating Coil SSR Control | Output: High = ON, Low = OFF |
| **GPIO22** | Cutting Motor SSR Control | Output: High = ON, Low = OFF |
| **GPIO21** | Mixing Motor Relay Control | Output: High = ON, Low = OFF (Depending on relay logic) |
| **GPIO19** | Water Pump Relay Control | Output: High = ON, Low = OFF |
| **GPIO18** | Oil Pump Relay Control | Output: High = ON, Low = OFF |
| **GPIO5** | Servo Motor PWM | Requires precise PWM signals to rotate to specific angles for ingredient partitions. |
| **GPIO4** | DS18B20 Temp Sensor Data | One-Wire bus. Requires 4.7kΩ pull-up resistor between Data and 3.3V. |

---

## Wiring Guidelines and Safety

### 1. Power Isolation
- **DO NOT draw power for motors, pumps, or the heating coil from the ESP32.**
- The ESP32 5V (`VIN`) and `3.3V` pins cannot supply enough current for motors or coils.
- Use a dedicated Power Supply Unit (PSU), e.g., a 12V 10A supply for the motors and pumps.
- Use step-down converters (Buck Converters) to provide 5V to the ESP32 and Relay logic circuits from the main PSU.

### 2. High Power AC (Heating Coil)
- The Heating Coil should be wired securely using appropriately rated AC wires (check local mains voltage, e.g., 110V/220V).
- Use a high-quality Solid State Relay (SSR). Ensure the SSR has a heat sink if the heater exceeds ~5-10 Amps.
- The ESP32 GPIO23 pin connects to the `+` control input on the SSR. The ESP32 `GND` connects to the `-` control input.

### 3. Electromechanical Relay Modules
- For the mixing motor, water pump, and oil pump, use standard 5V logic relay modules (e.g., a 4-channel board).
- Connect the `VCC` of the relay board to an external 5V supply, `GND` to common ground, and `IN1`, `IN2`, `IN3` to GPIO 21, 19, and 18 respectively.
- **IMPORTANT**: Many standard Arduino relay modules are "Active Low". This means setting the GPIO to `LOW` turns the relay **ON**. The firmware will need to account for this.

### 4. Servo Motor
- Connect Servo `Signal` (Yellow/Orange) to GPIO5.
- Connect Servo `VCC` (Red) to an external 5V/6V supply. Standard servos jitter or brownout the ESP32 if powered directly from the `VIN` pin under load.
- Connect Servo `GND` (Brown/Black) to the common ground.

### 5. Temperature Sensor (DS18B20)
- `VDD` to 3.3V.
- `GND` to ESP32 Ground.
- `DATA` to GPIO4.
- **CRITICAL**: Place a 4.7kΩ resistor between `DATA` and `VDD` (3.3V).
