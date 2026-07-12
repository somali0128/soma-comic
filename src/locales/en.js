const en = {
  brandName: 'Stickman Soma',
  nav: {
    home: 'Home',
    tools: 'My Tools',
    orderMenu: 'Order Menu',
    socialFeed: 'Social Feed',
  },
  placeholder: {
    comingSoon: 'This page is under construction. Check back soon.',
  },
  hero: {
    panels: {
      social: { title: 'Social Media' },
      tools: { title: 'My Tools' },
    },
  },
  home: {
    eyebrow: 'AI / Automation / Creative Tech',
    title: 'Soma Li',
    subtitle: 'AI Agent Builder in Halifax',
    primaryCta: 'Updates',
    nowTitle: 'Focus',
    nowItems: [
      {
        title: 'AI Agents',
        description: 'Local agent workflows and automation systems.',
      },
      {
        title: 'Automation',
        description: 'A personal home for updates, tools, and creative work.',
      },
      {
        title: 'Creative Tech',
        description: 'Engineering work shaped into memorable experiences.',
      },
    ],
    panels: {
      social: {
        title: 'Social Feed',
        description: 'GitHub, LinkedIn, and Bilibili updates.',
      },
      tools: {
        title: 'My Tools',
        description: 'Live clock widget, WeChat ordering mini program, and productivity tools.',
      },
    },
  },
  social: {
    locale: 'en',
    eyebrow: 'Social Hub',
    title: 'Public activity timeline',
    subtitle: 'A clean hub for engineering progress, career context, and content channels.',
    profileName: 'Soma Li',
    profileRole: 'Independent Developer / Applied AI Builder',
    filterLabel: 'Filter platform',
    openLink: 'Open link',
    platformLabels: {
      github: 'GitHub',
      linkedin: 'LinkedIn',
      bilibili: 'Bilibili',
      site: 'Site',
    },
    stats: [
      { label: 'Repos', value: '48' },
      { label: 'Stars', value: '17' },
      { label: 'Location', value: 'Halifax' },
    ],
    filters: [
      { id: 'all', label: 'All' },
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
        title: 'GitHub profile reframed around AI and creative technology',
        summary:
          'The profile highlights full stack development, applied AI, agentic systems, creative tech, SSCUP, soma-comic, and the AI Agent Stack.',
        href: 'https://github.com/somali0128',
        tags: ['Applied AI', 'React', 'Agentic Systems'],
      },
      {
        id: 'soma-comic',
        platform: 'github',
        date: 'Active',
        type: 'Project',
        title: 'soma-comic continues as a personal site and comic space',
        summary:
          'The site is evolving into a focused home for profile, social feed, and tool showcases.',
        href: 'https://github.com/somali0128/soma-comic',
        tags: ['Personal Site', 'Tailwind'],
      },
      {
        id: 'linkedin',
        platform: 'linkedin',
        date: 'Profile',
        type: 'Career',
        title: 'LinkedIn anchors career context and collaboration',
        summary:
          'A clear destination for hiring, partnerships, professional updates, AI automation work, and Canadian local context.',
        href: 'https://www.linkedin.com/in/dongyue-li-520bb2374/',
        tags: ['Career', 'Networking', 'Canada'],
      },
      {
        id: 'bilibili',
        platform: 'bilibili',
        date: 'Space',
        type: 'Content',
        title: 'Bilibili carries Chinese-language content and community activity',
        summary:
          'A channel for videos, posts, livestream-related updates, and creative work aimed at Chinese-speaking communities.',
        href: 'https://space.bilibili.com/290997685',
        tags: ['Video', 'Community', 'Chinese Content'],
      },
    ],
    rhythmTitle: 'Publishing rhythm',
    rhythm: [
      {
        platform: 'github',
        title: 'Engineering progress',
        description: 'Project updates, code, automation, and AI agent experiments.',
      },
      {
        platform: 'linkedin',
        title: 'Career narrative',
        description: 'Experience, direction, collaboration, and professional identity.',
      },
      {
        platform: 'bilibili',
        title: 'Creative content',
        description: 'Videos, posts, and community updates in Chinese.',
      },
    ],
    contactTitle: 'Collaboration',
    contactBody:
      'For projects, AI automation, creative content, or community work, LinkedIn is the clearest contact channel.',
    contactLinkLabel: 'LinkedIn',
  },
  footer: {
    copyright: 'All rights reserved.',
    madeWith: 'Made with care',
    quickLinks: 'Quick Links',
    media: 'Media',
  },
  toolsPage: {
    eyebrow: 'My Tools',
    title: 'My Tools',
    subtitle:
      'A small shelf for recent personal tools, including a livestream browser-source clock widget and an open-source mini program for answering "what should we eat?" at home.',
    statusLabel: 'Recent',
    items: {
      clock: {
        title: 'Clock Plugin',
        status: 'VTS / livestream browser-source widget',
        description:
          'A lightweight clock widget built for VTube Studio and livestream scenes. It can be inserted into OBS or similar streaming software as a browser source to add a clear time overlay to the stream.',
        details: ['Designed for livestream overlays', 'Works as a browser source widget', 'Open source and easy to restyle or resize'],
        linkLabel: 'View clock-widget-qiu repo',
      },
      orderMenu: {
        title: 'WeChat Ordering Mini Program',
        status: 'Open-source family menu reference',
        description:
          'An open-source WeChat mini program reference project for helping families decide what to eat. It turns meal discussion into a simple ordering flow and can be used as a practical example for mini program development.',
        details: ['Built around family meal decisions', 'Menu categories, dish details, and grocery confirmation flow', 'Open-source code for WeChat mini program reference'],
        linkLabel: 'View wechat-order-menu repo',
      },
    },
  },
};

export default en;
