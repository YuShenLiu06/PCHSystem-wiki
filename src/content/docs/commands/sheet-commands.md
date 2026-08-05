---
title: 表格协作命令
description: 材料清单协作完整命令参考
---

## 查看与管理

| 命令 | 权限 | 说明 |
|------|------|------|
| `!!PCH sheet list` | 全员 | 查看进行中的项目（默认 active） |
| `!!PCH sheet list -m` | 全员 | 只看自己参与的 |
| `!!PCH sheet list -a` | 全员 | 包含已归档的 |
| `!!PCH sheet list -t` | 全员 | 只看施工中的 |
| `!!PCH sheet list -c` | 全员 | 只看收集中的 |
| `!!PCH sheet view <编号>` | 全员 | 查看材料清单 |
| `!!PCH sheet create` | 全员 | 创建新表格 |

:::note[旗标简写]
`-m`(mine) / `-c`(collecting) / `-t`(constructing) / `-a`(archived) / `-l`(all)，可组合如 `-ma` = 我的+归档。
:::

## 材料行操作

| 命令 | 权限 | 说明 |
|------|------|------|
| `[认领]` 按钮 | 全员 | 认领 lock 类型行 |
| `[交付]` 按钮 | 认领者 | 交付确认 |
| `[解除]` 按钮 | 认领者 | 放弃认领 |
| `!!PCH sheet submit <编号> <x> <y> <z>` | 全员 | 扫描箱子提交 |
| `!!PCH sheet submit hand <编号>` | 全员 | 手持物品提交 |
| `!!PCH sheet deliver <编号> <行号>` | 认领者 | 交付指定行 |

## 负责人命令

| 命令 | 权限 | 说明 |
|------|------|------|
| `!!PCH sheet add ...` | owner | 添加材料行 |
| `!!PCH sheet set <编号> <行号>` | owner | 修改行（数量/排序） |
| `!!PCH sheet delrow <编号> <行号>` | owner | 删除行 |
| `!!PCH sheet addsub <编号> <父行> <registry_id> <数量>` | owner | 添加子物品 |
| `!!PCH sheet delsub <编号> <行号>` | owner | 删除子物品 |
| `!!PCH sheet setsub <编号> <行号> <数量>` | owner | 修改子物品 |
| `!!PCH sheet reject` | owner | 打回返工 |
| `!!PCH sheet advance <编号>` | owner | 流转项目阶段 |
| `!!PCH sheet manager <编号> list` | 全员 | 查看协管员 |
| `!!PCH sheet manager <编号> add <玩家>` | owner | 添加协管员 |
| `!!PCH sheet manager <编号> remove <玩家>` | owner | 移除协管员 |

## 通知

| 命令 | 说明 |
|------|------|
| `!!PCH sheet notify list` | 查看待处理通知 |

通知会在你上线时自动推送，包括：认领、交付、打回、项目状态变更等事件。
