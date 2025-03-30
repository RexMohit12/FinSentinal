# PowerShell script to run the backend server
Write-Host "Starting the backend server with the correct Python executable..."
Start-Process -FilePath "C:\Users\mohit\AppData\Local\Programs\Python\Python312\python.exe" -ArgumentList "D:\Projects\HackNUthon6\backend\main.py" -NoNewWindow

Write-Host "Backend server started. Press Ctrl+C to stop."