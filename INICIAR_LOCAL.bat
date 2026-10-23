@echo off
setlocal
cd /d "%~dp0"
title Pedro Gomes - Servidor local
where npm >nul 2>&1
if errorlevel 1 (
  echo O Node.js nao foi encontrado.
  echo Instale a versao LTS em https://nodejs.org/pt-br
  echo Depois feche esta janela e abra este arquivo novamente.
  pause
  exit /b 1
)
if not exist "node_modules\@fortawesome\free-brands-svg-icons\package.json" (
  echo Preparando o projeto. Aguarde...
  call npm ci
  if errorlevel 1 (
    echo Nao foi possivel instalar. Confira sua internet e tente novamente.
    pause
    exit /b 1
  )
)
echo O navegador sera aberto automaticamente.
echo Deixe esta janela aberta. Para encerrar, pressione Ctrl+C.
call npm run dev -- --open
if errorlevel 1 pause
endlocal
