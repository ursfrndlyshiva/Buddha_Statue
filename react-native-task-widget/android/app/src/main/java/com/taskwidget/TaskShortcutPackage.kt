package com.taskwidget

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class TaskShortcutPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> =
    mutableListOf(TaskShortcutModule(reactContext))

  override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<*, *>> =
    mutableListOf()
}
