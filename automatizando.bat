@echo off
set /p msg=Digite a mensagem do commit: 

git add .
git commit -m "%msg%"
git push

pause