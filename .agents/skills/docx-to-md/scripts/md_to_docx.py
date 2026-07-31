#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Markdown -> Word(.docx) 转换脚本（docx-to-md 的反向）
链路：md --(markdown)--> html --(htmldocx)--> docx
- 表格：markdown 的 tables 扩展 + htmldocx，输出 Word 表格
- 标题/列表/代码块/加粗等基础格式保留

依赖：pip install markdown htmldocx python-docx
用法：python md_to_docx.py <input.md> [output.docx]
  不传 output.docx 时，输出到「当前工作目录（项目根）」下的同名 .docx
"""
import sys
import os


def main():
    if len(sys.argv) < 2:
        print('用法: python md_to_docx.py <input.md> [output.docx]')
        sys.exit(1)

    input_path = os.path.abspath(sys.argv[1])
    if not os.path.exists(input_path):
        print('找不到文件: ' + input_path)
        sys.exit(1)
    if not input_path.lower().endswith(('.md', '.markdown')):
        print('仅支持 .md / .markdown。当前: ' + input_path)
        sys.exit(1)

    try:
        import markdown
        from htmldocx import HtmlToDocx
        from docx import Document
    except ImportError as e:
        print('缺少依赖。请先运行：')
        print('  pip install markdown htmldocx python-docx')
        print('（本机若 pip 命令无效，用 py -m pip install markdown htmldocx python-docx）')
        print('原始错误: ' + str(e))
        sys.exit(1)

    with open(input_path, 'r', encoding='utf-8') as f:
        text = f.read()

    # md -> html（开启表格、围栏代码块、合理列表等扩展）
    html = markdown.markdown(
        text,
        extensions=['tables', 'fenced_code', 'sane_lists', 'nl2br'],
    )

    # html -> docx
    document = Document()
    parser = HtmlToDocx()
    parser.add_html_to_document(html, document)

    if len(sys.argv) >= 3:
        output_path = os.path.abspath(sys.argv[2])
    else:
        base = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(os.getcwd(), base + '.docx')

    document.save(output_path)
    print('已生成: ' + output_path)


if __name__ == '__main__':
    main()
