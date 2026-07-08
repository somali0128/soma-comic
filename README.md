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
- `/comics`：漫画日常占位页。
- `/social`：社交动态占位页。

## 技术栈

- React
- React Router
- Tailwind CSS
- Create React App 自定义脚本

## 脚本

```bash
npm start
npm run build
npm test
npm run deploy
```

`npm run deploy` 会部署到 `gh-pages`，使用前需要确认 `homepage` 等发布配置。
