# Stickman Soma

我的个人主页，用 React、React Router 和 Tailwind CSS 搭建。站点目前包含漫画日常、社交入口，以及一个用于展示近期个人作品的 My Tools 页面。

## 最近更新

- 新增 `My Tools` 工具总览页面。
- 收录最近制作的时钟插件，用于展示桌面时间与专注提醒方向的小工具。
- 收录微信点单小程序，面向家庭点菜、采购确认和远程订单同步场景。
- 首页第三块“我的工具”现在会进入工具总览，而不是直接进入点单页面。

## 页面

- `/`：首页三栏入口。
- `/tools`：工具总览，展示时钟插件和微信点单小程序。
- `/order-menu`：家庭点菜小助手，可按食材和标签筛选菜品。
- `/social`：社交动态页，优先读取自动同步的 GitHub 与 Bilibili 公开动态。

## 社交动态同步

`scripts/sync-social-feed.js` 会抓取 GitHub public events 和 Bilibili 公开图文动态，生成 `public/social-feed.json`。页面加载时优先使用这份数据，抓取失败或文件为空时回退到本地静态内容。

GitHub Actions 的 `Sync social feed` workflow 每小时运行一次，并重新构建部署到 `gh-pages`。也可以手动运行：

```bash
npm run sync:social
```

## 技术栈

- React
- React Router
- Tailwind CSS
- Create React App 自定义脚本

## 脚本

```bash
npm start
npm run sync:social
npm run build
npm test
npm run deploy
```

`npm run deploy` 会部署到 `gh-pages`，使用前需要确认 `homepage` 等发布配置。
