@echo off
title Domino 101 Analizator
echo ====================================================
echo      Domino 101 Analizatoruna Xos Gelmisiniz!
echo ====================================================
echo.
echo Mobil telefon formatinda acilir...
echo (Eger genis acilarsa, pencerenin kenarindan tutub daraldin)
echo.
start msedge.exe --app="file:///%~dp0index.html" --window-size=390,844
if errorlevel 1 (
    start chrome.exe --app="file:///%~dp0index.html" --window-size=390,844
)
exit
