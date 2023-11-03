@echo off

# wt -p "Command Prompt" python.exe .\video_service\src\server.py ; split-pane peerjs --port 3001
start python.exe .\video_service\src\server.py 
start peerjs --port 3001
