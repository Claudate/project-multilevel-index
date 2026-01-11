#!/bin/bash

echo "========================================"
echo "VSCode Extension Installation Script"
echo "========================================"
echo

# Check if .vsix file exists
if [ ! -f "project-multilevel-index-0.1.0.vsix" ]; then
    echo "[ERROR] .vsix file not found!"
    echo "Please run this script from the vscode-extension directory"
    exit 1
fi

echo "[1/4] Found .vsix file: project-multilevel-index-0.1.0.vsix"
ls -lh project-multilevel-index-0.1.0.vsix
echo

echo "[2/4] Installing extension..."
code --install-extension project-multilevel-index-0.1.0.vsix
echo

echo "[3/4] Checking installation..."
sleep 2
if code --list-extensions | grep -i "project-multilevel-index"; then
    echo "[SUCCESS] Extension installed!"
else
    echo "[WARNING] Extension not found in list"
    echo "Checking extensions directory..."
    ls ~/.vscode/extensions | grep -i "project-multilevel-index"
fi
echo

echo "[4/4] Next steps:"
echo "1. Close and restart VSCode completely"
echo "2. Open VSCode"
echo "3. Open a folder (File -> Open Folder)"
echo "4. Press Ctrl+Shift+X to open Extensions"
echo "5. Search for 'Project Multilevel Index'"
echo
echo "Or test commands:"
echo "1. Press Ctrl+Shift+P"
echo "2. Type: Project Index"
echo "3. You should see 4 commands"
echo

read -p "Press Enter to continue..."
