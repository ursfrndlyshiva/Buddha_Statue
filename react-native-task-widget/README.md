# Expo Android Task Widget Builder

This Expo + React Native app provides a configurable UI for creating Android task widget shortcuts with:

- task target selection (`package`, Android action, optional deep link)
- widget size selection (`Small`, `Medium`, `Large`)
- widget color selection (hex value)
- widget icon selection (`default`, `check`, `alarm`, `focus`)

## What is included

- `App.tsx`: complete builder UI, preview card, and shortcut payload assembly.
- Expo-compatible project configuration (`app.json`, `babel.config.js`).
- Android wrapper scripts including `android/gradle.bat` and `android/gradlew.bat`.

> `TaskShortcutModule` is called when available (after adding native Android implementation). Until then the app still runs in Expo and logs the payload to wire into native code.

## Run in Android emulator with Expo

```bash
cd react-native-task-widget
npm install
npm run prebuild
npm run android
```

## Gradle wrapper files

The project now contains:

- `android/gradle.bat` (Windows convenience wrapper)
- `android/gradlew.bat` (standard Gradle wrapper launcher)
- `android/gradlew` (Unix launcher)
- `android/gradle/wrapper/gradle-wrapper.properties`

If `gradle-wrapper.jar` is missing in your environment, run:

```bash
cd android
./gradlew wrapper
```

(or `gradlew.bat wrapper` on Windows).
