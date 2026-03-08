@echo off
REM Convenience wrapper requested by user; forwards to Gradle wrapper.
set DIR=%~dp0
if exist "%DIR%gradlew.bat" (
  call "%DIR%gradlew.bat" %*
) else (
  echo gradlew.bat not found. Run "npm run prebuild" first.
  exit /b 1
)
