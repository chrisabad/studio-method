#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname);
const MD_FILE = path.join(ROOT, 'playbook.md');
const TEMPLATE_FILE = path.join(ROOT, 'template.html');
const OUT_FILE = path.join(ROOT, 'playbook.html');

// Chapter accent colors (matching original)
const CHAPTER_ACCENTS = {
  '01': '#c4501a',
  '02': '#7a6e5f',
  '03': '#4a6741',
  '04': '#2d5a7a',
  '05': '#6b3a6b',
  '06': '#b89a5a',
  '07': '#8a4a2a',
};

// ─── Custom block parsers ───────────────────────────────────────────────────

function parseAttrs(attrStr) {
  const attrs = {};
  const re = /(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(attrStr)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function renderInline(text) {
  return text
    .replace(/&/g, '&amp;')
    // Already-escaped entities — unescape first then re-escape? No: just pass through
    // Handle bold, italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function renderInlineRaw(text) {
  // For text that already has proper chars (not HTML entities), just handle markdown
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function renderPullQuote(content) {
  const text = content.trim();
  return `<blockquote class="pull-quote">${text}</blockquote>`;
}

function renderStats(content) {
  const lines = content.trim().split('\n').filter(l => l.trim().startsWith('-'));
  const rows = lines.map(line => {
    const parts = line.replace(/^-\s*/, '').split('|');
    const num = parts[0] ? parts[0].trim() : '';
    const label = parts[1] ? parts[1].trim() : '';
    return `  <div class="stat-row"><span class="stat-num">${num}</span><span class="stat-label">${label}</span></div>`;
  }).join('\n');
  return `<div class="stat-block">\n${rows}\n</div>`;
}

function renderColList(content) {
  const lines = content.trim().split('\n').filter(l => l.trim().startsWith('-'));
  const items = lines.map(line => {
    const raw = line.replace(/^-\s*/, '');
    const pipeIdx = raw.indexOf(' | ');
    if (pipeIdx === -1) {
      return `  <li>${renderInlineRaw(raw)}</li>`;
    }
    const term = renderInlineRaw(raw.slice(0, pipeIdx));
    const def = renderInlineRaw(raw.slice(pipeIdx + 3));
    return `  <li>${term}<span>${def}</span></li>`;
  }).join('\n');
  return `<ul class="col-list">\n${items}\n</ul>`;
}

function renderField(attrs, content) {
  const title = attrs.title || '';
  const paras = content.trim().split('\n\n').map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    return `<p>${renderInlineRaw(trimmed)}</p>`;
  }).filter(Boolean).join('\n');
  return `<div class="field-block">\n  <div class="field-title">${title}</div>\n  ${paras}\n</div>`;
}

// ─── Markdown block renderer ────────────────────────────────────────────────

function renderBodyContent(md) {
  // Process custom blocks first, then standard markdown
  let html = md;

  // Replace :::pull-quote blocks
  html = html.replace(/:::pull-quote\n([\s\S]*?):::/g, (_, content) => {
    return renderPullQuote(content);
  });

  // Replace :::stats blocks
  html = html.replace(/:::stats\n([\s\S]*?):::/g, (_, content) => {
    return renderStats(content);
  });

  // Replace :::col-list blocks
  html = html.replace(/:::col-list\n([\s\S]*?):::/g, (_, content) => {
    return renderColList(content);
  });

  // Replace :::field{...} blocks
  html = html.replace(/:::field\{([^}]*)\}\n([\s\S]*?):::/g, (_, attrStr, content) => {
    const attrs = parseAttrs(attrStr);
    return renderField(attrs, content);
  });

  // Now parse remaining markdown into HTML paragraphs/headings
  // Split by double newlines (paragraphs) and process
  const blocks = html.split(/\n\n+/);
  const rendered = blocks.map(block => {
    block = block.trim();
    if (!block) return '';

    // Already-rendered HTML blocks (from custom blocks above)
    if (block.startsWith('<')) return block;

    // h3
    if (block.startsWith('### ')) {
      return `<h3>${renderInlineRaw(block.slice(4))}</h3>`;
    }
    // h2
    if (block.startsWith('## ')) {
      return `<h2>${renderInlineRaw(block.slice(3))}</h2>`;
    }
    // h1 (inside chapter, this is the chapter title — skip, handled above)
    if (block.startsWith('# ')) {
      return `<h1>${renderInlineRaw(block.slice(2))}</h1>`;
    }
    // Unordered list
    if (block.match(/^[-*]\s/m)) {
      const lines = block.split('\n').filter(l => l.trim());
      const items = lines.map(l => `<li>${renderInlineRaw(l.replace(/^[-*]\s+/, ''))}</li>`).join('\n');
      return `<ul>\n${items}\n</ul>`;
    }
    // Ordered list
    if (block.match(/^\d+\.\s/m)) {
      const lines = block.split('\n').filter(l => l.trim());
      const items = lines.map(l => `<li>${renderInlineRaw(l.replace(/^\d+\.\s+/, ''))}</li>`).join('\n');
      return `<ol>\n${items}\n</ol>`;
    }
    // Plain paragraph
    return `<p>${renderInlineRaw(block.replace(/\n/g, ' '))}</p>`;
  });
  return rendered.filter(Boolean).join('\n');
}

