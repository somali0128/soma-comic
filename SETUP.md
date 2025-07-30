# 留言板功能设置说明

## 项目概述

本项目包含一个React前端应用和一个ASP.NET Core后端API，实现了完整的留言板功能。

## 项目结构

```
soma-comic/
├── src/                    # React前端应用
│   ├── components/
│   │   └── MessageBoard/   # 留言板组件
│   ├── locales/            # 多语言支持
│   └── App.js             # 主应用文件
├── MessageBoardAPI/        # ASP.NET Core后端API
│   ├── Controllers/        # 控制器层
│   ├── Models/            # 模型层
│   ├── Data/              # 数据访问层
│   └── DTOs/              # 数据传输对象
└── start-backend.bat      # 后端启动脚本
```

## 安装和运行

### 1. 安装 .NET 8.0 SDK

首先需要安装 .NET 8.0 SDK：

#### Windows 用户：
1. 访问：https://dotnet.microsoft.com/download/dotnet/8.0
2. 下载并安装 "SDK 8.0.x"
3. 验证安装：打开命令提示符，运行 `dotnet --version`

#### 或者使用包管理器：
```bash
# 使用 winget
winget install Microsoft.DotNet.SDK.8

# 或使用 Chocolatey
choco install dotnet-8.0-sdk
```

### 2. 启动后端API

#### 方法一：使用批处理文件
双击运行 `start-backend.bat` 文件

#### 方法二：手动启动
```bash
cd MessageBoardAPI
dotnet restore
dotnet run
```

后端API将在以下地址运行：
- API地址：http://localhost:5000
- Swagger文档：https://localhost:7001/swagger

### 3. 启动前端应用

```bash
npm start
```

前端应用将在 http://localhost:3000 运行

### 4. 配置环境变量

在项目根目录创建 `.env` 文件：
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 功能特性

### 前端功能
- ✅ 响应式设计，支持桌面和移动设备
- ✅ 多语言支持（中文/英文）
- ✅ 表单验证
- ✅ 实时留言显示
- ✅ 美观的UI设计

### 后端功能
- ✅ RESTful API设计
- ✅ MVC架构模式
- ✅ Entity Framework Core数据访问
- ✅ 自动创建SQLite数据库
- ✅ CORS跨域支持
- ✅ Swagger API文档

## API端点

- `GET /api/messages` - 获取所有留言
- `POST /api/messages` - 创建新留言
- `GET /api/messages/{id}` - 获取指定留言
- `DELETE /api/messages/{id}` - 删除指定留言

## 技术栈

### 前端
- React 19.0
- React Router DOM
- Tailwind CSS
- 响应式设计

### 后端
- ASP.NET Core 8.0
- Entity Framework Core
- SQLite数据库
- CORS支持

## 注意事项

1. 确保已安装 .NET 8.0 SDK
2. 后端API需要先启动，前端才能正常工作
3. 如果遇到CORS错误，请检查后端API是否正常运行
4. SQLite数据库文件会自动创建在项目根目录

## 故障排除

### 常见问题

1. **dotnet: command not found**
   - 安装 .NET 8.0 SDK
   - 重启命令提示符或PowerShell
   - 验证安装：`dotnet --version`

2. **API连接失败**
   - 检查后端API是否正在运行
   - 检查端口5000是否被占用
   - 检查防火墙设置

3. **CORS错误**
   - 确保后端API的CORS配置正确
   - 检查前端请求的URL是否正确 