---
name: pims-feature
description: Use when the user provides a finalized requirement spec (a Markdown document) and wants to implement it as a new feature in the PIMS (病理信息系统) Vue 3 frontend. Walks four gated stages — clarify requirement, locate files + design, implement, self-test — stopping for user confirmation after each stage.
---

# PIMS 新需求落地 Workflow

把一份**已成型的需求方案（Markdown 文档）**在 PIMS 前端项目里落地实现。带着固定流程一步步走，**每个阶段结束都必须停下来，汇报并等用户确认后才进入下一阶段**。

参考约定：阶段 ②③④ 必须先读取 `references/pims-conventions.md`，按其中约定定位文件和写代码。

## 重要规则

- **不做 git 提交。** 自测完成后由用户自行决定如何提交。任何 `git commit` / `git push` 都不要做。
- **每阶段硬性 GATE。** 一个阶段做完就停，输出该阶段产出，等用户确认或补充后再继续。不要一口气跑完多个阶段。
- 默认用中文交流；代码、命令、技术术语保持英文。

## 启动

用户会提供一份需求 Markdown（文件路径或粘贴内容）。先读取它，然后进入阶段 ①。
用 TodoWrite 建四个 todo，对应下面四个阶段，逐个推进。

## 阶段 ① 需求梳理澄清

1. 通读需求文档。
2. 提炼并输出一份《需求理解确认单》，包含：
   - **要做什么**：用自己的话复述核心目标。
   - **验收标准**：逐条列出「做到什么算完成」。
   - **影响范围**：预计涉及哪些业务模块/页面。
   - **边界场景**：异常/空数据/权限/多角色等需要考虑的情况。
   - **疑问点**：需求里没写清、需要用户拍板的地方。
3. **GATE：停。** 把确认单发给用户，等用户确认或补充、解答疑问。用户确认后才进入阶段 ②。

## 阶段 ② 修改文件定位 + 方案设计

1. 先读 `references/pims-conventions.md`。
2. 对照 PIMS 结构，定位要**修改/新增**的文件，给出：
   - **改动文件清单**：每个文件路径 + 该文件要做什么。
   - **实现方案**：关键逻辑怎么走、用到哪些现有约定/机制（路由注入、store 模块、composable、service、mitt、多主题、i18n 等）。
   - **任务拆分**：把实现拆成有序的小任务。
3. **GATE：停。** 把方案发给用户，等用户确认。用户确认后才动手写代码。

## 阶段 ③ 编码实现

1. 按阶段 ② 确认的方案，逐文件实现。
2. 严格遵循 `references/pims-conventions.md` 的架构约定（`<script setup>`、`use*` composable、`*.service.js` 封装、mitt 通信、`@` 别名、多主题不硬编码颜色、i18n 不写死中文）。
3. **GATE：停。** 汇报本次改动清单（改了/加了哪些文件、各自做了什么），等用户确认。

## 阶段 ④ 自测

1. 按需求性质选测试方式（详见 `references/pims-conventions.md` 第 4 节）：
   - **单页面**（页内组件/交互/逻辑）→ **Jest 单测**（`npm test`）
   - **跨页面流程**（跳转、带参、跨页调用）→ **pytest + Playwright 端到端**，用例放 `tests/e2e/`
2. 运行自测命令：
   - Jest：`npm test`
   - E2E：先起服务 `npm run dev`（后台）等就绪，再跑 `pytest`（本机用 `py -m pytest`）
   - 静态检查：`npm run lint`（必要时 `npm run lint-fix`）
3. 逐条核对阶段 ① 的验收标准是否满足。
4. **GATE：停。** 输出自测报告（命令结果 + 验收核对），等用户决定如何提交。**不要自己提交。**