// ─── Section splitter ───────────────────────────────────────────────────────

function splitIntoSections(bodyMd, chapterMeta) {
  // Split body on ## headings — each ## starts a new section
  const sectionParts = bodyMd.split(/(?=^## )/m);
  let altCounter = 0;
  const sections = [];

  for (const part of sectionParts) {
    if (!part.trim()) continue;
    const altClass = altCounter % 2 === 1 ? ' alt' : '';
    altCounter++;

    const runningHead = `<div class="running-head"><span>${chapterMeta.runningTitle}</span><span>${chapterMeta.runningLabel}</span></div>`;
    const footnote = `<div class="footnote">Studio Method · Chapter ${chapterMeta.number}</div>`;

    const contentHtml = renderBodyContent(part);

    sections.push(`<section class="body-section${altClass}">\n${runningHead}\n${contentHtml}\n${footnote}\n</section>`);
  }
  return sections.join('\n');
}

// ─── Chapter renderer ───────────────────────────────────────────────────────

function renderChapter(attrs, content) {
  const num = attrs.number || '01';
  const label = attrs.label || `Chapter ${parseInt(num, 10)}`;
  const accent = CHAPTER_ACCENTS[num] || '#c4501a';

  // First line after the # heading is the chapter intro
  const lines = content.trim().split('\n');
  let titleLine = '';
  let introText = '';
  let bodyStart = 0;

  // Find h1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('# ')) {
      titleLine = lines[i].slice(2).trim();
      // Next non-empty lines until ## are the intro
      let j = i + 1;
      const introParts = [];
      while (j < lines.length && !lines[j].startsWith('## ')) {
        if (lines[j].trim()) introParts.push(lines[j].trim());
        j++;
      }
      introText = introParts.join(' ');
      bodyStart = j;
      break;
    }
  }

  const bodyMd = lines.slice(bodyStart).join('\n');

  // Running head: use chapter title (uppercase) and label
  const runningTitle = 'THE CREATIVE DIRECTOR\'S AI PLAYBOOK';
  const runningLabel = label.toUpperCase();
  const chapterMeta = { number: num, runningTitle, runningLabel };

  const coverPage = `<div class="page chapter-cover" style="--ch-accent: ${accent};">
  <div class="chapter-num">${num}</div>
  <div class="chapter-label">${label}</div>
  <h1 class="chapter-title">${titleLine}</h1>
  <p class="chapter-intro">${introText}</p>
</div>`;

  const bodyHtml = splitIntoSections(bodyMd, chapterMeta);

  return `${coverPage}\n${bodyHtml}`;
}

// ─── Intro renderer ─────────────────────────────────────────────────────────

function renderIntro(attrs, content) {
  const quote = attrs.quote || '';
  const paras = content.trim().split('\n\n').map(p => {
    const t = p.trim();
    if (!t) return '';
    return `<p>${renderInlineRaw(t.replace(/\n/g, ' '))}</p>`;
  }).filter(Boolean).join('\n');

  return `<div class="page intro-page">
  <blockquote class="intro-quote">${quote}</blockquote>
  ${paras}
</div>`;
}

// ─── Closing renderer ────────────────────────────────────────────────────────

function renderClosing(attrs, content) {
  const runningHead = `<div class="running-head"><span>THE CREATIVE DIRECTOR'S AI PLAYBOOK</span><span>CLOSING</span></div>`;
  const footnote = `<div class="footnote">Studio Method · Closing</div>`;
  const contentHtml = renderBodyContent(content);
  return `<section class="body-section">\n${runningHead}\n${contentHtml}\n${footnote}\n</section>`;
}

