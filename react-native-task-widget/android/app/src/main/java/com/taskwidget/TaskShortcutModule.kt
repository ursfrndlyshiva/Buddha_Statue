package com.taskwidget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Intent
import android.content.pm.ShortcutInfo
import android.content.pm.ShortcutManager
import android.graphics.drawable.Icon
import android.os.Build
import android.os.PersistableBundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.taskwidget.widget.TaskWidgetProvider

class TaskShortcutModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  override fun getName(): String = "TaskShortcutModule"

  @ReactMethod
  fun createTaskWidgetShortcut(config: com.facebook.react.bridge.ReadableMap, promise: Promise) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      promise.reject("UNSUPPORTED", "Pinned shortcuts require Android 8+")
      return
    }

    val shortcutManager = context.getSystemService(ShortcutManager::class.java)
    if (shortcutManager == null || !shortcutManager.isRequestPinShortcutSupported) {
      promise.reject("UNAVAILABLE", "Launcher does not support pinned shortcuts")
      return
    }

    val shortcutId = config.getString("shortcutId") ?: "task-shortcut"
    val title = config.getString("title") ?: "Task"
    val action = config.getString("action") ?: Intent.ACTION_VIEW
    val appPackage = config.getString("appPackage") ?: context.packageName

    val launchIntent = Intent(action).apply {
      `package` = appPackage
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }

    val extras = PersistableBundle().apply {
      putString("widget_size", config.getString("size") ?: "Medium")
      putString("widget_color", config.getString("color") ?: "#2D7FF9")
      putString("widget_icon", config.getString("icon") ?: "ic_widget_default")
      putString("task_title", title)
      putString("task_package", appPackage)
    }

    val icon = Icon.createWithResource(context, resolveIcon(config.getString("icon")))
    val shortcut = ShortcutInfo.Builder(context, shortcutId)
      .setShortLabel(title)
      .setLongLabel("Run task: $title")
      .setIcon(icon)
      .setIntent(launchIntent)
      .setExtras(extras)
      .build()

    shortcutManager.requestPinShortcut(shortcut, null)
    updateWidgets()

    val result = Arguments.createMap().apply {
      putString("shortcutId", shortcutId)
      putString("title", title)
    }
    promise.resolve(result)
  }

  private fun updateWidgets() {
    val manager = AppWidgetManager.getInstance(context)
    val componentName = ComponentName(context, TaskWidgetProvider::class.java)
    val ids = manager.getAppWidgetIds(componentName)
    if (ids.isNotEmpty()) {
      val intent = Intent(context, TaskWidgetProvider::class.java).apply {
        action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
      }
      context.sendBroadcast(intent)
    }
  }

  private fun resolveIcon(icon: String?): Int {
    return when (icon) {
      "ic_widget_check" -> R.drawable.ic_widget_check
      "ic_widget_alarm" -> R.drawable.ic_widget_alarm
      "ic_widget_focus" -> R.drawable.ic_widget_focus
      else -> R.drawable.ic_widget_default
    }
  }
}
