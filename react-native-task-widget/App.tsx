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
import { ICON_OPTIONS, IconOption, SIZE_OPTIONS, WidgetSize } from './src/icons';

type Task = {
  id: string;
  appPackage: string;
  action: string;
  label: string;
};

const TASKS: Task[] = [
  {
    id: 'gmail-compose',
    appPackage: 'com.google.android.gm',
    action: 'android.intent.action.SEND',
    label: 'Compose email',
  },
  {
    id: 'maps-home',
    appPackage: 'com.google.android.apps.maps',
    action: 'android.intent.action.VIEW',
    label: 'Navigate home',
  },
  {
    id: 'spotify-liked',
    appPackage: 'com.spotify.music',
    action: 'android.intent.action.VIEW',
    label: 'Liked songs',
  },
];

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

  const createShortcut = async () => {
    try {
      await TaskShortcutModule.createTaskWidgetShortcut({
        shortcutId: selectedTask.id,
        title: customTitle,
        appPackage: selectedTask.appPackage,
        action: selectedTask.action,
        size: widgetSize,
        color: widgetColor,
        icon,
      });
      Alert.alert('Created', 'Shortcut widget has been pinned to launcher.');
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Task Widget Builder</Text>

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
});
