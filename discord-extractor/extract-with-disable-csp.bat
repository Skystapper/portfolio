@echo off
echo Discord Extractor - CSP Disabled Mode
echo =====================================
echo.

if "%~1"=="" (
  echo Usage: extract-with-disable-csp.bat [input-html-file]
  echo.
  echo This will extract the Discord dialog with CSP completely disabled,
  echo allowing all content to load regardless of source.
  exit /b
)

set INPUT_FILE=%~1
set OUTPUT_FILE=%~dp0extracted-dialog-nocsp.html
set SELECTOR=.focusLock__49fc1

echo Input: %INPUT_FILE%
echo Output: %OUTPUT_FILE%
echo.

node %~dp0extract-dialog-only.js "%INPUT_FILE%" "%OUTPUT_FILE%" "%SELECTOR%" --disable-csp

echo.
echo Done! Open %OUTPUT_FILE% in your browser to view the result. 