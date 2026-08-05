---
title: 快速开始
description: 从零开始上手 PCHSystem
---

import { Steps } from '@astrojs/starlight/components';

欢迎使用 PCHSystem！本页面将带你完成从加入服务器到提交贡献的全部流程。

<Steps>

### 加入服务器

1. 确保你已在白名单中（联系管理员申请）
2. 使用对应的客户端模组包连接服务器
3. 进服后输入 `!!PCH` 查看所有可用命令

### 绑定 Web 账号

绑定账号后，你可以在 Web 端查看项目进度、编辑材料清单，不进游戏也能协作。

详见 [绑定账号](/guide/bind-account/) 页面。

### 浏览项目列表

游戏内输入：

```
!!PCH sheet list
```

查看当前进行中的项目。加上 `-m` 只看自己参与的：

```
!!PCH sheet list -m
```

### 认领材料

找到你感兴趣的项目后，输入以下命令查看材料清单：

```
!!PCH sheet view <项目编号>
```

在游戏内点击材料行旁的 `[认领]` 按钮即可认领。

### 提交材料

收集好材料后，将物品放入箱子，然后：

```
!!PCH sheet submit <项目编号> <x> <y> <z>
```

其中 `<x> <y> <z>` 是箱子的坐标。系统会自动扫描箱子内容并匹配材料清单。

也可以手持物品直接提交：

```
!!PCH sheet submit hand <项目编号>
```

### 查看你的贡献

```
!!PCH sheet view <项目编号>
```

已交付的材料会标记为 ✓，你的贡献量一目了然。

</Steps>

## 下一步

- [绑定账号](/guide/bind-account/) — 解锁 Web 端操作
- [认领与提交材料](/guide/submit-materials/) — 详细操作指南
- [命令速查](/commands/quick-reference/) — 所有命令一览
