const fs = require('fs');
const path = require('path');

const GITHUB_USER = 'somali0128';
const BILIBILI_UID = '290997685';
const OUTPUT_FILE = path.resolve(__dirname, '../public/social-feed.json');
const MAX_ITEMS_PER_SOURCE = 6;
const MAX_TOTAL_ITEMS = 14;

const requestHeaders = {
  'User-Agent': 'Mozilla/5.0 (compatible; soma-comic-social-sync/1.0)',
  Accept: 'application/json',
};

const truncate = (text, maxLength = 140) => {
  if (!text) return '';
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength - 1)}...`
    : normalized;
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return localized('最新', 'Latest');
  return date.toISOString().slice(0, 10);
};

const toRepoUrl = (repoName) => `https://github.com/${repoName}`;

const localized = (zh, en) => ({ zh, en });

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...requestHeaders,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }

  const data = await response.json();
  if (data && typeof data.code === 'number' && data.code !== 0) {
    throw new Error(`API code ${data.code}: ${data.message || 'unknown error'}`);
  }

  return data;
}

function buildGitHubItem(event) {
  const repoName = event.repo?.name || `${GITHUB_USER}/unknown`;
  const repoShortName = repoName.split('/').pop();
  const createdAt = event.created_at;
  const baseItem = {
    id: `github-${event.id}`,
    platform: 'github',
    date: formatDate(createdAt),
    href: toRepoUrl(repoName),
    tags: localized(['GitHub', repoShortName], ['GitHub', repoShortName]),
    sortTime: new Date(createdAt).getTime(),
  };

  if (event.type === 'PushEvent') {
    const commits = event.payload?.commits || [];
    const commitCount = commits.length || event.payload?.size || 1;
    const firstMessage = commits[0]?.message;
    const branch = event.payload?.ref?.replace('refs/heads/', '') || 'main';
    return {
      ...baseItem,
      type: localized('推送', 'Push'),
      title: localized(
        `向 ${repoShortName} 推送了 ${commitCount} 个提交`,
        `Pushed ${commitCount} commit${commitCount > 1 ? 's' : ''} to ${repoShortName}`
      ),
      summary: localized(
        truncate(firstMessage || `更新了 ${repoName}。`),
        truncate(firstMessage || `Updated ${repoName}.`)
      ),
      href: event.payload?.head
        ? `${toRepoUrl(repoName)}/commit/${event.payload.head}`
        : baseItem.href,
      tags: localized(['GitHub', repoShortName, branch], ['GitHub', repoShortName, branch]),
    };
  }

  if (event.type === 'PullRequestEvent') {
    const action = event.payload?.action || 'updated';
    const actionZh = {
      opened: '打开',
      closed: '关闭',
      reopened: '重新打开',
      synchronize: '更新',
    }[action] || '更新';
    const number = event.payload?.number;
    const pullRequest = event.payload?.pull_request;
    return {
      ...baseItem,
      type: localized('拉取请求', 'Pull Request'),
      title: localized(
        `${actionZh}了 ${repoShortName} 的拉取请求${number ? ` #${number}` : ''}`,
        `${action} pull request${number ? ` #${number}` : ''} in ${repoShortName}`
      ),
      summary: localized(
        truncate(pullRequest?.title || `${repoName} 的拉取请求有新动态。`),
        truncate(pullRequest?.title || `Pull request ${action} in ${repoName}.`)
      ),
      href: pullRequest?.html_url || baseItem.href,
      tags: localized(['GitHub', repoShortName, '拉取请求'], ['GitHub', repoShortName, 'PR']),
    };
  }

  if (event.type === 'CreateEvent') {
    const refType = event.payload?.ref_type || 'item';
    const refTypeZh = {
      branch: '分支',
      repository: '仓库',
      tag: '标签',
    }[refType] || '项目';
    const ref = event.payload?.ref;
    return {
      ...baseItem,
      type: localized('创建', 'Create'),
      title: localized(
        `在 ${repoShortName} 创建了${refTypeZh}`,
        `Created ${refType} in ${repoShortName}`
      ),
      summary: localized(
        truncate(ref ? `${refTypeZh}：${ref}` : `在 ${repoName} 创建了新的${refTypeZh}。`),
        truncate(ref ? `${refType}: ${ref}` : `Created a new ${refType} in ${repoName}.`)
      ),
      tags: localized(['GitHub', repoShortName, refTypeZh], ['GitHub', repoShortName, refType]),
    };
  }

  if (event.type === 'IssuesEvent') {
    const issue = event.payload?.issue;
    return {
      ...baseItem,
      type: localized('议题', 'Issue'),
      title: localized(
        `${repoShortName} 的议题有新动态`,
        `${event.payload?.action || 'updated'} issue in ${repoShortName}`
      ),
      summary: localized(
        truncate(issue?.title || `${repoName} 的议题有新动态。`),
        truncate(issue?.title || `Issue activity in ${repoName}.`)
      ),
      href: issue?.html_url || baseItem.href,
      tags: localized(['GitHub', repoShortName, '议题'], ['GitHub', repoShortName, 'Issue']),
    };
  }

  const eventType = event.type.replace('Event', '');
  return {
    ...baseItem,
    type: localized('动态', eventType),
    title: localized(`${repoShortName} 有 GitHub 新动态`, `${eventType} on ${repoShortName}`),
    summary: localized(`来自 ${repoName} 的公开 GitHub 动态。`, `Public GitHub activity in ${repoName}.`),
  };
}

