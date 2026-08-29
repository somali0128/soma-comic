# Stickman Soma

我的个人主页，用 React、React Router、Tailwind CSS 和 Phaser 搭建。站点目前包含漫画日常、社交入口、My Tools，以及可探索的 2D 像素梦境世界。

## 最近更新

- 新增 `My Tools` 工具总览页面。
- 收录最近制作的时钟插件，用于展示桌面时间与专注提醒方向的小工具。
- 收录微信点单小程序，面向家庭点菜、采购确认和远程订单同步场景。
- 首页第三块“我的工具”现在会进入工具总览，而不是直接进入点单页面。

## 页面

- `/`：首页三栏入口。
- `/tools`：工具总览，展示时钟插件和微信点单小程序。
- `/order-menu`：家庭点菜小助手，可按食材和标签筛选菜品。
- `/social`：旧入口，会跳转到工具总览。
- `/dream-world`：梦境世界，可移动、对话、收集梦境碎片并体验湖边钓鱼。

## 技术栈

- React 19
- React Router
- Tailwind CSS
- Phaser
- Vite 8
- Vitest 4

## 脚本

```bash
npm start
npm run build
npm test
npm run preview
```

本地开发默认运行在 `http://localhost:5173`。生产构建输出到 `build/`；`npm run preview` 可在本地检查生产构建。
