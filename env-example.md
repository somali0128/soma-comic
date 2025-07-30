# 环境变量配置示例

## 开发环境 (.env.development)

```bash
# API配置
REACT_APP_API_URL=http://localhost:5000/api

# EmailJS配置（可选）
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

## 生产环境 (.env.production)

```bash
# API配置 - 替换为你的 Vercel 部署 URL
REACT_APP_API_URL=https://your-api-domain.vercel.app/api
# 或者使用自定义域名
# REACT_APP_API_URL=https://api.yourdomain.com/api

# EmailJS配置（可选）
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

## Vercel 环境变量

在 Vercel 控制台的项目设置中添加：

```bash
ASPNETCORE_ENVIRONMENT=Production
```

## 部署后的配置步骤

1. **获取 API URL**
   - 部署成功后，复制 Vercel 提供的 URL
   - 例如：`https://messageboard-api-xxxxx.vercel.app`

2. **更新前端环境变量**
   - 创建 `.env.production` 文件
   - 设置 `REACT_APP_API_URL=https://your-api-url/api`

3. **重新部署前端**
   ```bash
   npm run build
   # 或者如果使用 Vercel 部署前端
   vercel --prod
   ```

## 测试配置

### 1. 测试 API 连接

在浏览器控制台中运行：
```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
```

### 2. 测试 API 端点

```bash
# 获取留言列表
curl https://your-api-url/api/messages

# 创建留言
curl -X POST https://your-api-url/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

### 3. 访问 Swagger 文档

```
https://your-api-url/swagger
```

## 常见问题

### 1. 环境变量不生效
- 确保变量名以 `REACT_APP_` 开头
- 重启开发服务器
- 检查文件路径是否正确

### 2. CORS 错误
- 确保 API URL 正确
- 检查后端 CORS 配置
- 验证域名是否在允许列表中

### 3. API 连接失败
- 检查 API URL 是否可访问
- 验证 Vercel 部署状态
- 查看 Vercel 函数日志 