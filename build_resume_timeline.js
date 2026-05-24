// ========== 模板④：时间轴可视化风 ==========
// 工作经历用纵向时间轴呈现：左侧日期 + 圆点节点 + 竖直连接线，右侧内容
const fs = require('fs');
const C = require('./resume_content');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  TabStopType, TabStopPosition,
} = require('docx');

// ===== 配色：青绿时间轴 =====
const TL_LINE = '16A085';     // 时间轴主色：青绿
const TL_DOT = '1ABC9C';      // 圆点色
const ACCENT = '16A085';      // 强调
const PRIMARY = '2C3E50';     // 主标题色（深石板）
const TEXT = '34495E';        // 正文
const MUTED = '7F8C8D';       // 次级灰
const LIGHT_BG = 'ECF0F1';    // 浅灰底（标语用）
const FONT = '微软雅黑';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder };
const cellNoBorder = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ---------- 通用 ----------
function txt(text, opts = {}) {
  return new TextRun({
    text, font: FONT,
    size: opts.size || 20,
    bold: opts.bold || false,
    color: opts.color || TEXT,
    italics: opts.italics || false,
  });
}
function para(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    alignment: opts.alignment,
    spacing: { before: opts.before == null ? 60 : opts.before, after: opts.after == null ? 60 : opts.after, line: opts.line || 320 },
    indent: opts.indent,
    border: opts.border,
    tabStops: opts.tabStops,
  });
}
function sectionTitle(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '●  ', font: FONT, size: 26, color: ACCENT, bold: true }),
      new TextRun({ text, font: FONT, size: 25, bold: true, color: PRIMARY }),
    ],
    spacing: { before: 280, after: 120, line: 320 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TL_LINE, space: 4 } },
  });
}
function bullet(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '▸  ', font: FONT, size: 20, color: ACCENT, bold: true }),
      new TextRun({ text, font: FONT, size: 20, color: TEXT }),
    ],
    spacing: { before: 40, after: 40, line: 320 },
    indent: { left: 240, hanging: 240 },
  });
}
function bulletKV(key, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: '▸  ', font: FONT, size: 20, color: ACCENT, bold: true }),
      new TextRun({ text: key, font: FONT, size: 20, bold: true, color: PRIMARY }),
      new TextRun({ text: '：' + value, font: FONT, size: 20, color: TEXT }),
    ],
    spacing: { before: 40, after: 40, line: 320 },
    indent: { left: 240, hanging: 240 },
  });
}

// ===================== 文档内容 =====================
const children = [];

