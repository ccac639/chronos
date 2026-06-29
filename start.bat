@echo off
chcp 65001 >nul
title 风尘录 Chronos - 一键启动
echo.
echo  ===================================================
echo    风尘录 Chronos - 一键启动
echo  ===================================================
echo.

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [错误] 未检测到 Node.js，请先安装 Node.js 18+
    echo  下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo  [检测] Node.js 已安装:
node -v
echo.

:: 安装依赖
echo  [1/2] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo  [错误] 依赖安装失败，请检查网络连接
    pause
    exit /b 1
)
echo  [完成] 依赖安装成功
echo.

:: 启动服务器
echo  [2/2] 启动开发服务器...
echo.
echo  启动成功后，请在浏览器中打开:
echo  http://localhost:3000
echo.
echo  按 Ctrl+C 停止服务器
echo  ===================================================
echo.

call npx next dev -p 3000

:: 服务器意外退出时暂停，方便查看错误
echo.
echo  [提示] 服务器已停止
pause
