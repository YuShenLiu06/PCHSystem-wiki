// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://yushenliu06.github.io',
  base: '/PCHSystem-wiki',
  integrations: [
    mermaid({
      test: (node) => node.lang === 'mermaid',
    }),
    starlight({
      title: 'PCHSystem',
      description: 'HTCMC 项目贡献与荣誉系统 · 新手入门指南',
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/YuShenLiu06/PCHSystem' },
      ],
      sidebar: [
        {
          label: '新手指南',
          items: [
            { label: '快速开始', slug: 'guide/getting-started' },
            { label: '绑定账号', slug: 'guide/bind-account' },
            { label: '认领与提交材料', slug: 'guide/submit-materials' },
            { label: 'Web 后台使用', slug: 'guide/web-dashboard' },
          ],
        },
        {
          label: '玩法说明',
          items: [
            { label: '项目生命周期', slug: 'gameplay/project-lifecycle' },
            { label: '积分体系', slug: 'gameplay/scoring' },
            { label: '称号系统', slug: 'gameplay/titles' },
            { label: '施工进度上报', slug: 'gameplay/construction' },
          ],
        },
        {
          label: '命令手册',
          items: [
            { label: '常用命令速查', slug: 'commands/quick-reference' },
            { label: '表格协作命令', slug: 'commands/sheet-commands' },
            { label: '施工命令', slug: 'commands/construction-commands' },
          ],
        },
        {
          label: '常见问题',
          items: [{ label: 'FAQ', slug: 'faq' }],
        },
        {
          label: '关于',
          items: [{ label: '关于本 Wiki', slug: 'about' }],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
