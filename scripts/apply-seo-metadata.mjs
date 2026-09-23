#!/usr/bin/env node
// apply-seo-metadata.mjs — normalise SERP metadata on every English tool page.
//
// The pages inherited two competing metadata blocks from upstream:
//   1. a top block with `meta[name=title]` plus a keyword-stuffed
//      `meta[name=description]` ("★ … ★ No signup ★ …"), and
//   2. a later block after <title> with a real description added here.
// Since the starred one comes first, that is the one search engines and social
// cards consumed, and the good copy was dead weight.
//
// This script collapses both into the single block described by
// scripts/seo-metadata.mjs: one <title>, exactly one description meta, matching
// Open Graph and Twitter tags, and no fabricated social handle.
//
// Usage:
//   node scripts/apply-seo-metadata.mjs           # rewrite src/pages/*.html
//   node scripts/apply-seo-metadata.mjs --check   # fail if source is out of sync
//   node scripts/apply-seo-metadata.mjs --dry-run # report what would change

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SEO,
  SITE_PAGES,
  OG_IMAGE,
  validateSeoMetadata,
} from './seo-metadata.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');

const check = process.argv.includes('--check');
const dryRun = process.argv.includes('--dry-run');

// Attribute values are double-quoted in these files; escape for HTML.
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Replace a literal substring without letting `$&`-style patterns in the
// replacement be interpreted.
function replaceLiteral(haystack, needle, replacement) {
  return haystack.split(needle).join(replacement);
}

// Rewrite the content="" of the first <meta> matching `attrPattern`.
// Returns the new html and whether the tag was found.
function setMetaContent(html, attrPattern, value) {
  const tagRe = new RegExp(`<meta\\s+[^>]*${attrPattern}[^>]*>`, 'i');
  const match = html.match(tagRe);
  if (!match) return { html, found: false };
  const tag = match[0];
  const escaped = esc(value);
  const newTag = /content\s*=\s*"[^"]*"/i.test(tag)
    ? tag.replace(/content\s*=\s*"[^"]*"/i, `content="${escaped}"`)
    : tag.replace(/\s*\/?>$/, ` content="${escaped}" />`);
  return { html: replaceLiteral(html, tag, newTag), found: true };
}

// Drop every <meta> matching the pattern.
function dropMeta(html, attrPattern) {
  const tagRe = new RegExp(`<meta\\s+[^>]*${attrPattern}[^>]*>\\s*`, 'gi');
  return html.replace(tagRe, '');
}

// Insert `snippet` before the first of `anchors` (regexes, most specific first)
// that matches. Returns null when no anchor is present.
function insertBeforeFirst(html, anchors, snippet) {
  for (const re of anchors) {
    const match = html.match(re);
    if (match)
      return replaceLiteral(html, match[0], `${snippet}\n    ${match[0]}`);
  }
  return null;
}

function insertAfterFirst(html, anchors, snippet) {
  for (const re of anchors) {
    const match = html.match(re);
    if (match)
      return replaceLiteral(html, match[0], `${match[0]}\n    ${snippet}`);
  }
  return null;
}

// The brand banner exists in public/images but nothing referenced it, so every
// shared link had a blank preview card. Idempotent: only inserts when absent.
function ensureImageTags(html, notes) {
  if (!/<meta\s+[^>]*property="og:image"/i.test(html)) {
    const snippet =
      `<meta property="og:image" content="${OG_IMAGE.url}" />\n    ` +
      `<meta property="og:image:type" content="${OG_IMAGE.type}" />\n    ` +
      `<meta property="og:image:alt" content="${esc(OG_IMAGE.alt)}" />`;
    const placed = insertBeforeFirst(
      html,
      [
        /<meta\s+[^>]*property="og:image:width"[^>]*>/i,
        /<meta\s+[^>]*property="og:site_name"[^>]*>/i,
        /<link\s+[^>]*rel="canonical"[^>]*>/i,
      ],
      snippet
    );
    if (placed === null) notes.push('could not place og:image');
    else html = placed;
  }

  if (!/<meta\s+[^>]*name="twitter:image"/i.test(html)) {
    const snippet =
      `<meta name="twitter:image" content="${OG_IMAGE.url}" />\n    ` +
      `<meta name="twitter:image:alt" content="${esc(OG_IMAGE.alt)}" />`;
    const placed = insertAfterFirst(
      html,
      [
        /<meta\s+[^>]*name="twitter:card"[^>]*>/i,
        /<meta\s+[^>]*name="twitter:url"[^>]*>/i,
        // tools.html carries no Twitter block at all; sit next to the OG one.
        /<meta\s+[^>]*property="og:description"[^>]*>/i,
      ],
      snippet
    );
    if (placed === null) notes.push('could not place twitter:image');
    else html = placed;
  }

  return html;
}

