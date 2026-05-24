// ========== 模板①：经典蓝商务（精简版 · HR 30 秒可扫完）==========
const fs = require('fs');
const C = require('./resume_content');
const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle,
  TabStopType, TabStopPosition,
} = require('docx');

// ============== 颜色与字体常量 ==============
const COLOR_PRIMARY = '1F4E79';
const COLOR_SECOND  = '2E75B6';
const COLOR_TEXT    = '262626';
const COLOR_MUTED   = '595959';
const COLOR_ACCENT  = 'C00000';
const FONT = '微软雅黑';

// ============== 通用构建函数 ==============
function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: COLOR_PRIMARY })],
    spacing: { before: 240, after: 120, line: 320 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: COLOR_SECOND, space: 4 } },
  });
}

function jobHeader(left, right) {
  return new Paragraph({
    children: [
      new TextRun({ text: left, font: FONT, size: 23, bold: true, color: COLOR_TEXT }),
      new TextRun({ text: '\t' + right, font: FONT, size: 21, color: COLOR_MUTED }),
    ],
    spacing: { before: 180, after: 80, line: 320 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
  });
}

function projectTitle(name, tech) {
  return new Paragraph({
    children: [
      new TextRun({ text: '▎ ', font: FONT, size: 22, color: COLOR_SECOND, bold: true }),
      new TextRun({ text: name, font: FONT, size: 22, bold: true, color: COLOR_PRIMARY }),
      new TextRun({ text: '   ' + tech, font: FONT, size: 19, color: COLOR_MUTED, italics: true }),
    ],
    spacing: { before: 140, after: 60, line: 320 },
  });
}

function bullet(content) {
  let runs;
  if (typeof content === 'string') {
    runs = [
      new TextRun({ text: '▸ ', font: FONT, size: 21, color: COLOR_SECOND, bold: true }),
      new TextRun({ text: content, font: FONT, size: 21, color: COLOR_TEXT }),
    ];
  } else {
    runs = [new TextRun({ text: '▸ ', font: FONT, size: 21, color: COLOR_SECOND, bold: true }), ...content];
  }
  return new Paragraph({
    children: runs,
    spacing: { before: 40, after: 40, line: 320 },
    indent: { left: 240, hanging: 240 },
  });
}

function bulletKV(key, value) {
  return bullet([
    new TextRun({ text: key, font: FONT, size: 21, bold: true, color: COLOR_TEXT }),
    new TextRun({ text: '：' + value, font: FONT, size: 21, color: COLOR_TEXT }),
  ]);
}

function skillRow(label, content) {
  return new Paragraph({
    children: [
      new TextRun({ text: '• ' + label + '：', font: FONT, size: 21, bold: true, color: COLOR_PRIMARY }),
      new TextRun({ text: content, font: FONT, size: 21, color: COLOR_TEXT }),
    ],
    spacing: { before: 60, after: 60, line: 320 },
    indent: { left: 120 },
  });
}

// ============== 简历内容 ==============
const children = [];

// ---------- 顶部信息 ----------
children.push(new Paragraph({
  children: [
    new TextRun({ text: C.name, font: FONT, size: 44, bold: true, color: COLOR_PRIMARY }),
    new TextRun({ text: '    ' + C.title, font: FONT, size: 28, color: COLOR_SECOND, bold: true }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 80, line: 320 },
}));

children.push(new Paragraph({
  children: [new TextRun({ text: C.tagline, font: FONT, size: 21, color: COLOR_MUTED, italics: true })],
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 120, line: 320 },
}));

children.push(new Paragraph({
  children: [
    new TextRun({ text: '📍 ' + C.contact.location + '     ', font: FONT, size: 21, color: COLOR_TEXT }),
    new TextRun({ text: '📞 ' + C.contact.phone + '     ', font: FONT, size: 21, color: COLOR_TEXT }),
    new TextRun({ text: '✉ ' + C.contact.email, font: FONT, size: 21, color: COLOR_TEXT }),
  ],
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 80, line: 320 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOR_PRIMARY, space: 6 } },
}));

