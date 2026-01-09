@echo off
setlocal
cd /d "%~dp0"
echo Starting simple HTTP server at http://localhost:8000
echo Press Ctrl+C to stop.
python -c "import http.server, socketserver; socketserver.TCPServer.allow_reuse_address=True; http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=8000)"
