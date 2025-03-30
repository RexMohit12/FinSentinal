@echo off
echo ===== Financial Fraud Detection System Launcher =====
echo.

:menu
echo Choose an option:
echo 1. Start Backend Server
echo 2. Run Test API
echo 3. Exit
echo.

set /p choice=Enter your choice (1-3): 

if "%choice%"=="1" goto start_backend
if "%choice%"=="2" goto run_test
if "%choice%"=="3" goto end

echo Invalid choice. Please try again.
echo.
goto menu

:start_backend
echo.
echo Starting the backend server with the correct Python executable...
start "Backend Server" C:\Users\mohit\AppData\Local\Programs\Python\Python312\python.exe D:\Projects\HackNUthon6\backend\main.py
echo Backend server started in a new window.
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:run_test
echo.
echo Running test_api.py with the correct Python executable...
C:\Users\mohit\AppData\Local\Programs\Python\Python312\python.exe D:\Projects\HackNUthon6\test_api.py
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:end
echo.
echo Exiting the launcher. Goodbye!