@echo off
echo Discord Extractor - Fixed Avatar Decorations Mode
echo ==============================================
echo.

if "%~1"=="" (
  echo Usage: extract-with-fixed-avatars.bat [input-html-file]
  echo.
  echo This will extract the Discord dialog with CSP disabled and fix avatar decorations,
  echo allowing all content to load correctly.
  exit /b
)

set INPUT_FILE=%~1
set OUTPUT_FILE=%~dp0extracted-fixed-avatars.html
set SELECTOR=.focusLock__49fc1

echo Input: %INPUT_FILE%
echo Output: %OUTPUT_FILE%
echo.

node %~dp0extract-dialog-only.js "%INPUT_FILE%" "%OUTPUT_FILE%" "%SELECTOR%" --disable-csp

echo.
echo Done! Open %OUTPUT_FILE% in your browser to view the result with fixed avatar decorations. 