// ─── Top-level parser ────────────────────────────────────────────────────────

// Extract top-level ::: blocks, properly handling nested ::: blocks inside them.
// Top-level blocks are: intro, chapter, closing (they contain nested blocks).
// Nested blocks are: pull-quote, stats, col-list, field (processed inside renderBodyContent).
const TOP_LEVEL_TYPES = new Set(['intro', 'chapter', 'closing']);

function parseMarkdown(md) {
  const chunks = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Check for top-level block opener
    const openMatch = line.match(/^:::([\w-]+)(?:\{([^}]*)\})?$/);
    if (openMatch && TOP_LEVEL_TYPES.has(openMatch[1])) {
      const blockType = openMatch[1];
      const attrStr = openMatch[2] || '';
      i++;
      // Collect content until matching close, counting nesting
      const contentLines = [];
      let depth = 1;
      while (i < lines.length) {
        const inner = lines[i];
        if (inner.match(/^:::([\w-]+)(?:\{[^}]*\})?$/)) {
          depth++;
          contentLines.push(inner);
        } else if (inner === ':::') {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
          contentLines.push(inner);
        } else {
          contentLines.push(inner);
        }
        i++;
      }
      chunks.push({
        type: blockType,
        attrs: parseAttrs(attrStr),
        content: contentLines.join('\n'),
      });
    } else {
      // Accumulate raw lines
      const rawLines = [];
      while (i < lines.length) {
        const inner = lines[i];
        const m = inner.match(/^:::([\w-]+)(?:\{[^}]*\})?$/);
        if (m && TOP_LEVEL_TYPES.has(m[1])) break;
        rawLines.push(inner);
        i++;
      }
      const raw = rawLines.join('\n').trim();
      if (raw) chunks.push({ type: 'raw', content: raw });
    }
  }

  return chunks;
}

function renderChunks(chunks) {
  return chunks.map(chunk => {
    switch (chunk.type) {
      case 'intro':
        return renderIntro(chunk.attrs, chunk.content);
      case 'chapter':
        return renderChapter(chunk.attrs, chunk.content);
      case 'closing':
        return renderClosing(chunk.attrs, chunk.content);
      case 'raw':
        return chunk.content;
      default:
        return '';
    }
  }).join('\n');
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validate(newHtml, oldHtml) {
  function count(html, re) {
    return (html.match(re) || []).length;
  }

  const metrics = [
    { name: 'headings (h2)', re: /<h2[^>]*>/g },
    { name: 'pull-quotes', re: /class="pull-quote"/g },
    { name: 'stat blocks', re: /class="stat-block"/g },
    { name: 'col-lists', re: /class="col-list"/g },
    { name: 'body-sections', re: /class="body-section/g },
    { name: 'chapter-covers', re: /class="page chapter-cover/g },
    { name: 'field-blocks', re: /class="field-block"/g },
  ];

  let allOk = true;
  for (const m of metrics) {
    const newCount = count(newHtml, m.re);
    const oldCount = count(oldHtml, m.re);
    const diff = Math.abs(newCount - oldCount);
    const threshold = Math.ceil(oldCount * 0.05);
    const ok = diff <= Math.max(threshold, 1);
    if (!ok) allOk = false;
    const icon = ok ? '✓' : '✗';
    console.log(`  ${icon} ${m.name}: ${newCount} (was ${oldCount})`);
  }

  if (!allOk) {
    console.warn('\n⚠️  Warning: element counts differ by more than 5% from previous version.');
    console.warn('   Review the output carefully before committing.');
  } else {
    console.log('\n✓ Structural validation passed.');
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const md = fs.readFileSync(MD_FILE, 'utf8');
  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

  // Check if old HTML exists for validation
  let oldHtml = '';
  if (fs.existsSync(OUT_FILE)) {
    oldHtml = fs.readFileSync(OUT_FILE, 'utf8');
  }

  console.log('Parsing playbook.md...');
  const chunks = parseMarkdown(md);
  const content = renderChunks(chunks);

  const output = template.replace('{{CONTENT}}', content);

  fs.writeFileSync(OUT_FILE, output, 'utf8');
  console.log(`Written: ${OUT_FILE}`);

  if (oldHtml) {
    console.log('\nValidation (new vs previous):');
    validate(output, oldHtml);
  }
}

main();
