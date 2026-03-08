import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  NativeModules,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { StatusBar } from 'expo-status-bar';
import { ICON_OPTIONS, IconOption, SIZE_OPTIONS, WidgetSize } from './src/icons';

type Task = {
  id: string;
  appPackage: string;
  action: string;
  deepLink?: string;
  label: string;
};

const TASKS: Task[] = [
  {
    id: 'gmail-compose',
    appPackage: 'com.google.android.gm',
    action: 'android.intent.action.SENDTO',
    deepLink: 'mailto:',
    label: 'Compose email',
  },
  {
    id: 'maps-home',
    appPackage: 'com.google.android.apps.maps',
    action: 'android.intent.action.VIEW',
    deepLink: 'google.navigation:q=home',
    label: 'Navigate home',
  },
  {
    id: 'spotify-liked',
    appPackage: 'com.spotify.music',
    action: 'android.intent.action.VIEW',
    deepLink: 'spotify:collection:tracks',
    label: 'Liked songs',
  },
];

type ShortcutPayload = {
  shortcutId: string;
  title: string;
  appPackage: string;
  action: string;
  deepLink?: string;
  size: WidgetSize;
  color: string;
  icon: IconOption;
};

const { TaskShortcutModule } = NativeModules;

export default function App() {
  const [selectedTask, setSelectedTask] = useState<Task>(TASKS[0]);
  const [widgetSize, setWidgetSize] = useState<WidgetSize>('Medium');
  const [widgetColor, setWidgetColor] = useState('#2D7FF9');
  const [icon, setIcon] = useState<IconOption>('ic_widget_default');
  const [customTitle, setCustomTitle] = useState(selectedTask.label);

  const previewStyle = useMemo(
    () => [
      styles.preview,
      widgetSize === 'Small' && styles.previewSmall,
      widgetSize === 'Medium' && styles.previewMedium,
      widgetSize === 'Large' && styles.previewLarge,
      { backgroundColor: widgetColor },
    ],
    [widgetColor, widgetSize],
  );

  const onTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setCustomTitle(task.label);
  };

  const buildPayload = (): ShortcutPayload => ({
    shortcutId: selectedTask.id,
    title: customTitle || selectedTask.label,
    appPackage: selectedTask.appPackage,
    action: selectedTask.action,
    deepLink: selectedTask.deepLink,
    size: widgetSize,
    color: widgetColor,
    icon,
  });

  const createShortcut = async () => {
    const payload = buildPayload();

    if (!/^#[0-9A-Fa-f]{6}$/.test(widgetColor)) {
      Alert.alert('Invalid color', 'Use a hex color like #2D7FF9.');
      return;
    }

    try {
      if (TaskShortcutModule?.createTaskWidgetShortcut) {
        await TaskShortcutModule.createTaskWidgetShortcut(payload);
        Alert.alert('Created', 'Shortcut widget has been pinned to launcher.');
        return;
      }

      Alert.alert(
        'Native module missing',
        'Run `npm run prebuild` once and add your Android TaskShortcutModule implementation.\n\nPayload copied below for native side:',
      );
      console.log('Shortcut payload:', payload);
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  };

  const openWidgetSettings = async () => {
    await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS, {
      data: `package:${selectedTask.appPackage}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.heading}>Task Widget Builder (Expo)</Text>

      <Text style={styles.sectionTitle}>1) Choose task</Text>
      <FlatList
        data={TASKS}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => (
          <Pressable
            style={[styles.chip, selectedTask.id === item.id && styles.chipActive]}
            onPress={() => onTaskSelect(item)}>
            <Text style={styles.chipText}>{item.label}</Text>
          </Pressable>
        )}
      />

      <Text style={styles.sectionTitle}>2) Widget appearance</Text>
      <TextInput
        value={customTitle}
        onChangeText={setCustomTitle}
        placeholder="Widget title"
        style={styles.input}
      />
      <TextInput
        value={widgetColor}
        onChangeText={setWidgetColor}
        placeholder="#RRGGBB"
        autoCapitalize="none"
        style={styles.input}
      />

      <View style={styles.row}>
        {SIZE_OPTIONS.map(size => (
          <Pressable
            key={size}
            style={[styles.choice, widgetSize === size && styles.choiceActive]}
            onPress={() => setWidgetSize(size)}>
            <Text>{size}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        {ICON_OPTIONS.map(iconOption => (
          <Pressable
            key={iconOption.key}
            style={[styles.choice, icon === iconOption.key && styles.choiceActive]}
            onPress={() => setIcon(iconOption.key)}>
            <Text>{iconOption.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Preview</Text>
      <View style={previewStyle}>
        <Text style={styles.previewTitle}>{customTitle}</Text>
        <Text style={styles.previewSub}>Icon: {icon}</Text>
      </View>

      <Pressable style={styles.ctaButton} onPress={createShortcut}>
        <Text style={styles.ctaText}>Create widget shortcut</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={openWidgetSettings}>
        <Text style={styles.secondaryText}>Open selected app settings</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFF' },
  heading: { fontSize: 26, fontWeight: '700', marginBottom: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginVertical: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#BFDBFE' },
  chipText: { fontSize: 13, fontWeight: '500' },
  input: {
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  choice: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  choiceActive: {
    borderColor: '#1D4ED8',
    backgroundColor: '#DBEAFE',
  },
  preview: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  previewSmall: { width: 130, height: 72 },
  previewMedium: { width: 200, height: 92 },
  previewLarge: { width: 280, height: 120 },
  previewTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  previewSub: { color: '#fff', marginTop: 8, fontSize: 11 },
  ctaButton: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: {
    marginTop: 10,
    borderColor: '#94A3B8',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondaryText: { color: '#334155', fontSize: 14, fontWeight: '600' },
});
