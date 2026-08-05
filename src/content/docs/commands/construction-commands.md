---
title: 施工命令
description: 施工阶段进度追踪相关命令
---

## 命令一览

| 命令 | 权限 | 说明 |
|------|------|------|
| `!!PCH construction status` | 全员 / 控制台 | 查看追踪器运行状态 |
| `!!PCH construction join [sheet_id]` | 全员 | 加入施工项目 |
| `!!PCH construction leave` | 全员 | 退出当前施工 |
| `!!PCH construction current` | 全员 | 查看当前加入的施工项目 |

## 详细说明

### construction status

显示后台追踪器的完整状态：

- 追踪器是否启用
- `world/stats` 目录是否存在
- 当前在线玩家数
- 当前施工项目数
- 是否可自动归因（多项目时可能无法判断）
- flush 间隔（默认 30 秒）
- baseline 玩家数
- 上次上报结果

### construction join

```
!!PCH construction join            # 自动加入唯一施工中的项目
!!PCH construction join <编号>      # 加入指定项目
```

加入后，追踪器会将你的方块放置贡献归因到该项目。

:::warning[单项目限制]
同一时间只能加入一个施工项目。如需切换，先 `leave` 再 `join`。
:::

### construction leave

退出当前施工项目。退出后追踪器不再上报你的放置贡献（baseline 推进，不丢数据）。

### construction current

显示你当前加入的施工项目编号和名称。

## 规划中的命令

| 命令 | 状态 | 说明 |
|------|------|------|
| `!!PCH construction switch` | 规划中 | 切换上报源（默认追踪器 / 客户端 mod） |
| `!!PCH mod-token` | 规划中 | 获取客户端 mod JWT 令牌 |
