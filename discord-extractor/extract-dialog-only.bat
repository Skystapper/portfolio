@echo off
echo Discord Dialog Extractor - Preserving All Styles
echo ============================================

IF "%~1"=="" (
  echo No input file specified. Using default path.
  node extract-dialog-only.js
) ELSE (
  IF "%~2"=="" (
    echo Using specified input file and default output path.
    node extract-dialog-only.js "%~1"
  ) ELSE (
    IF "%~3"=="" (
      echo Using specified input and output paths.
      node extract-dialog-only.js "%~1" "%~2"
    ) ELSE (
      echo Using specified input, output paths and custom selector.
      node extract-dialog-only.js "%~1" "%~2" "%~3"
    )
  )
)

pause 