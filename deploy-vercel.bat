@echo off
echo ========================================
echo Vercel 部署脚本
echo ========================================
echo.

echo 检查 Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在安装 Vercel CLI...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo 错误: 无法安装 Vercel CLI
        pause
        exit /b 1
    )
)

echo Vercel CLI 已安装
echo.

echo 检查登录状态...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 请先登录 Vercel...
    vercel login
    if %errorlevel% neq 0 (
        echo 错误: 登录失败
        pause
        exit /b 1
    )
)

echo 已登录 Vercel
echo.

echo 进入后端项目目录...
cd MessageBoardAPI
if %errorlevel% neq 0 (
    echo 错误: 无法进入 MessageBoardAPI 目录
    pause
    exit /b 1
)

echo 开始部署到 Vercel...
echo.
echo 提示:
echo - 项目名称建议使用: messageboard-api
echo - 是否覆盖设置选择: N
echo - 部署到现有项目选择: N
echo.

vercel

echo.
echo 部署完成！
echo.
echo 下一步:
echo 1. 复制部署 URL
echo 2. 更新前端环境变量
echo 3. 测试 API 端点
echo.
pause 