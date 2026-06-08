---
name: workDiary
description: 基于 git 日志，为指定日期范围生成工作日志清单，自动排除 Merge 和格式化约定式提交，并可确认后推送到钉钉群
---

## 工作流程

**目标**：自动统计最近一周（当前日期往前推 5 天）的工作日志，生成格式化清单。

### Step 1：执行脚本获取日志

调用 `scripts/gen-work-log.ps1` 脚本，该脚本会自动：

- 计算日期范围：**当前日期 - 往前推 5 天**
- 提取该时间段内、当前 git 用户的所有提交记录
- 排除 Merge branch 日志
- 过滤约定式提交前缀（feat/fix/style 等）

**调用方式**：

```powershell
& .\scripts\gen-work-log.ps1
```

可选参数（默认 5 天，改为 14 天）：

```powershell
& .\scripts\gen-work-log.ps1 -Days 14
```

### Step 2：格式化并输出

将脚本输出整理成清晰的日志清单，展示给用户。

### Step 3：自动推送到钉钉

展示日志后，**无需询问，直接执行** `scripts/send_custom_robot_group_message.py` 推送到钉钉群。

**前置条件**：钉钉凭证已配置在 `.claude/config.json`（`access_token`、`secret`、@ 人配置）。该文件已被 `.gitignore` 忽略，不会提交。

**调用方式**（`msg` 替换为 Step 2 整理后的日志内容）：

```powershell
python .\scripts\send_custom_robot_group_message.py --msg "工作日志内容"
```

> 凭证默认从 `.claude/config.json` 读取，无需在命令行传 `access_token`/`secret`。如需临时覆盖可加 `--access_token`、`--secret`、`--userid`、`--is_at_all` 等参数。
