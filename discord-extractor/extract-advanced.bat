@echo off
echo Discord Dialog Extractor - Advanced
echo ================================

IF "%~1"=="--help" (
  node extract-advanced.js --help
  goto :end
)

IF "%~1"=="" (
  echo Using default settings.
  echo For help, use: extract-advanced.bat --help
  node extract-advanced.js
) ELSE (
  echo Using custom parameters: %*
  node extract-advanced.js %*
)

:end
pause 