# React Native Android Task Widget Builder

This app demonstrates how to build a **React Native Android app** that lets users create task launcher shortcuts/widgets with:

- task target selection (package + action)
- widget size selection (`Small`, `Medium`, `Large`)
- widget color selection (hex input)
- icon selection (`default`, `check`, `alarm`, `focus`)

## Architecture

- `App.tsx`: React Native UI for picking task and appearance.
- `TaskShortcutModule.kt`: native module exposed to JS as `TaskShortcutModule`.
- `TaskWidgetProvider.kt`: Android `AppWidgetProvider` implementation.
- `TaskWidgetConfigureActivity.kt`: widget configuration activity.

## Run

```bash
npm install
npm run android
```

> Note: Home-screen widget sizing can vary by launcher; the selected size is treated as a preference and visual preview setting.
