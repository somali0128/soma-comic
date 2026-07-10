const zh = {
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
    eyebrow: 'AI / Automation / Creative Tech',
    title: 'Soma Li',
    subtitle: 'AI Agent Builder in Halifax',
    primaryCta: '动态',
    nowTitle: 'Focus',
    nowItems: [
      {
        title: 'AI Agents',
        description: '本地智能体工作流与自动化系统。',
      },
      {
        title: 'Automation',
        description: '个人主页、社交动态和创作展示。',
      },
      {
        title: 'Creative Tech',
        description: '把工程能力做成清晰、有记忆点的体验。',
      },
    ],
    panels: {
      social: {
        title: '社交动态',
        description: 'GitHub、LinkedIn、B 站公开更新。',
      },
      tools: {
        title: '我的工具',
        description: '直播时钟挂件、微信点单小程序和效率工具。',
      },
    },
  },
  social: {
    locale: 'zh',
    eyebrow: 'Social Hub',
    title: '公开动态时间线',
    subtitle: '工程进展、职业资料和内容频道，统一放在一个简洁入口里。',
    profileRole: 'Independent Developer / Applied AI Builder',
    filterLabel: '筛选平台',
    openLink: '打开链接',
    stats: [
      { label: 'Repos', value: '48' },
      { label: 'Stars', value: '17' },
      { label: 'Location', value: 'Halifax' },
    ],
    filters: [
      { id: 'all', label: '全部' },
      { id: 'github', label: 'GitHub' },
      { id: 'linkedin', label: 'LinkedIn' },
      { id: 'bilibili', label: 'Bilibili' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/somali0128' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dongyue-li-520bb2374/' },
      { label: 'Bilibili', href: 'https://space.bilibili.com/290997685' },
    ],
    items: [
      {
        id: 'github-profile',
        platform: 'github',
        date: '2026-06',
        type: 'Profile',
        title: 'GitHub 主页升级为 AI 与创作双线展示',
        summary:
          '个人简介聚焦 Full Stack、Applied AI、Agentic Systems、Creative Tech，并展示 SSCUP、soma-comic 和 AI Agent Stack 等项目。',
        href: 'https://github.com/somali0128',
        tags: ['Applied AI', 'React', 'Agentic Systems'],
      },
      {
        id: 'soma-comic',
        platform: 'github',
        date: 'Active',
        type: 'Project',
        title: 'soma-comic 作为个人站与漫画创作空间继续迭代',
        summary: '站点正在升级为个人主页、社交动态和工具展示的组合体验。',
        href: 'https://github.com/somali0128/soma-comic',
        tags: ['Personal Site', 'Tailwind'],
      },
      {
        id: 'linkedin',
        platform: 'linkedin',
        date: 'Profile',
        type: 'Career',
        title: 'LinkedIn 作为职业履历与合作入口',
        summary:
          '面向招聘、合作和专业交流，突出工程能力、AI 自动化方向和加拿大本地背景。',
        href: 'https://www.linkedin.com/in/dongyue-li-520bb2374/',
        tags: ['Career', 'Networking', 'Canada'],
      },
      {
        id: 'bilibili',
        platform: 'bilibili',
        date: 'Space',
        type: 'Content',
        title: 'B 站空间承载中文内容与社区互动',
        summary: '适合展示视频、动态和面向中文社区的创作活动。',
        href: 'https://space.bilibili.com/290997685',
        tags: ['Video', 'Community', '中文内容'],
      },
    ],
    rhythmTitle: '内容节奏',
    rhythm: [
      {
        platform: 'github',
        title: '工程进展',
        description: '项目更新、代码作品、自动化和 AI agent 实验。',
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
    contactBody: '如果想聊项目、AI 自动化、内容创作或社区合作，LinkedIn 是最清晰的联系入口。',
  },
  footer: {
    copyright: '保留所有权利。',
    madeWith: '用热爱制作',
    quickLinks: '快速链接',
    media: '媒体',
  },
  toolsPage: {
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
