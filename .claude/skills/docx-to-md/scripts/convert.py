#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Word(.docx) -> Markdown 转换脚本
链路：docx --(mammoth)--> html --(markdownify)--> md
- 表格：markdownify 默认输出 Markdown 表格（接口字段表能保真）
- 图片：mammoth 默认把图片转成 base64 data URI 内联，无需额外文件

依赖：pip install mammoth markdownify
用法：python convert.py <input.docx> [output.md]
  不传 output.md 时，输出到「当前工作目录（项目根）」下的同名 .md
"""
import sys
import os


def main():
    if len(sys.argv) < 2:
        print('用法: python convert.py <input.docx> [output.md]')
        sys.exit(1)

    input_path = os.path.abspath(sys.argv[1])
    if not os.path.exists(input_path):
        print('找不到文件: ' + input_path)
        sys.exit(1)
    if not input_path.lower().endswith('.docx'):
        print('仅支持 .docx（旧版 .doc 请先用 Word 另存为 .docx）。当前: ' + input_path)
        sys.exit(1)

    try:
        import mammoth
        from markdownify import markdownify as to_md
    except ImportError as e:
        print('缺少依赖。请先运行：')
        print('  pip install mammoth markdownify')
        print('（本机若 pip 命令无效，用 py -m pip install mammoth markdownify）')
        print('原始错误: ' + str(e))
        sys.exit(1)

    # docx -> html（图片默认以 base64 data URI 内联）
    with open(input_path, 'rb') as f:
        result = mammoth.convert_to_html(f)
    html = result.value

    # html -> markdown
    markdown = to_md(html, heading_style='ATX', bullets='-')

    if len(sys.argv) >= 3:
        output_path = os.path.abspath(sys.argv[2])
    else:
        base = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(os.getcwd(), base + '.md')

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(markdown)
    print('已生成: ' + output_path)

    if result.messages:
        print('转换提示（mammoth）:')
        for m in result.messages:
            print('  - [%s] %s' % (m.type, m.message))


if __name__ == '__main__':
    main()
