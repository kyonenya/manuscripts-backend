import marked from 'marked';

const txt1 = `段落1\n\n段落2\n\n段落3`;
const txt2 = `> 段落1\n\n> 段落2\n\n段落3`;
const txt3 = `- リスト1\n\n- リスト2\n\n- リスト3`;
const txt4 = `段落a\n\n\n\n段落b\n\n\n\n段落c`;
const txt5 = `#見出し\n段落1\n\n段落2`; // NG
const txt6 = `> 引用\n本文\n> 引用`; // NG
const txt7 = `\[5\]`; // OK
const txt8 = `[5]`;

let html = marked(txt8);
console.log(html);
