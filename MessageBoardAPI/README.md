# Message Board API

这是一个基于ASP.NET Core的留言板API，采用MVC架构模式。

## 功能特性

- 获取所有留言
- 创建新留言
- 获取单个留言
- 删除留言
- 支持CORS跨域请求
- 使用Entity Framework Core进行数据访问
- 自动创建SQLite数据库

## 技术栈

- ASP.NET Core 8.0
- Entity Framework Core
- SQLite数据库
- Swagger/OpenAPI

## 项目结构

```
MessageBoardAPI/
├── Controllers/          # 控制器层 (MVC中的Controller)
│   └── MessagesController.cs
├── Models/              # 模型层 (MVC中的Model)
│   └── Message.cs
├── DTOs/                # 数据传输对象
│   └── MessageDto.cs
├── Data/                # 数据访问层
│   └── MessageBoardContext.cs
├── Program.cs           # 应用程序入口
├── appsettings.json     # 配置文件
└── MessageBoardAPI.csproj
```

## 安装和运行

### 前置要求

- .NET 8.0 SDK

### 运行步骤

1. 进入项目目录：
   ```bash
   cd MessageBoardAPI
   ```

2. 还原NuGet包：
   ```bash
   dotnet restore
   ```

3. 运行应用程序：
   ```bash
   dotnet run
   ```

4. 访问Swagger UI：
   ```
   https://localhost:7001/swagger
   ```

## API端点

- `GET /api/messages` - 获取所有留言
- `GET /api/messages/{id}` - 获取指定留言
- `POST /api/messages` - 创建新留言
- `DELETE /api/messages/{id}` - 删除指定留言

## 数据库

应用程序会自动创建SQLite数据库文件 `MessageBoard.db`，位于项目根目录。

## 与前端集成

API已配置CORS，允许来自 `http://localhost:3000` 和 `https://localhost:3000` 的请求。

前端React应用可以通过以下URL访问API：
```
http://localhost:5000/api/messages
``` 