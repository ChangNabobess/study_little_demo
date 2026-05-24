// ========== 模板③：左右双栏现代风 ==========
// 左侧深色窄栏（联系方式 / 求职意向 / 技能 / 教育 / 自我评价）
// 右侧宽栏（个人简介 / 工作经历 / 项目亮点）
const fs = require('fs');
const C = require('./resume_content');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} = require('docx');

// ===== 配色：现代极简（深灰主调 + 暖橙强调）=====
const DARK = '2C3E50';        // 左栏背景：深石板蓝灰
const ACCENT = 'E67E22';      // 强调橙
const TEXT_LIGHT = 'FFFFFF';  // 左栏文字白
const TEXT_LIGHT_MUTED = 'BDC3C7'; // 左栏次级文字
const TEXT_DARK = '2C3E50';   // 右栏正文深灰
const TEXT_MUTED = '7F8C8D';  // 右栏次级灰
const RIGHT_HEAD = '34495E';  // 右栏标题色
const FONT = '微软雅黑';

// === 基础构造 ===
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder };
const cellNoBorder = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: opts.size || 20,
    bold: opts.bold || false,
    color: opts.color || TEXT_DARK,
    italics: opts.italics || false,
  });
}
function para(children, opts = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [children],
    alignment: opts.alignment,
    spacing: { before: opts.before == null ? 60 : opts.before, after: opts.after == null ? 60 : opts.after, line: opts.line || 300 },
    indent: opts.indent,
    border: opts.border,
    tabStops: opts.tabStops,
  });
}

// =============== 左侧栏内容 ===============
const leftChildren = [];

// 姓名
leftChildren.push(para(
  [new TextRun({ text: C.name, font: FONT, size: 40, bold: true, color: TEXT_LIGHT })],
  { alignment: AlignmentType.CENTER, before: 200, after: 60 }
));
// 职位
leftChildren.push(para(
  [new TextRun({ text: C.title, font: FONT, size: 22, color: TEXT_LIGHT_MUTED })],
  { alignment: AlignmentType.CENTER, before: 0, after: 80 }
));
// 强调色横线
leftChildren.push(new Paragraph({
  children: [new TextRun({ text: '', font: FONT, size: 12 })],
  spacing: { before: 0, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 1 } },
}));

// === 联系方式 ===
function leftSectionTitle(text) {
  return para(
    [new TextRun({ text, font: FONT, size: 22, bold: true, color: ACCENT })],
    { before: 240, after: 100 }
  );
}
function leftLabel(text) {
  return para(
    [new TextRun({ text, font: FONT, size: 17, color: TEXT_LIGHT_MUTED })],
    { before: 80, after: 20 }
  );
}
function leftValue(text, opts = {}) {
  return para(
    [new TextRun({ text, font: FONT, size: 19, color: TEXT_LIGHT, bold: opts.bold || false })],
    { before: 0, after: 40 }
  );
}
function leftBullet(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '◆  ', font: FONT, size: 18, color: ACCENT }),
      new TextRun({ text, font: FONT, size: 18, color: TEXT_LIGHT }),
    ],
    spacing: { before: 30, after: 30, line: 280 },
    indent: { left: 200, hanging: 200 },
  });
}

leftChildren.push(leftSectionTitle('CONTACT 联系方式'));
leftChildren.push(leftLabel('📍 城市'));
leftChildren.push(leftValue(C.contact.location));
leftChildren.push(leftLabel('📞 电话'));
leftChildren.push(leftValue(C.contact.phone));
leftChildren.push(leftLabel('✉ 邮箱'));
leftChildren.push(leftValue(C.contact.email));

// === 求职意向 ===
leftChildren.push(leftSectionTitle('INTENT 求职意向'));
leftChildren.push(leftLabel('期望职位'));
leftChildren.push(leftValue(C.intent.position, { bold: true }));
leftChildren.push(leftLabel('期望城市'));
leftChildren.push(leftValue(C.intent.city));
leftChildren.push(leftLabel('薪资 / 到岗'));
leftChildren.push(leftValue(C.intent.salary + ' / ' + C.intent.arrival));

