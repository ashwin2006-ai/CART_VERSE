@echo off
REM CartVerse Backend Run Script for Windows

echo 🚀 Starting CartVerse Backend...

REM Check if venv exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate venv
call venv\Scripts\activate

REM Install requirements
echo 📦 Installing dependencies...
pip install -r requirements.txt

REM Run server
echo 🎯 Starting FastAPI server on http://localhost:8000
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
