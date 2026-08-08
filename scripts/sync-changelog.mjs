/**
 * 构建前从 PCHSystem 主仓库拉取 CHANGELOG.md，
 * 解析后生成「列表入口 + 每版本详情页」到 src/content/docs/changelog/。
 * 拉取失败时写入占位内容，不阻断构建。
 */

import {
  existsSync,
  writeFileSync,
  unlinkSync,
  rmSync,
  mkdirSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..', 'src', 'content', 'docs');
const CHANGELOG_DIR = join(DOCS_DIR, 'changelog');
const OLD_MONOLITH = join(DOCS_DIR, 'changelog.md');

const SOURCE_URL =
  'https://raw.githubusercontent.com/YuShenLiu06/PCHSystem/main/CHANGELOG.md';
const SOURCE_VIEW_URL =
  'https://github.com/YuShenLiu06/PCHSystem/blob/main/CHANGELOG.md';
const BASE = '/PCHSystem-wiki';

const COMPONENT_MAP = [
  { prefix: 'backend-', label: '后端' },
  { prefix: 'frontend-', label: '前端' },
  { prefix: 'pch_system-', label: '游戏端' },
  { prefix: 'htcmc_auth-', label: '游戏端' },
  { prefix: 'mcdr-', label: '游戏端' },
];

const MAX_SUMMARY_LEN = 100;

// ── Helpers ──────────────────────────────────────────────

/** tag → 安全文件名：小写 + `.` 替换为 `-`（github-slugger 会删除 `.`） */
function tagToFilename(tag) {
  return tag.toLowerCase().replace(/\./g, '-');
}

function detailUrl(filename) {
  return `${BASE}/changelog/${filename}/`;
}

function getComponentLabel(tag) {
  for (const { prefix, label } of COMPONENT_MAP) {
    if (tag.startsWith(prefix)) return label;
  }
  return '综合';
}

function hasBreaking(text) {
  if (text.includes('无破坏性变更')) return false;
  return text.includes('破坏性变更') || /\bBREAKING\b/i.test(text);
}

/**
 * 从版本正文中提取一行摘要。
 * 优先取 header 与首个 ### 之间的自然语言摘要；
 * 没有则取首个 bullet 的加粗标题，截断到 100 字。
 */
function extractSummary(content) {
  // 按行查找首个 ### 子段头，取其前的文字作为摘要
  const lines = content.split('\n');
  const h3Index = lines.findIndex((line) => /^###\s/.test(line));
  const beforeH3 = h3Index === -1 ? lines : lines.slice(0, h3Index);
  const summaryLine = beforeH3.find((line) => line.trim());

  if (summaryLine) {
    return summaryLine.trim();
  }

  // fallback：取首个 bullet 中的加粗标题（加粗可在任意位置）
  const bulletMatch = content.match(/^[-*]\s+(.+)/m);
  if (bulletMatch) {
    const boldMatch = bulletMatch[1].match(/\*\*(.+?)\*\*/);
    if (boldMatch) {
      const title = boldMatch[1].replace(/[：:].*$/, '');
      return title.length > MAX_SUMMARY_LEN
        ? title.slice(0, MAX_SUMMARY_LEN - 1) + '…'
        : title;
    }
  }

  return '';
}

// ── Fetch & Parse ────────────────────────────────────────

async function fetchChangelog() {
  const res = await fetch(SOURCE_URL, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  // 去掉首行 H1（Starlight 已用 frontmatter title 渲染标题）
  return text.replace(/^#\s+.+\n/, '');
}

/**
 * 将 CHANGELOG 正文按 H2 切分为版本段 + 页脚。
 * @returns {{ versions: Version[], footer: string }}
 */
function parseChangelog(raw) {
  const versions = [];
  let footer = '';

  // 收集所有 H2 头的位置
  const headerRegex = /^##\s+(.+)$/gm;
  const headers = [];
  let match;
  while ((match = headerRegex.exec(raw)) !== null) {
    headers.push({
      index: match.index,
      lineEnd: headerRegex.lastIndex,
      title: match[1],
    });
  }

  for (let i = 0; i < headers.length; i++) {
    const { title, lineEnd } = headers[i];
    const nextIndex = i + 1 < headers.length ? headers[i + 1].index : raw.length;
    let content = raw.slice(lineEnd, nextIndex);
    // 去掉段尾的 `---` 分隔符
    content = content.replace(/\n*---\s*$/, '').trim();

    // 页脚
    if (title === '版本化策略') {
      footer = `## ${title}\n\n${content}`;
      continue;
    }

    // 版本头：[tag] - date  或  [tag]
    const versionMatch = title.match(
      /^\[([^\]]+)\](?:\s*[-—]\s*(\d{4}-\d{2}-\d{2}))?/
    );
    if (!versionMatch) continue;

    const tag = versionMatch[1];
    const date = versionMatch[2] || '';
    const isUnreleased = tag === 'Unreleased';
    const summary = isUnreleased ? '' : extractSummary(content);
    const label = isUnreleased ? '开发中' : getComponentLabel(tag);

    versions.push({ tag, date, summary, content, isUnreleased, label });
  }

  return { versions, footer };
}

// ── Page Generation ──────────────────────────────────────

function buildIndexPage({ versions, footer }) {
  const unreleased = versions.filter((v) => v.isUnreleased);
  const released = versions.filter((v) => !v.isUnreleased);

  let md = `---
title: 更新日志
description: PCHSystem 版本变更记录（自动同步自主仓库）
---

> 原文件：[PCHSystem/CHANGELOG.md](${SOURCE_VIEW_URL})，每次构建自动拉取。

`;

  if (unreleased.length > 0) {
    md += `## 未发布\n\n`;
    md += `| 版本 | 状态 |\n|---|---|\n`;
    for (const v of unreleased) {
      const url = detailUrl(tagToFilename(v.tag));
      md += `| [Unreleased](${url}) | _暂无新内容_ |\n`;
    }
    md += `\n`;
  }

  md += `## 已发版\n\n`;
  md += `| 版本 | 组件 | 日期 | 摘要 |\n|---|---|---|---|\n`;
  for (const v of released) {
    const url = detailUrl(tagToFilename(v.tag));
    const summary = v.summary
      ? (hasBreaking(v.summary) ? `⚠️ ${v.summary}` : v.summary)
      : '—';
    md += `| [${v.tag}](${url}) | ${v.label} | ${v.date || '—'} | ${summary} |\n`;
  }
  md += `\n`;

  if (footer) {
    md += `---\n\n${footer}\n`;
  }

  return md;
}

function buildDetailPage(version) {
  const backLink = `${BASE}/changelog/`;
  const description = version.isUnreleased
    ? '开发中 · 未发版'
    : `${version.label}${version.date ? ' · ' + version.date : ''}`;

  // 标题提升 ### → ##，使子段出现在 Starlight 右侧 TOC
  const body = version.content.replace(/^###\s+/gm, '## ');

  return `---
title: "${version.tag}"
description: "${description}"
---

[← 返回更新日志](${backLink})

---

> **${version.label}**${version.date ? ' · ' + version.date : ''}

${body}
`;
}

function buildFallbackIndex(error) {
  return `---
title: 更新日志
description: PCHSystem 版本变更记录（自动同步自主仓库）
---

> 原文件：[PCHSystem/CHANGELOG.md](${SOURCE_VIEW_URL})，每次构建自动拉取。

:::note[拉取失败]
无法从主仓库同步 CHANGELOG，请稍后重试或[直接查看原文件](${SOURCE_VIEW_URL}).

\`\`\`
${error.message}
\`\`\`
:::
`;
}

// ── Cleanup ──────────────────────────────────────────────

function cleanOldFiles() {
  if (existsSync(OLD_MONOLITH)) {
    unlinkSync(OLD_MONOLITH);
    console.log('  已删除旧的 changelog.md');
  }
  if (existsSync(CHANGELOG_DIR)) {
    rmSync(CHANGELOG_DIR, { recursive: true, force: true });
    console.log('  已清空 changelog/ 目录');
  }
  mkdirSync(CHANGELOG_DIR, { recursive: true });
}

// ── Main ─────────────────────────────────────────────────

try {
  console.log('🔄 正在同步 CHANGELOG…');
  const raw = await fetchChangelog();
  const { versions, footer } = parseChangelog(raw);

  cleanOldFiles();

  // 入口列表页
  writeFileSync(
    join(CHANGELOG_DIR, 'index.md'),
    buildIndexPage({ versions, footer }),
    'utf-8'
  );

  // 每个版本一个详情页
  for (const version of versions) {
    const filename = tagToFilename(version.tag);
    writeFileSync(
      join(CHANGELOG_DIR, `${filename}.md`),
      buildDetailPage(version),
      'utf-8'
    );
  }

  console.log(
    `✅ CHANGELOG 已同步 → ${CHANGELOG_DIR}/（${versions.length} 个版本）`
  );
} catch (error) {
  console.warn(`⚠️  CHANGELOG 同步失败: ${error.message}`);
  cleanOldFiles();
  writeFileSync(
    join(CHANGELOG_DIR, 'index.md'),
    buildFallbackIndex(error),
    'utf-8'
  );
  console.warn(`⚠️  已写入占位内容 → ${CHANGELOG_DIR}/index.md`);
}
