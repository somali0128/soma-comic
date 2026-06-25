const en = {
  nav: {
    home: 'Home',
    orderMenu: 'My Tools',
    comicDiary: 'Comic Diary',
    socialFeed: 'Social Feed',
  },
  placeholder: {
    comingSoon: 'This page is under construction. Check back soon.',
  },
  hero: {
    panels: {
      comics: { title: 'Comic Diary' },
      social: { title: 'Social Media' },
      tools: { title: 'My Tools' },
    },
  },
  home: {
    eyebrow: 'Full Stack Developer / Applied AI / Creative Tech',
    title: "Soma Li's creative engineering home",
    subtitle:
      'I build AI agents, automation systems, and local LLM applications in Halifax while maintaining comics, community, and content projects.',
    primaryCta: 'View social feed',
    nowTitle: 'Now building',
    nowItems: [
      {
        title: 'AI Agent Stack',
        description: 'Refining local agent workflows with Ollama, OpenWebUI, n8n, and PostgreSQL.',
      },
      {
        title: 'soma-comic',
        description: 'Blending comics, personal expression, and interactive web experiences.',
      },
      {
        title: 'Community & VTuber',
        description: 'Creating content, streaming, and organizing communities around human technology.',
      },
    ],
    panels: {
      comics: {
        title: 'Comic Diary',
        description: 'Sketches, story fragments, and creative experiments.',
      },
      social: {
        title: 'Social Feed',
        description: 'A public hub for GitHub, LinkedIn, and Bilibili updates.',
      },
      tools: {
        title: 'My Tools',
        description: 'Automation, AI, and personal productivity experiments.',
      },
    },
  },
  social: {
    eyebrow: 'Social Hub',
    title: 'Public activity timeline',
    subtitle:
      "A single view of Soma Li's engineering progress, career profile, and creative content channels.",
    profileRole: 'Independent Developer / Applied AI Builder',
    filterLabel: 'Filter platform',
    openLink: 'Open link',
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
          'The site is evolving from a simple entry page into a richer home for profile, social feed, comic diary, and tool showcases.',
        href: 'https://github.com/somali0128/soma-comic',
        tags: ['Personal Site', 'Comics', 'Tailwind'],
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
        description: 'Videos, streams, comics, and community updates in Chinese.',
      },
    ],
    contactTitle: 'Collaboration',
    contactBody:
      'For projects, AI automation, creative content, or community work, LinkedIn is the clearest contact channel.',
  },
  footer: {
    copyright: 'All rights reserved.',
    madeWith: 'Made with care',
    quickLinks: 'Quick Links',
    media: 'Media',
  },
};

export default en;
