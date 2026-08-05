/**
 * 构建前从 PCHSystem 主仓库拉取 CHANGELOG.md，生成 Starlight 内容页。
 * 拉取失败时写入占位内容，不阻断构建。
 */

import { writeFileSync } from 'node:fs';

const SOURCE_URL =
  'https://raw.githubusercontent.com/YuShenLiu06/PCHSystem/main/CHANGELOG.md';
const OUTPUT_PATH = new URL(
  '../src/content/docs/changelog.md',
  import.meta.url
).pathname;

const FRONTMATTER = `---
title: 更新日志
description: PCHSystem 版本变更记录（自动同步自主仓库）
---

> 原文件：[PCHSystem/CHANGELOG.md](https://github.com/YuShenLiu06/PCHSystem/blob/main/CHANGELOG.md)，每次构建自动拉取。

`;

async function fetchChangelog() {
  const res = await fetch(SOURCE_URL, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  // 去掉首行 H1（Starlight 已用 frontmatter title 渲染标题，避免重复）
  return text.replace(/^#\s+.+\n/, '');
}

function buildFallback(error) {
  return `${FRONTMATTER}

:::note[拉取失败]
无法从主仓库同步 CHANGELOG，请稍后重试或[直接查看原文件](${SOURCE_URL.replace('/raw/', '/blob/')}).

\`\`\`
${error.message}
\`\`\`
:::
`;
}

try {
  console.log('🔄 正在同步 CHANGELOG…');
  const markdown = await fetchChangelog();
  writeFileSync(OUTPUT_PATH, FRONTMATTER + markdown, 'utf-8');
  console.log(`✅ CHANGELOG 已同步 → ${OUTPUT_PATH}`);
} catch (error) {
  console.warn(`⚠️  CHANGELOG 同步失败: ${error.message}`);
  writeFileSync(OUTPUT_PATH, buildFallback(error), 'utf-8');
  console.warn(`⚠️  已写入占位内容 → ${OUTPUT_PATH}`);
}
