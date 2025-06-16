@echo off
echo Discord Dialog Extractor - Final
echo ==============================

IF "%~1"=="" (
  echo No input file specified. Using default path.
  node extract-dialog-final.js
) ELSE (
  IF "%~2"=="" (
    echo Using specified input file and default output path.
    node extract-dialog-final.js "%~1"
  ) ELSE (
    echo Using specified input and output paths.
    node extract-dialog-final.js "%~1" "%~2"
  )
)

pause 