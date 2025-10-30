#!/bin/bash

echo "🚀 Starting MGNREGA Dashboard Application..."
echo ""

# Check if backend is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Backend server is already running on port 3001"
else
    echo "📦 Starting Backend Server..."
    cd backend
    node server.js &
    BACKEND_PID=$!
    echo "✅ Backend started with PID: $BACKEND_PID"
    cd ..
fi

# Wait a bit for backend to initialize
sleep 2

# Check if frontend is already running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Frontend server is already running on port 5173"
else
    echo "🎨 Starting Frontend Server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend started with PID: $FRONTEND_PID"
    cd ..
fi

echo ""
echo "✨ Application is starting!"
echo "📊 Backend:  http://localhost:3001"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
wait