// === 技能（简化版，详细在右栏个人简介后展开）===
leftChildren.push(leftSectionTitle('SKILLS 核心技能'));
const coreSkills = [
  'Vue 2 / 3 全家桶',
  'TypeScript / ES6+',
  'Webpack / Vite 工程化',
  'UNI-APP 跨端 / SSR',
  'Web Worker / RxJS',
  'ECharts 数据可视化',
  'Cornerstone DICOM',
  'IndexedDB / ABP',
];
coreSkills.forEach(s => leftChildren.push(leftBullet(s)));

// === 教育背景 ===
leftChildren.push(leftSectionTitle('EDUCATION 教育'));
leftChildren.push(para(
  [new TextRun({ text: C.education.school, font: FONT, size: 20, bold: true, color: TEXT_LIGHT })],
  { before: 60, after: 20 }
));
leftChildren.push(para(
  [new TextRun({ text: C.education.major + ' · ' + C.education.degree, font: FONT, size: 18, color: TEXT_LIGHT_MUTED })],
  { before: 0, after: 20 }
));
leftChildren.push(para(
  [new TextRun({ text: C.education.period, font: FONT, size: 17, color: TEXT_LIGHT_MUTED, italics: true })],
  { before: 0, after: 100 }
));

// =============== 右侧栏内容 ===============
const rightChildren = [];

// 顶部：标语
rightChildren.push(para(
  [new TextRun({ text: C.tagline, font: FONT, size: 19, color: TEXT_MUTED, italics: true })],
  { before: 240, after: 200 }
));

function rightSectionTitle(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '■  ', font: FONT, size: 26, color: ACCENT, bold: true }),
      new TextRun({ text, font: FONT, size: 24, bold: true, color: RIGHT_HEAD }),
    ],
    spacing: { before: 260, after: 120, line: 320 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: 'BDC3C7', space: 4 } },
  });
}
function rightSubTitle(text) {
  return para(
    [new TextRun({ text, font: FONT, size: 21, bold: true, color: ACCENT })],
    { before: 80, after: 40 }
  );
}
function rightBullet(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '▸  ', font: FONT, size: 19, color: ACCENT, bold: true }),
      new TextRun({ text, font: FONT, size: 19, color: TEXT_DARK }),
    ],
    spacing: { before: 40, after: 40, line: 320 },
    indent: { left: 240, hanging: 240 },
  });
}
function rightKV(key, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: '▸  ', font: FONT, size: 19, color: ACCENT, bold: true }),
      new TextRun({ text: key, font: FONT, size: 19, bold: true, color: RIGHT_HEAD }),
      new TextRun({ text: '：' + value, font: FONT, size: 19, color: TEXT_DARK }),
    ],
    spacing: { before: 40, after: 40, line: 320 },
    indent: { left: 240, hanging: 240 },
  });
}

// 个人简介
rightChildren.push(rightSectionTitle('个人简介'));
rightChildren.push(para([new TextRun({ text: C.intro, font: FONT, size: 19, color: TEXT_DARK })], { line: 360 }));

// 专业技能（完整版）
rightChildren.push(rightSectionTitle('专业技能'));
C.skills.forEach(([k, v]) => {
  rightChildren.push(new Paragraph({
    children: [
      new TextRun({ text: '● ', font: FONT, size: 19, color: ACCENT, bold: true }),
      new TextRun({ text: k, font: FONT, size: 19, bold: true, color: RIGHT_HEAD }),
      new TextRun({ text: '：' + v, font: FONT, size: 19, color: TEXT_DARK }),
    ],
    spacing: { before: 50, after: 50, line: 320 },
    indent: { left: 200, hanging: 200 },
  }));
});

