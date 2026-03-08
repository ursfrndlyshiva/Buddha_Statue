package com.taskwidget.widget

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.os.Bundle

class TaskWidgetConfigureActivity : Activity() {
  private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setResult(RESULT_CANCELED)

    appWidgetId = intent?.extras?.getInt(
      AppWidgetManager.EXTRA_APPWIDGET_ID,
      AppWidgetManager.INVALID_APPWIDGET_ID,
    ) ?: AppWidgetManager.INVALID_APPWIDGET_ID

    if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
      finish()
      return
    }

    val prefs = getSharedPreferences("task_widget_prefs", Context.MODE_PRIVATE)
    prefs.edit().putString("title_$appWidgetId", "Task Shortcut").apply()

    val manager = AppWidgetManager.getInstance(this)
    TaskWidgetProvider().onUpdate(this, manager, intArrayOf(appWidgetId))

    val result = Intent().apply {
      putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
    }
    setResult(RESULT_OK, result)
    finish()
  }
}
