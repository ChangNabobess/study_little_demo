---
name: docx-to-md
description: Use when the user wants to convert between Word (.docx) and Markdown in either direction — e.g. they hand over a .docx requirement spec or backend interface/API doc and want a .md version (to feed into workflows like /pims-feature), OR they have a .md document and want a Word .docx to share with colleagues. Output is saved into the project root by default. Trigger whenever the user mentions converting / turning a Word doc or .docx into markdown, turning a .md / markdown into Word / .docx, "word 转 md", "md 转 word", "把这个文档转成 md/word", or provides a .docx/.md path and asks for the other format — even if phrased casually and even if they don't say the word "convert".
---

# Word(.docx) ↔ Markdown 双向转换

在 Word 和 Markdown 之间互转，默认把结果保存到**当前项目根目录**。

- **docx → md**：把 Word（需求/接口文档）转成 Markdown，方便喂给别的流程（如 `/pims-feature`）。
- **md → docx**：把 Markdown 转回 Word，方便发给同事评审。

两个脚本都在 `scripts/` 下，按方向选用。

## 前置依赖（首次使用，安装一次）

走 Python 方案。两个方向的依赖一次性装好：

```bash
pip install mammoth markdownify markdown htmldocx python-docx
```

> 本机注意：若 `python` / `pip` 命令无效（被 Windows App 执行别名占位），用 `py` 启动器代替：
> `py -m pip install mammoth markdownify markdown htmldocx python-docx`，运行脚本时也用 `py` 开头。

## 方向一：docx → md

链路：`docx --(mammoth)--> html --(markdownify)--> md`
- **表格**：markdownify 默认输出标准 Markdown 表格（接口字段表能保真）。
- **图片**：mammoth 默认把图片转成 base64 data URI 内联进 md，单文件自包含。

仅支持 `.docx`（旧版 `.doc` 先用 Word 另存为 `.docx`）。**在项目根目录**运行：

```bash
python ".Codex/skills/docx-to-md/scripts/convert.py" "<input.docx>" ["<输出.md 路径>"]
```

不传第二个参数时，输出同名 `.md` 到当前工作目录（＝项目根）。

## 方向二：md → docx

链路：`md --(markdown)--> html --(htmldocx)--> docx`
- **表格/标题/列表/代码块/加粗**等基础格式保留。
- 支持 `.md` / `.markdown`。

**在项目根目录**运行：

```bash
python ".Codex/skills/docx-to-md/scripts/md_to_docx.py" "<input.md>" ["<输出.docx 路径>"]
```

不传第二个参数时，输出同名 `.docx` 到当前工作目录（＝项目根）。

> 本机若 `python` 无效，把命令开头换成 `py`。

## 注意

- **输出位置**：默认就是「当前工作目录」。要落到项目根，就在项目根目录执行命令——这也是 Codex 在本项目的默认工作目录。
- **不自动提交**：生成文件后不要做任何 git 操作，由用户决定是否提交。
- **不改写内容**：只做格式转换，不增删或润色文档内容。
- 脚本成功后打印 `已生成: <路径>`，把该路径告诉用户；docx→md 若有 mammoth 转换提示一并转达。

## 排错

| 现象 | 处理 |
|------|------|
| 提示「缺少依赖」 | 运行上面的 `pip install ...`（或 `py -m pip install ...`）后重试 |
| `python` 命令无输出/报错 | 改用 `py` 启动器：`py ...\convert.py ...` |
| docx→md 表格没转成 md 表格 | 确认装了 `markdownify`；复杂合并单元格 mammoth 可能拆平，属预期 |
| md→docx 表格没生效 | 确认 Markdown 用的是标准 GFM 表格语法（`\| --- \|` 分隔行） |
| 报「仅支持 .docx」/「仅支持 .md」 | 方向用反了或源文件格式不对，检查扩展名 |
| docx→md 图片丢失 | 源 docx 里需是嵌入图片而非链接图片；链接图片不会被内联 |
