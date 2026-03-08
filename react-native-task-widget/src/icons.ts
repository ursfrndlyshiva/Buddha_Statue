export const ICON_OPTIONS = [
  { key: 'ic_widget_default', label: 'Default' },
  { key: 'ic_widget_check', label: 'Check' },
  { key: 'ic_widget_alarm', label: 'Alarm' },
  { key: 'ic_widget_focus', label: 'Focus' },
] as const;

export type IconOption = (typeof ICON_OPTIONS)[number]['key'];

export const SIZE_OPTIONS = ['Small', 'Medium', 'Large'] as const;
export type WidgetSize = (typeof SIZE_OPTIONS)[number];
