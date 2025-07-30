# Vercel 部署指南

## 概述

本指南将帮助你将 MessageBoardAPI (.NET Core) 部署到 Vercel 平台，并设置自定义域名。

## 准备工作

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

## 部署步骤

### 方法一：使用 Vercel CLI 部署

1. **进入后端项目目录**
```bash
cd MessageBoardAPI
```

2. **初始化 Vercel 项目**
```bash
vercel
```

3. **按照提示配置项目**
   - 项目名称：`messageboard-api` (或你喜欢的名称)
   - 是否覆盖设置：选择 `N`
   - 部署到现有项目：选择 `N`

4. **部署项目**
```bash
vercel --prod
```

### 方法二：通过 GitHub 集成部署

1. **推送代码到 GitHub**
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

2. **在 Vercel 控制台导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 配置项目设置

## 配置说明

### 1. vercel.json 配置

```json
{
  "version": 2,
  "builds": [
    {
      "src": "MessageBoardAPI.csproj",
      "use": "@vercel/dotnet"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "ASPNETCORE_ENVIRONMENT": "Production"
  }
}
```

### 2. CORS 配置

已在 `Program.cs` 中配置了支持 Vercel 域名的 CORS 设置：

```csharp
builder.WithOrigins(
    "http://localhost:3000", 
    "https://localhost:3000",
    "https://soma-comic.vercel.app",
    "https://stick-soma.vercel.app",
    "https://*.vercel.app"
)
```

## 域名设置

### 1. 获取部署 URL

部署成功后，你会获得一个 Vercel 提供的 URL，类似：
- `https://messageboard-api-xxxxx.vercel.app`

### 2. 设置自定义域名

#### 步骤 1：在 Vercel 控制台添加域名

1. 访问 [vercel.com/dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击 "Settings" → "Domains"
4. 点击 "Add Domain"
5. 输入你的域名（例如：`api.yourdomain.com`）

#### 步骤 2：配置 DNS 记录

在你的域名提供商处添加以下 DNS 记录：

**类型 A 记录：**
```
名称: api (或你想要的子域名)
值: 76.76.19.19
```

**类型 CNAME 记录：**
```
名称: api (或你想要的子域名)
值: cname.vercel-dns.com
```

#### 步骤 3：验证域名

1. 等待 DNS 传播（通常需要几分钟到几小时）
2. 在 Vercel 控制台验证域名状态
3. 域名状态变为 "Valid" 后即可使用

### 3. 更新前端配置

部署成功后，更新前端的 API 地址：

#### 开发环境 (.env.development)
```bash
REACT_APP_API_URL=https://your-api-domain.com/api
```

#### 生产环境 (.env.production)
```bash
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 环境变量配置

### 在 Vercel 控制台设置环境变量

1. 访问项目设置
2. 点击 "Environment Variables"
3. 添加以下变量：

```
ASPNETCORE_ENVIRONMENT=Production
```

## 测试部署

### 1. 测试 API 端点

```bash
# 获取留言列表
curl https://your-api-domain.com/api/messages

# 创建新留言
curl -X POST https://your-api-domain.com/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello World"}'
```

### 2. 访问 Swagger 文档

```
https://your-api-domain.com/swagger
```

## 常见问题

### 1. 构建失败

**问题：** .NET Core 项目构建失败
**解决方案：**
- 确保 `vercel.json` 配置正确
- 检查项目文件路径
- 确保所有依赖包都已安装

### 2. CORS 错误

**问题：** 前端无法访问 API
**解决方案：**
- 检查 CORS 配置中的域名是否正确
- 确保前端域名在允许列表中

### 3. 数据库问题

**问题：** SQLite 数据库无法创建
**解决方案：**
- Vercel 是无服务器平台，不支持持久化文件存储
- 考虑迁移到支持数据库的服务（如 PlanetScale、Supabase 等）

## 推荐的数据库解决方案

由于 Vercel 是无服务器平台，建议使用以下数据库服务：

### 1. PlanetScale (MySQL)
```bash
# 安装 PlanetScale CLI
npm install -g pscale

# 创建数据库
pscale database create messageboard
```

### 2. Supabase (PostgreSQL)
- 访问 [supabase.com](https://supabase.com)
- 创建新项目
- 获取连接字符串

### 3. MongoDB Atlas
- 访问 [mongodb.com/atlas](https://mongodb.com/atlas)
- 创建免费集群
- 获取连接字符串

## 监控和日志

### 1. 查看部署日志

```bash
vercel logs
```

### 2. 查看实时日志

```bash
vercel logs --follow
```

### 3. 在 Vercel 控制台查看

- 访问项目仪表板
- 点击 "Functions" 查看函数日志

## 更新部署

### 1. 重新部署

```bash
vercel --prod
```

### 2. 回滚部署

在 Vercel 控制台：
1. 点击 "Deployments"
2. 选择要回滚的版本
3. 点击 "Promote to Production"

## 成本估算

Vercel 免费计划包括：
- 每月 100GB 带宽
- 每月 100GB 存储
- 每月 6000 次函数调用

对于小型项目，免费计划通常足够使用。

## 下一步

1. 部署成功后，更新前端的环境变量
2. 测试所有 API 端点
3. 配置监控和告警
4. 设置自动部署（可选） 