async function fetchGitHubItems() {
  const events = await fetchJson(
    `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=${MAX_ITEMS_PER_SOURCE}`
  );

  return events.map(buildGitHubItem);
}

function normalizeBilibiliUrl(url) {
  if (!url) return `https://space.bilibili.com/${BILIBILI_UID}/dynamic`;
  return url.startsWith('//') ? `https:${url}` : url;
}

function buildBilibiliItem(item, index, generatedAt) {
  const content = truncate(item.content || 'Bilibili update', 120);
  const likeCount = item.stat?.like;
  return {
    id: `bilibili-${item.opus_id || index}`,
    platform: 'bilibili',
    date: {
      zh: '最新动态',
      en: 'Latest',
    },
    type: localized('动态', 'Dynamic'),
    title: localized(content, content),
    summary: localized(
      likeCount ? `${content} · B站 ${likeCount} 个赞。` : content,
      likeCount ? `${content} · ${likeCount} likes on Bilibili.` : content
    ),
    href: normalizeBilibiliUrl(item.jump_url),
    tags: localized(['B站', '动态'], ['Bilibili', 'Dynamic']),
    cover: item.cover?.url ? normalizeBilibiliUrl(item.cover.url) : undefined,
    sortTime: new Date(generatedAt).getTime() - index,
  };
}

async function fetchBilibiliItems(generatedAt) {
  const data = await fetchJson(
    `https://api.bilibili.com/x/polymer/web-dynamic/v1/opus/feed/space?host_mid=${BILIBILI_UID}&page=1&type=all`,
    {
      headers: {
        Referer: `https://space.bilibili.com/${BILIBILI_UID}/article`,
      },
    }
  );

  const items = data?.data?.items || [];
  return items.slice(0, MAX_ITEMS_PER_SOURCE).map((item, index) =>
    buildBilibiliItem(item, index, generatedAt)
  );
}

async function collectSource(name, fetcher) {
  try {
    return {
      name,
      status: 'ok',
      items: await fetcher(),
    };
  } catch (error) {
    console.warn(`[social-feed] ${name} sync failed: ${error.message}`);
    return {
      name,
      status: 'failed',
      error: error.message,
      items: [],
    };
  }
}

async function main() {
  const generatedAt = new Date().toISOString();
  const sources = await Promise.all([
    collectSource('github', fetchGitHubItems),
    collectSource('bilibili', () => fetchBilibiliItems(generatedAt)),
  ]);

  const items = sources
    .flatMap((source) => source.items)
    .sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0))
    .slice(0, MAX_TOTAL_ITEMS);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(
    OUTPUT_FILE,
    `${JSON.stringify(
      {
        generatedAt,
        sources: sources.map(({ name, status, error }) => ({ name, status, error })),
        items,
      },
      null,
      2
    )}\n`,
    'utf8'
  );

  console.log(`[social-feed] wrote ${items.length} items to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(`[social-feed] sync failed: ${error.stack || error.message}`);
  process.exitCode = 1;
});
