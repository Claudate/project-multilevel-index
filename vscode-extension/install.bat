@echo off
echo ========================================
echo VSCode Extension Installation Script
echo ========================================
echo.

REM Check if .vsix file exists
if not exist "project-multilevel-index-0.1.0.vsix" (
    echo [ERROR] .vsix file not found!
    echo Please run this script from the vscode-extension directory
    pause
    exit /b 1
)

echo [1/4] Found .vsix file: project-multilevel-index-0.1.0.vsix
echo File size:
dir project-multilevel-index-0.1.0.vsix | findstr vsix
echo.

echo [2/4] Installing extension...
code --install-extension project-multilevel-index-0.1.0.vsix
echo.

echo [3/4] Checking installation...
timeout /t 2 /nobreak > nul
code --list-extensions | findstr -i "project-multilevel-index"
if errorlevel 1 (
    echo [WARNING] Extension not found in list
    echo Trying alternative check...
    dir "%USERPROFILE%\.vscode\extensions" | findstr -i "project-multilevel-index"
) else (
    echo [SUCCESS] Extension installed!
)
echo.

echo [4/4] Next steps:
echo 1. Close and restart VSCode completely
echo 2. Open VSCode
echo 3. Open a folder (File -^> Open Folder)
echo 4. Press Ctrl+Shift+X to open Extensions
echo 5. Search for "Project Multilevel Index"
echo.
echo Or test commands:
echo 1. Press Ctrl+Shift+P
echo 2. Type: Project Index
echo 3. You should see 4 commands
echo.
pause
