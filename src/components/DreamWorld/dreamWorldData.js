export const dreamWorldFoundation = {
  id: 'soma-dream-world',
  version: 1,
  startScene: 'threshold-meadow',
  scenes: [
    {
      id: 'threshold-meadow',
      status: 'planned',
      npcIds: ['gatekeeper'],
      fragmentIds: ['first-light'],
    },
  ],
  npcs: [
    {
      id: 'gatekeeper',
      sceneId: 'threshold-meadow',
      dialogueId: 'gatekeeper-intro',
    },
  ],
  fragments: [
    {
      id: 'first-light',
      sceneId: 'threshold-meadow',
      status: 'hidden',
    },
  ],
};

export const dreamWorldCopy = {
  zh: {
    eyebrow: '一个正在成形的梦境入口',
    title: '梦境世界',
    intro: '我把仍然记得的梦收集起来，尝试拼成一个可以行走、交谈与发现的完整世界。',
    notice: '世界生成中',
    noticeBody: '第一张地图、访客角色与 NPC 对话系统将在下一阶段开始制作。',
    sceneLabel: '起点草地 · 概念预览',
    playerLabel: '访客',
    npcLabel: '守门人',
    dialogue: '“有些梦醒来就消失了，有些梦一直在等待被找到。”',
    plannedTitle: '第一阶段',
    plannedItems: ['在像素地图中行走', '与 NPC 交谈', '收集梦境碎片', '从出口返回现实'],
    archiveTitle: '梦境档案',
    archiveBody: '地图、人物、梦境碎片与对话将使用独立数据文件管理，方便这个世界持续生长。',
    back: '返回工具箱',
    enterLater: '入口暂未开放',
  },
  en: {
    eyebrow: 'A dream passage taking shape',
    title: 'Dream World',
    intro: 'I am collecting the dreams I still remember and piecing them into one world you can walk through, talk within, and discover.',
    notice: 'World generation in progress',
    noticeBody: 'The first map, visitor avatar, and NPC dialogue system will enter production in the next phase.',
    sceneLabel: 'Threshold Meadow · concept preview',
    playerLabel: 'Visitor',
    npcLabel: 'Gatekeeper',
    dialogue: '“Some dreams vanish when we wake. Others keep waiting to be found.”',
    plannedTitle: 'First milestone',
    plannedItems: ['Walk through a pixel map', 'Talk with NPCs', 'Collect dream fragments', 'Find the exit back to reality'],
    archiveTitle: 'Dream archive',
    archiveBody: 'Maps, characters, fragments, and dialogue will live in separate data files so this world can keep growing.',
    back: 'Back to tools',
    enterLater: 'Passage not open yet',
  },
};