// 工作经历
rightChildren.push(rightSectionTitle('工作经历'));
C.jobs.forEach(job => {
  // 公司 + 岗位 + 时间（同行）
  rightChildren.push(new Paragraph({
    children: [
      new TextRun({ text: job.company, font: FONT, size: 22, bold: true, color: RIGHT_HEAD }),
      new TextRun({ text: '  |  ' + job.position, font: FONT, size: 20, color: ACCENT, bold: true }),
    ],
    spacing: { before: 200, after: 30, line: 320 },
  }));
  rightChildren.push(para(
    [new TextRun({ text: job.period, font: FONT, size: 18, color: TEXT_MUTED, italics: true })],
    { before: 0, after: 30 }
  ));
  rightChildren.push(para(
    [new TextRun({ text: '公司业务：' + job.business, font: FONT, size: 18, color: TEXT_MUTED, italics: true })],
    { before: 0, after: 80 }
  ));
  // 项目
  job.projects.forEach(p => {
    rightChildren.push(new Paragraph({
      children: [
        new TextRun({ text: '▎ ', font: FONT, size: 20, color: ACCENT, bold: true }),
        new TextRun({ text: p.name, font: FONT, size: 20, bold: true, color: RIGHT_HEAD }),
        new TextRun({ text: '  ' + p.tech, font: FONT, size: 17, color: TEXT_MUTED, italics: true }),
      ],
      spacing: { before: 140, after: 60, line: 320 },
    }));
    rightChildren.push(rightKV('项目背景', p.background));
    p.bullets.forEach(b => rightChildren.push(rightBullet(b)));
  });
});

// 核心项目亮点
rightChildren.push(rightSectionTitle('核心项目亮点（精选）'));
C.highlights.forEach(h => {
  rightChildren.push(new Paragraph({
    children: [
      new TextRun({ text: '★  ', font: FONT, size: 22, color: ACCENT, bold: true }),
      new TextRun({ text: h.title, font: FONT, size: 21, bold: true, color: RIGHT_HEAD }),
      new TextRun({ text: '   — ' + h.source, font: FONT, size: 17, color: TEXT_MUTED, italics: true }),
    ],
    spacing: { before: 160, after: 50, line: 320 },
  }));
  rightChildren.push(rightKV('背景', h.background));
  rightChildren.push(rightKV('方案', h.solution));
  rightChildren.push(rightKV('收益', h.benefit));
});

// 自我评价
rightChildren.push(rightSectionTitle('自我评价'));
C.selfEval.forEach(s => rightChildren.push(rightBullet(s)));

// =============== 组装主表格（左 + 右两栏） ===============
const LEFT_W = 3400;
const RIGHT_W = 7066;
const TABLE_W = LEFT_W + RIGHT_W;

const leftCell = new TableCell({
  width: { size: LEFT_W, type: WidthType.DXA },
  shading: { fill: DARK, type: ShadingType.CLEAR, color: 'auto' },
  margins: { top: 300, bottom: 300, left: 300, right: 300 },
  borders: cellNoBorder,
  verticalAlign: VerticalAlign.TOP,
  children: leftChildren,
});

const rightCell = new TableCell({
  width: { size: RIGHT_W, type: WidthType.DXA },
  margins: { top: 200, bottom: 300, left: 400, right: 300 },
  borders: cellNoBorder,
  verticalAlign: VerticalAlign.TOP,
  children: rightChildren,
});

const outerTable = new Table({
  width: { size: TABLE_W, type: WidthType.DXA },
  columnWidths: [LEFT_W, RIGHT_W],
  borders: noBorders,
  rows: [new TableRow({ children: [leftCell, rightCell], cantSplit: false })],
});

// =============== 文档 ===============
const doc = new Document({
  creator: '畅一凡',
  title: '畅一凡-高级前端开发工程师-简历（双栏现代风）',
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 19, color: TEXT_DARK },
        paragraph: { spacing: { line: 300 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 720, right: 720, bottom: 720, left: 720 },
      },
    },
    children: [outerTable],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('D:/work/study/study-little-demo/畅一凡-简历-双栏现代风.docx', buffer);
  console.log('✔ 双栏现代风 → 畅一凡-简历-双栏现代风.docx');
}).catch(err => { console.error(err); process.exit(1); });
