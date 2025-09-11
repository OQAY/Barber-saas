@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "(New-Object Media.SoundPlayer '%1').PlaySync()"