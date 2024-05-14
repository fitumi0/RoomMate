@echo off
cd backend
cls
@echo Starting server ...
call nodemon server.js
cd ../frontend
@echo Starting client ...
call ng serve

