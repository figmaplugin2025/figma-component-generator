@echo off
echo Setting up Git version control for your plugin...

REM Initialize Git repository
git init

REM Add all files to Git
git add .

REM Create initial commit
git commit -m "Initial plugin setup with versioning system"

REM Create development branch
git checkout -b development

REM Create feature branch for future work
git checkout -b feature/component-generation

echo.
echo Git setup complete!
echo.
echo Current branches:
git branch
echo.
echo To switch branches: git checkout <branch-name>
echo To create new branch: git checkout -b <branch-name>
echo To view history: git log --oneline
echo To revert changes: git reset --hard HEAD
echo.
pause 