// ---------- 求职意向 ----------
children.push(sectionTitle('求职意向'));
children.push(new Paragraph({
  children: [
    new TextRun({ text: '期望职位：', font: FONT, size: 21, bold: true, color: COLOR_SECOND }),
    new TextRun({ text: C.intent.position + '     ', font: FONT, size: 21, color: COLOR_TEXT }),
    new TextRun({ text: '期望城市：', font: FONT, size: 21, bold: true, color: COLOR_SECOND }),
    new TextRun({ text: C.intent.city + '     ', font: FONT, size: 21, color: COLOR_TEXT }),
    new TextRun({ text: '薪资期望：', font: FONT, size: 21, bold: true, color: COLOR_SECOND }),
    new TextRun({ text: C.intent.salary + '     ', font: FONT, size: 21, color: COLOR_TEXT }),
    new TextRun({ text: '到岗时间：', font: FONT, size: 21, bold: true, color: COLOR_SECOND }),
    new TextRun({ text: C.intent.arrival, font: FONT, size: 21, color: COLOR_TEXT }),
  ],
  spacing: { before: 60, after: 60, line: 340 },
}));

// ---------- 个人简介 ----------
children.push(sectionTitle('个人简介'));
children.push(new Paragraph({
  children: [new TextRun({ text: C.intro, font: FONT, size: 21, color: COLOR_TEXT })],
  spacing: { before: 60, after: 60, line: 360 },
}));

// ---------- 专业技能 ----------
children.push(sectionTitle('专业技能'));
C.skills.forEach(([k, v]) => children.push(skillRow(k, v)));

// ---------- 工作经历 ----------
children.push(sectionTitle('工作经历'));
C.jobs.forEach(job => {
  children.push(jobHeader(job.company + '  |  ' + job.position, job.period));
  children.push(new Paragraph({
    children: [
      new TextRun({ text: '公司业务：', font: FONT, size: 21, bold: true, color: COLOR_MUTED }),
      new TextRun({ text: job.business, font: FONT, size: 21, color: COLOR_MUTED, italics: true }),
    ],
    spacing: { before: 40, after: 80, line: 320 },
  }));
  job.projects.forEach(p => {
    children.push(projectTitle(p.name, p.tech));
    children.push(bulletKV('项目背景', p.background));
    p.bullets.forEach(b => children.push(bullet(b)));
  });
});

// ---------- 核心项目亮点 ----------
children.push(sectionTitle('核心项目亮点（精选）'));
C.highlights.forEach(h => {
  children.push(new Paragraph({
    children: [
      new TextRun({ text: '★  ', font: FONT, size: 22, color: COLOR_ACCENT, bold: true }),
      new TextRun({ text: h.title, font: FONT, size: 22, bold: true, color: COLOR_PRIMARY }),
      new TextRun({ text: '   — ' + h.source, font: FONT, size: 19, color: COLOR_MUTED, italics: true }),
    ],
    spacing: { before: 140, after: 40, line: 320 },
  }));
  children.push(bulletKV('背景', h.background));
  children.push(bulletKV('方案', h.solution));
  children.push(bulletKV('收益', h.benefit));
});

// ---------- 教育背景 ----------
children.push(sectionTitle('教育背景'));
children.push(new Paragraph({
  children: [
    new TextRun({ text: C.education.school, font: FONT, size: 22, bold: true, color: COLOR_TEXT }),
    new TextRun({ text: '   ' + C.education.major + '   ' + C.education.degree, font: FONT, size: 21, color: COLOR_TEXT }),
    new TextRun({ text: '\t' + C.education.period, font: FONT, size: 21, color: COLOR_MUTED }),
  ],
  spacing: { before: 80, after: 80, line: 320 },
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
}));

// ---------- 自我评价 ----------
children.push(sectionTitle('自我评价'));
C.selfEval.forEach(s => children.push(bullet(s)));

// ============== 文档配置 ==============
const doc = new Document({
  creator: '畅一凡',
  title: '畅一凡-高级前端开发工程师-简历',
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 21, color: COLOR_TEXT },
        paragraph: { spacing: { line: 320 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('D:/work/study/study-little-demo/畅一凡-高级前端开发工程师-简历.docx', buffer);
  console.log('✔ 经典蓝商务（精简版）→ 畅一凡-高级前端开发工程师-简历.docx');
}).catch(err => { console.error(err); process.exit(1); });
