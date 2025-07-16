# Stick Soma - 个人主页

一个使用 React 和 Tailwind CSS 构建的现代化个人主页项目。

## 项目特色

- 🎨 **现代化设计**: 使用 Tailwind CSS 构建的响应式设计
- 🌐 **双语支持**: 支持中文和英文语言切换
- 📱 **移动端友好**: 完全响应式设计，适配各种设备
- ⚡ **高性能**: 基于 React 构建，快速加载
- 🎯 **SEO 友好**: 优化的元数据和结构

## 主要功能

### 导航栏
- 品牌 Logo 和名称
- 响应式导航菜单
- 语言切换功能
- 移动端汉堡菜单

### 页面内容
- **首页**: 欢迎页面和简介
- **开发者**: 技术栈和开发技能展示
- **创作者**: 创作领域和项目介绍
- **画廊**: 作品展示和作品集
- **联系**: 联系方式和联系表单

### 页脚
- 品牌信息
- 版权信息
- 社交媒体链接

## 技术栈

- **前端框架**: React 18
- **样式框架**: Tailwind CSS
- **路由**: React Router
- **图标**: SVG 图标
- **构建工具**: Create React App

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Navbar/         # 导航栏组件
│   ├── Hero/           # 首页英雄区域
│   ├── Developer/      # 开发者页面
│   ├── Creator/        # 创作者页面
│   ├── Gallery/        # 画廊页面
│   ├── Contact/        # 联系页面
│   ├── Footer/         # 页脚组件
│   └── LanguageSwitch/ # 语言切换组件
├── locales/            # 国际化文件
│   ├── zh.js          # 中文翻译
│   └── en.js          # 英文翻译
├── App.js             # 主应用组件
└── App.css            # 全局样式
```

## 安装和运行

1. 克隆项目
```bash
git clone <repository-url>
cd soma-comic
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm start
```

4. 构建生产版本
```bash
npm run build
```

## 自定义配置

### 修改品牌信息
- 更新 `src/components/Navbar/Navbar.js` 中的品牌名称
- 更新 `src/components/Footer/Footer.js` 中的版权信息
- 更新 `public/index.html` 中的页面标题

### 修改内容
- 更新 `src/locales/zh.js` 和 `src/locales/en.js` 中的文本内容
- 修改各个页面组件中的具体内容

### 修改样式
- 更新 `tailwind.config.js` 中的主题配置
- 修改 `src/App.css` 中的全局样式

## 部署

项目可以部署到任何支持静态网站的托管服务：

- **Vercel**: 推荐，支持自动部署
- **Netlify**: 支持自动部署和表单处理
- **GitHub Pages**: 免费托管
- **AWS S3**: 企业级解决方案

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License
