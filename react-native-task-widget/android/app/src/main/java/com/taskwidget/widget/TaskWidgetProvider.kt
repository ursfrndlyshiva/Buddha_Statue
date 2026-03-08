package com.taskwidget.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.taskwidget.R

class TaskWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    appWidgetIds.forEach { appWidgetId ->
      val prefs = context.getSharedPreferences("task_widget_prefs", Context.MODE_PRIVATE)
      val title = prefs.getString("title_$appWidgetId", "Task Shortcut") ?: "Task Shortcut"

      val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
      val pendingIntent = PendingIntent.getActivity(
        context,
        appWidgetId,
        launchIntent,
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
      )

      val views = RemoteViews(context.packageName, R.layout.widget_task).apply {
        setTextViewText(R.id.widgetTaskTitle, title)
        setOnClickPendingIntent(R.id.widgetRoot, pendingIntent)
      }

      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}