function applyEntry(html, entry) {
  const notes = [];

  // 1. `meta[name=title]` duplicates <title> and is ignored by search engines.
  html = dropMeta(html, 'name="title"');

  // 2. We have no X/Twitter account; a handle pointing at a 404 is worse than none.
  html = dropMeta(html, 'name="twitter:site"');
  html = dropMeta(html, 'name="twitter:creator"');

  // 3. Collapse duplicate description metas, keeping the last (the one after
  //    <title> on pages that carry both blocks). Order matters: remove first,
  //    then set the surviving tag's content.
  const descRe = /<meta\s+[^>]*name="description"[^>]*>/gi;
  const descTags = html.match(descRe) || [];
  if (descTags.length === 0) {
    notes.push('no description meta found');
  } else {
    for (let i = 0; i < descTags.length - 1; i++) {
      html = replaceLiteral(html, descTags[i], '');
    }
  }

  // 4. <title>
  const titleTag = html.match(/<title[^>]*>[\s\S]*?<\/title>/i);
  if (titleTag) {
    html = replaceLiteral(
      html,
      titleTag[0],
      `<title>${esc(entry.title)}</title>`
    );
  } else {
    notes.push('no <title> found');
  }

  // 5. Description + Open Graph + Twitter. Set the tag when it exists; for the
  //    Twitter tags, insert it when the page has no Twitter block at all.
  const targets = [
    ['name="description"', entry.description, 'description', null],
    ['property="og:title"', entry.title, 'og:title', null],
    ['property="og:description"', entry.description, 'og:description', null],
    [
      'name="twitter:title"',
      entry.title,
      'twitter:title',
      [
        /<meta\s+[^>]*name="twitter:card"[^>]*>/i,
        /<meta\s+[^>]*property="og:title"[^>]*>/i,
      ],
    ],
    [
      'name="twitter:description"',
      entry.description,
      'twitter:description',
      [
        /<meta\s+[^>]*name="twitter:card"[^>]*>/i,
        /<meta\s+[^>]*property="og:description"[^>]*>/i,
      ],
    ],
  ];
  for (const [pattern, value, label, anchors] of targets) {
    const res = setMetaContent(html, pattern, value);
    if (res.found) {
      html = res.html;
      continue;
    }
    const placed = anchors
      ? insertAfterFirst(
          html,
          anchors,
          `<meta ${pattern} content="${esc(value)}" />`
        )
      : null;
    if (placed === null) notes.push(`${label} missing`);
    else html = placed;
  }

  // 6. Social preview card.
  html = ensureImageTags(html, notes);

  return { html, notes };
}

function inspect(html) {
  return {
    titles: (html.match(/<title[^>]*>/gi) || []).length,
    descriptions: (html.match(/<meta\s+[^>]*name="description"/gi) || [])
      .length,
    ogImage: (html.match(/<meta\s+[^>]*property="og:image"/gi) || []).length,
    twitterImage: (html.match(/<meta\s+[^>]*name="twitter:image"/gi) || [])
      .length,
    stars: (html.match(/[★☆]/g) || []).length,
  };
}

// Tool pages live in src/pages/; hub pages (homepage, about, privacy, category
// landing pages) sit at the repo root next to the Vite entry. 404.html is
// noindex, so it keeps its own copy.
const targets = [
  { dir: PAGES_DIR, seo: SEO, skip: new Set(), label: 'src/pages' },
  { dir: ROOT, seo: SITE_PAGES, skip: new Set(['404']), label: 'repo root' },
];

let changed = 0;
let total = 0;
const warnings = [];
const stale = [];

for (const target of targets) {
  const files = fs
    .readdirSync(target.dir)
    .filter((f) => f.endsWith('.html'))
    .sort();
  const slugs = files
    .map((f) => f.replace(/\.html$/, ''))
    .filter((s) => !target.skip.has(s));

  const problems = validateSeoMetadata(slugs, target.seo, target.label);
  if (problems.length) {
    console.error(`seo-metadata.mjs is out of sync with ${target.label}/:`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  for (const slug of slugs) {
    const filePath = path.join(target.dir, `${slug}.html`);
    const before = fs.readFileSync(filePath, 'utf8');
    const { html: after, notes } = applyEntry(before, target.seo[slug]);
    total++;
    for (const note of notes) warnings.push(`${slug}: ${note}`);

    const seen = inspect(after);
    if (seen.titles !== 1)
      warnings.push(`${slug}: ${seen.titles} <title> tags`);
    if (seen.descriptions !== 1)
      warnings.push(`${slug}: ${seen.descriptions} description metas`);
    if (seen.ogImage !== 1)
      warnings.push(`${slug}: ${seen.ogImage} og:image tags`);
    if (seen.twitterImage !== 1)
      warnings.push(`${slug}: ${seen.twitterImage} twitter:image tags`);
    if (seen.stars !== 0) warnings.push(`${slug}: ★ still present`);

    if (before === after) continue;
    changed++;
    if (check) {
      stale.push(slug);
    } else if (!dryRun) {
      fs.writeFileSync(filePath, after);
    }
  }
}

const mode = check ? 'check' : dryRun ? 'dry-run' : 'write';
if (warnings.length) {
  console.warn(`SEO metadata (${mode}) — ${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(`  - ${w}`);
}

if (check && stale.length) {
  console.error(
    `SEO metadata check FAILED: ${stale.length} page(s) do not match scripts/seo-metadata.mjs:\n` +
      stale.map((s) => `  - ${s}`).join('\n') +
      `\nRun: node scripts/apply-seo-metadata.mjs`
  );
  process.exit(1);
}

console.log(
  `SEO metadata (${mode}): ${total} pages, ${changed} ${check ? 'out of sync' : 'updated'}`
);