// ---------- 顶部姓名 ----------
children.push(new Paragraph({
  children: [
    new TextRun({ text: C.name, font: FONT, size: 56, bold: true, color: PRIMARY }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 60, line: 320 },
}));
children.push(new Paragraph({
  children: [
    new TextRun({ text: C.title + '  ·  6 年经验', font: FONT, size: 26, color: ACCENT, bold: true }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 120, line: 320 },
}));
// 浅灰底标语条
children.push(new Paragraph({
  children: [
    new TextRun({ text: C.tagline, font: FONT, size: 19, color: TEXT, italics: true }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 120, line: 320 },
  shading: { fill: LIGHT_BG, type: ShadingType.CLEAR, color: 'auto' },
}));
// 联系方式条
children.push(new Paragraph({
  children: [
    new TextRun({ text: '📍 ' + C.contact.location + '   ', font: FONT, size: 20, color: TEXT }),
    new TextRun({ text: '📞 ' + C.contact.phone + '   ', font: FONT, size: 20, color: TEXT }),
    new TextRun({ text: '✉ ' + C.contact.email, font: FONT, size: 20, color: TEXT }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 60, line: 320 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TL_LINE, space: 8 } },
}));

// ---------- 求职意向 ----------
children.push(sectionTitle('求职意向'));
children.push(new Paragraph({
  children: [
    txt('期望职位：', { bold: true, color: ACCENT }),
    txt(C.intent.position + '     '),
    txt('期望城市：', { bold: true, color: ACCENT }),
    txt(C.intent.city + '     '),
    txt('薪资期望：', { bold: true, color: ACCENT }),
    txt(C.intent.salary + '     '),
    txt('到岗时间：', { bold: true, color: ACCENT }),
    txt(C.intent.arrival),
  ],
  spacing: { before: 60, after: 60, line: 340 },
}));

// ---------- 个人简介 ----------
children.push(sectionTitle('个人简介'));
children.push(new Paragraph({
  children: [txt(C.intro, { size: 20 })],
  spacing: { before: 60, after: 60, line: 360 },
}));

// ---------- 专业技能 ----------
children.push(sectionTitle('专业技能'));
C.skills.forEach(([k, v]) => {
  children.push(new Paragraph({
    children: [
      new TextRun({ text: '● ', font: FONT, size: 20, color: ACCENT, bold: true }),
      new TextRun({ text: k, font: FONT, size: 20, bold: true, color: PRIMARY }),
      new TextRun({ text: '：' + v, font: FONT, size: 20, color: TEXT }),
    ],
    spacing: { before: 50, after: 50, line: 320 },
    indent: { left: 200, hanging: 200 },
  }));
});

// ====================================================
//                工作经历 —— 时间轴版式
// ====================================================
children.push(sectionTitle('工作经历 · 时间轴'));

// 时间轴每段为一个 2 列表格：
//   左列（窄）：日期 + 圆点 + 竖线
//   右列（宽）：公司 + 项目内容
// 用左列右边框（粗的青绿色）来连线；圆点用首段首字符表示
const TL_LEFT_W = 1600;
const TL_RIGHT_W = 8866;
const TL_TOTAL_W = TL_LEFT_W + TL_RIGHT_W;

// 左列：日期段落 + 占位段落（用于撑高 + 显示竖线）
function buildLeftCell(dateText, isLast) {
  // 主日期 + 圆点
  const dateP = new Paragraph({
    children: [
      new TextRun({ text: dateText, font: FONT, size: 22, bold: true, color: PRIMARY }),
    ],
    alignment: AlignmentType.RIGHT,
    spacing: { before: 100, after: 40, line: 280 },
  });
  // 圆点行
  const dotP = new Paragraph({
    children: [
      new TextRun({ text: '●', font: FONT, size: 32, bold: true, color: TL_DOT }),
    ],
    alignment: AlignmentType.RIGHT,
    spacing: { before: 0, after: 40, line: 280 },
  });

  return new TableCell({
    width: { size: TL_LEFT_W, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 80, right: 240 },
    borders: {
      top: noBorder,
      bottom: noBorder,
      left: noBorder,
      // 右边框作为时间轴竖线（最后一段也保留以保持视觉连贯）
      right: { style: BorderStyle.SINGLE, size: 18, color: TL_LINE, space: 0 },
    },
    verticalAlign: VerticalAlign.TOP,
    children: [dateP, dotP],
  });
}

// 右列：公司 + 岗位 + 业务 + 项目们
function buildRightCell(job) {
  const items = [];
  items.push(new Paragraph({
    children: [
      new TextRun({ text: job.company, font: FONT, size: 24, bold: true, color: PRIMARY }),
      new TextRun({ text: '  |  ' + job.position, font: FONT, size: 21, color: ACCENT, bold: true }),
    ],
    spacing: { before: 80, after: 40, line: 320 },
  }));
  items.push(new Paragraph({
    children: [new TextRun({ text: '公司业务：' + job.business, font: FONT, size: 18, color: MUTED, italics: true })],
    spacing: { before: 0, after: 100, line: 320 },
  }));
  job.projects.forEach(p => {
    items.push(new Paragraph({
      children: [
        new TextRun({ text: '▎ ', font: FONT, size: 21, color: ACCENT, bold: true }),
        new TextRun({ text: p.name, font: FONT, size: 21, bold: true, color: PRIMARY }),
        new TextRun({ text: '   ' + p.tech, font: FONT, size: 18, color: MUTED, italics: true }),
      ],
      spacing: { before: 140, after: 60, line: 320 },
    }));
    items.push(bulletKV('项目背景', p.background));
    p.bullets.forEach(b => items.push(bullet(b)));
  });

  return new TableCell({
    width: { size: TL_RIGHT_W, type: WidthType.DXA },
    margins: { top: 80, bottom: 200, left: 320, right: 100 },
    borders: cellNoBorder,
    verticalAlign: VerticalAlign.TOP,
    children: items,
  });
}

// 为每段工作经历构建一行时间轴
C.jobs.forEach((job, idx) => {
  const isLast = idx === C.jobs.length - 1;
  // 抽取起始年月作为节点日期（"2023.03 — 至今" → "2023.03"）
  const startDate = job.period.split('—')[0].trim();
  const row = new TableRow({
    children: [
      buildLeftCell(startDate, isLast),
      buildRightCell(job),
    ],
    cantSplit: false,
  });
  children.push(new Table({
    width: { size: TL_TOTAL_W, type: WidthType.DXA },
    columnWidths: [TL_LEFT_W, TL_RIGHT_W],
    borders: noBorders,
    rows: [row],
  }));
  // 段间空隙
  if (!isLast) {
    children.push(new Paragraph({ children: [new TextRun({ text: '', size: 4 })], spacing: { before: 0, after: 0 } }));
  }
});

// ====================================================
//                  核心项目亮点
// ====================================================
children.push(sectionTitle('核心项目亮点（精选）'));
C.highlights.forEach(h => {
  children.push(new Paragraph({
    children: [
      new TextRun({ text: '★  ', font: FONT, size: 24, color: 'E67E22', bold: true }),
      new TextRun({ text: h.title, font: FONT, size: 22, bold: true, color: PRIMARY }),
      new TextRun({ text: '   — ' + h.source, font: FONT, size: 18, color: MUTED, italics: true }),
    ],
    spacing: { before: 180, after: 60, line: 320 },
  }));
  children.push(bulletKV('背景', h.background));
  children.push(bulletKV('方案', h.solution));
  children.push(bulletKV('收益', h.benefit));
});

// ---------- 教育背景 ----------
children.push(sectionTitle('教育背景'));
children.push(new Paragraph({
  children: [
    new TextRun({ text: C.education.school, font: FONT, size: 22, bold: true, color: PRIMARY }),
    new TextRun({ text: '   ' + C.education.major + '   ' + C.education.degree, font: FONT, size: 20, color: TEXT }),
    new TextRun({ text: '\t' + C.education.period, font: FONT, size: 19, color: MUTED }),
  ],
  spacing: { before: 80, after: 80, line: 320 },
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
}));

// ---------- 自我评价 ----------
children.push(sectionTitle('自我评价'));
C.selfEval.forEach(s => children.push(bullet(s)));

// ===================== 文档配置 =====================
const doc = new Document({
  creator: '畅一凡',
  title: '畅一凡-高级前端开发工程师-简历（时间轴可视化风）',
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 20, color: TEXT },
        paragraph: { spacing: { line: 320 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 900, right: 900, bottom: 900, left: 900 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('D:/work/study/study-little-demo/畅一凡-简历-时间轴可视化风.docx', buffer);
  console.log('✔ 时间轴可视化风 → 畅一凡-简历-时间轴可视化风.docx');
}).catch(err => { console.error(err); process.exit(1); });
