#ifndef CONFIG_H
#define CONFIG_H

// WiFi AP Setup
#define WIFI_SSID "CookingMachine_AP"
#define WIFI_PASS "12345678"

// Hardware Pin Definitions
#define PIN_HEATER_SSR      23
#define PIN_CUTTER_SSR      22
#define PIN_MIXER_RELAY     21
#define PIN_WATER_PUMP      19
#define PIN_OIL_PUMP        18
#define PIN_SERVO           5
#define PIN_TEMP_DATA       4

// Target IP configuration is handled by ESP32 defaults (192.168.4.1)

// General Config
// DHT11 requires at least 2000ms between readings
#define TEMP_SENSOR_UPDATE_INTERVAL_MS 2000

#endif // CONFIG_H
