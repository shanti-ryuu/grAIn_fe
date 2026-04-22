# ESP32 Firebase Integration Guide

## Overview

The ESP32 microcontroller pushes sensor data to Firebase Realtime Database and polls for pending commands. The mobile app subscribes to Firebase for real-time updates.

## Firebase Credentials

- **API Key**: `AIzaSyCHeT7n0ib2fF4d-9rU-ewBBbJCnh-XU3I`
- **Database URL**: `https://grain-eae31-default-rtdb.asia-southeast1.firebasedatabase.app`
- **Project ID**: `grain-eae31`

## Required Arduino Libraries

- **FirebaseESP32** by Mobizt (v4.4.x) — Firebase client for ESP32
- **DHT Sensor Library** by Adafruit — Temperature/humidity sensor
- **ArduinoJson** by Benoit Blanchon — JSON serialization

## Firebase Data Paths

### Push Sensor Data (ESP32 → Firebase)

```
POST /grain/devices/{DEVICE_ID}/sensors
```

Example JSON payload:

```json
{
  "temperature": 65.5,
  "humidity": 42.3,
  "moisture": 18.5,
  "fanSpeed": 75,
  "energy": 2.4,
  "status": "running",
  "updatedAt": 1714051200000
}
```

Also update device status:

```
PUT /grain/devices/{DEVICE_ID}
{
  "status": "online",
  "lastActive": 1714051200000
}
```

### Poll Commands (ESP32 ← Firebase)

```
GET /grain/commands/{DEVICE_ID}/pending
```

Returns an object of pending commands keyed by commandId:

```json
{
  "67f1a2b3c4d5e6f7a8b9c0d1": {
    "command": "START",
    "mode": "AUTO",
    "temperature": 65,
    "fanSpeed": 75,
    "createdAt": 1714051200000
  }
}
```

### Mark Command Executed (ESP32 → Firebase)

After executing a command, the ESP32 should:

1. **Delete** the command from Firebase pending:
   ```
   DELETE /grain/commands/{DEVICE_ID}/pending/{COMMAND_ID}
   ```

2. **POST** to the backend API to update MongoDB:
   ```
   POST https://your-api-url/api/dryer/{DEVICE_ID}/command/{COMMAND_ID}/executed
   ```

## ESP32 Code Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Sensors    │────▶│    ESP32     │────▶│   Firebase   │
│  (DHT22,    │     │             │     │  Realtime DB │
│   moisture) │     │             │◀────│              │
└─────────────┘     │             │     └──────────────┘
                    │             │            │
                    │             │            │ onValue()
                    └─────────────┘            ▼
                                          ┌──────────────┐
                                          │  Mobile App  │
                                          │  (realtime   │
                                          │   updates)   │
                                          └──────────────┘
```

### 1. Initialize Firebase

```cpp
#include <FirebaseESP32.h>

#define FIREBASE_HOST "grain-eae31-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyCHeT7n0ib2fF4d-9rU-ewBBbJCnh-XU3I"
#define DEVICE_ID "GR-001"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}
```

### 2. Push Sensor Data (every 5 seconds)

```cpp
void pushSensorData(float temp, float hum, float moist, int fan, float energy, String status) {
  String path = "/grain/devices/" + String(DEVICE_ID) + "/sensors";
  
  FirebaseJson json;
  json.set("temperature", temp);
  json.set("humidity", hum);
  json.set("moisture", moist);
  json.set("fanSpeed", fan);
  json.set("energy", energy);
  json.set("status", status);
  json.set("updatedAt", millis());
  
  if (Firebase.setJSON(fbdo, path, json)) {
    Serial.println("Sensor data pushed");
  }
  
  // Update device status
  String statusPath = "/grain/devices/" + String(DEVICE_ID);
  FirebaseJson statusJson;
  statusJson.set("status", "online");
  statusJson.set("lastActive", millis());
  Firebase.updateNode(fbdo, statusPath, statusJson);
}
```

### 3. Poll for Commands (every 2 seconds)

```cpp
void pollCommands() {
  String path = "/grain/commands/" + String(DEVICE_ID) + "/pending";
  
  if (Firebase.getJSON(fbdo, path)) {
    FirebaseJson &json = fbdo.jsonObject();
    size_t count = json.iteratorBegin();
    
    for (size_t i = 0; i < count; i++) {
      String key = json.iteratorKey(i);
      String value = json.iteratorValue(i);
      int type = json.iteratorType(i);
      
      if (type == FirebaseJson::JSON_OBJECT) {
        // Parse command
        FirebaseJson cmdJson;
        cmdJson.setJsonData(value);
        
        FirebaseJsonData cmdData;
        cmdJson.get(cmdData, "command");
        String command = cmdData.stringValue;
        
        if (command == "START") {
          // Execute START command
          executeStart();
        } else if (command == "STOP") {
          // Execute STOP command
          executeStop();
        }
        
        // Remove executed command from pending
        String cmdPath = path + "/" + key;
        Firebase.deleteNode(fbdo, cmdPath);
        
        // TODO: Notify backend API that command was executed
        // POST /api/dryer/{DEVICE_ID}/command/{key}/executed
      }
    }
    json.iteratorEnd();
  }
}
```

### 4. Main Loop

```cpp
unsigned long lastSensorPush = 0;
unsigned long lastCommandPoll = 0;

void loop() {
  unsigned long now = millis();
  
  // Push sensor data every 5 seconds
  if (now - lastSensorPush > 5000) {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    float moist = readMoisture();
    
    pushSensorData(temp, hum, moist, currentFanSpeed, currentEnergy, currentStatus);
    lastSensorPush = now;
  }
  
  // Poll for commands every 2 seconds
  if (now - lastCommandPoll > 2000) {
    pollCommands();
    lastCommandPoll = now;
  }
}
```

## Firebase Realtime DB Structure

```
/grain/
  devices/
    GR-001/
      status: "online" | "offline"
      lastActive: 1714051200000
      sensors/
        temperature: 65.5
        humidity: 42.3
        moisture: 18.5
        fanSpeed: 75
        energy: 2.4
        status: "running" | "idle"
        updatedAt: 1714051200000
    GR-002/ ...
  commands/
    GR-001/
      pending/
        [commandId]/
          command: "START" | "STOP"
          mode: "AUTO" | "MANUAL"
          temperature: 65
          fanSpeed: 75
          createdAt: 1714051200000
```

## Security Notes

- The ESP32 uses the Firebase API key (public key) with database rules for access control.
- In production, set Firebase Realtime Database rules to restrict read/write access:

```json
{
  "rules": {
    "grain": {
      "devices": {
        ".read": true,
        "$deviceId": {
          ".write": true
        }
      },
      "commands": {
        "$deviceId": {
          ".read": true,
          "pending": {
            ".write": true
          }
        }
      }
    }
  }
}
```

- For production, consider using Firebase Auth with custom tokens for tighter security.
