const zh = {
  brandName: '樾哥Soma',
  nav: {
    home: '首页',
    tools: '我的工具',
    orderMenu: '我要点菜',
    socialFeed: '社交动态',
  },
  placeholder: {
    comingSoon: '页面建设中，敬请期待。',
  },
  hero: {
    panels: {
      social: { title: '社交媒体' },
      tools: { title: '我的工具' },
    },
  },
  home: {
    eyebrow: 'AI / 自动化工具 / UP主',
    title: '樾哥Soma',
    subtitle: '在哈利法克斯折腾 AI 智能体、自动化工具和内容创作',
    primaryCta: '动态',
    nowTitle: '最近在做',
    nowItems: [
      {
        title: 'AI 智能体',
        description: '本地智能体工作流、自动化系统和实用工具。',
      },
      {
        title: '自动化工具',
        description: '个人主页、社交动态同步和效率工具。',
      },
      {
        title: 'UP主内容',
        description: 'B 站动态、活动记录和中文社区内容。',
      },
    ],
    panels: {
      social: {
        title: '社交动态',
        description: 'GitHub、领英、B 站公开更新。',
      },
      tools: {
        title: '我的工具',
        description: '直播时钟挂件、微信点单小程序和效率工具。',
      },
    },
  },
  social: {
    locale: 'zh',
    eyebrow: '社交动态中心',
    title: '公开动态时间线',
    subtitle: '工程进展、职业资料和内容频道，统一放在一个简洁入口里。',
    profileName: '樾哥Soma',
    profileRole: '独立开发者 / AI 应用构建者 / UP主',
    filterLabel: '筛选平台',
    openLink: '打开链接',
    platformLabels: {
      github: 'GitHub',
      linkedin: '领英',
      bilibili: 'B站',
      site: '网站',
    },
    stats: [
      { label: '仓库', value: '48' },
      { label: '星标', value: '17' },
      { label: '所在地', value: '哈利法克斯' },
    ],
    filters: [
      { id: 'all', label: '全部' },
      { id: 'github', label: 'GitHub' },
      { id: 'linkedin', label: '领英' },
      { id: 'bilibili', label: 'B站' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/somali0128' },
      { label: '领英', href: 'https://www.linkedin.com/in/dongyue-li-520bb2374/' },
      { label: 'B站', href: 'https://space.bilibili.com/290997685' },
    ],
    items: [
      {
        id: 'github-profile',
        platform: 'github',
        date: '2026-06',
        type: '资料',
        title: 'GitHub 主页升级为 AI 与创作双线展示',
        summary:
          '个人简介聚焦全栈开发、AI 应用、智能体系统和创作工具，并展示 SSCUP、soma-comic 和 AI Agent Stack 等项目。',
        href: 'https://github.com/somali0128',
        tags: ['AI 应用', 'React', '智能体系统'],
      },
      {
        id: 'soma-comic',
        platform: 'github',
        date: '进行中',
        type: '项目',
        title: 'soma-comic 作为个人站与漫画创作空间继续迭代',
        summary: '站点正在升级为个人主页、社交动态和工具展示的组合体验。',
        href: 'https://github.com/somali0128/soma-comic',
        tags: ['个人主页', 'Tailwind'],
      },
      {
        id: 'linkedin',
        platform: 'linkedin',
        date: '资料',
        type: '职业',
        title: '领英作为职业履历与合作入口',
        summary:
          '面向招聘、合作和专业交流，突出工程能力、AI 自动化方向和加拿大本地背景。',
        href: 'https://www.linkedin.com/in/dongyue-li-520bb2374/',
        tags: ['职业履历', '合作交流', '加拿大'],
      },
      {
        id: 'bilibili',
        platform: 'bilibili',
        date: '空间',
        type: '内容',
        title: 'B 站空间承载中文内容与社区互动',
        summary: '适合展示视频、动态和面向中文社区的创作活动。',
        href: 'https://space.bilibili.com/290997685',
        tags: ['视频', '社区', '中文内容'],
      },
    ],
    rhythmTitle: '内容节奏',
    rhythm: [
      {
        platform: 'github',
        title: '工程进展',
        description: '项目更新、代码作品、自动化和 AI 智能体实验。',
      },
      {
        platform: 'linkedin',
        title: '职业叙事',
        description: '经验、方向、合作机会和专业身份沉淀。',
      },
      {
        platform: 'bilibili',
        title: '内容创作',
        description: '视频、动态和中文社区互动。',
      },
    ],
    contactTitle: '合作入口',
    contactBody: '如果想聊项目、AI 自动化、内容创作或社区合作，领英是最清晰的联系入口。',
    contactLinkLabel: '领英',
  },
  footer: {
    copyright: '保留所有权利。',
    madeWith: '用热爱制作',
    quickLinks: '快速链接',
    media: '媒体',
  },
  toolsPage: {
    eyebrow: '我的工具',
    title: '我的工具',
    subtitle:
      '这里收集最近做的小工具和生活向项目，包括直播可用的浏览器源挂件，以及帮助家庭解决“吃什么”的开源小程序。',
    statusLabel: '最近制作',
    items: {
      clock: {
        title: '时钟插件',
        status: 'VTS / 直播浏览器源挂件',
        description:
          '一个面向 VTube Studio 与直播场景的时钟浏览器源挂件，可以作为 OBS / 直播软件中的 Browser Source 插入画面，给直播间叠加清晰、轻量的时间展示。',
        details: ['适合作为直播画面挂件', '通过浏览器源方式插入使用', '开源仓库便于自定义样式和尺寸'],
        linkLabel: '查看 clock-widget-qiu 仓库',
      },
      orderMenu: {
        title: '微信点单小程序',
        status: '开源家庭点菜参考项目',
        description:
          '一个开源的微信小程序参考项目，围绕家庭之间每天最常见的“吃什么”问题设计，让家人可以用点单的方式讨论菜品、确认选择，并作为二次开发的参考样例。',
        details: ['面向家庭点菜决策场景', '菜单分类、菜品信息和采购确认流程', '代码开源，适合作为微信小程序开发参考'],
        linkLabel: '查看 wechat-order-menu 仓库',
      },
    },
  },
};

export default zh;
