// =============================================================================
//  build.mjs — production minifier for the static portfolio.
//
//  The site is authored as plain files in the repo root and is served that way
//  by the default "deploy from branch" Pages build. This script produces a
//  MINIFIED copy in dist/ (HTML/CSS/JS) for the optional GitHub Actions deploy
//  (.github/workflows/deploy.yml). Nothing here mutates the sources.
//
//  Safety choices (deliberately conservative — this ships to a live domain):
//   • Classic scripts are minified with toplevel:false so cross-file globals
//     (window.__x helpers, functions referenced from inline <script>s) keep
//     their names. Only real ES modules (import/export) get module-mode mangle,
//     where top-level names are module-scoped and safe to rename.
//   • HTML is whitespace/comment-collapsed with inline CSS minified, but inline
//     JS is left untouched so the <script type="importmap"> JSON and the inline
//     module/boot logic can't be broken by a JS minifier.
//   • Any file that fails to minify is copied through verbatim (never dropped).
// =============================================================================
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { minify as terserMinify } from 'terser';
import { minify as htmlMinify } from 'html-minifier-terser';
import CleanCSS from 'clean-css';

const ROOT = path.resolve('.');
const OUT = path.join(ROOT, 'dist');

// Directories/files never copied into the build.
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.github']);
const SKIP_FILES = new Set(['build.mjs', 'package.json', 'package-lock.json']);

const cleanCss = new CleanCSS({ level: 1, returnPromise: false });

let stats = { html: 0, css: 0, js: 0, copied: 0, savedBytes: 0, failed: [] };

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      files.push(...await walk(path.join(dir, e.name)));
    } else if (!SKIP_FILES.has(e.name)) {
      files.push(path.join(dir, e.name));
    }
  }
  return files;
}

function isModule(code) {
  // top-level import/export → must be minified in module mode
  return /^[ \t]*(import|export)[\s{*]/m.test(code);
}

async function minifyJs(code, rel) {
  const module = isModule(code);
  const result = await terserMinify(code, {
    module,
    compress: { passes: 2 },
    // Preserve top-level names for classic scripts so globals shared across
    // files / inline scripts keep working. Module top-level is safe to mangle.
    mangle: { toplevel: module },
    format: { comments: false },
  });
  if (!result.code) throw new Error('empty terser output');
  return result.code;
}

async function minifyHtml(code) {
  return htmlMinify(code, {
    collapseWhitespace: true,
    conservativeCollapse: true,   // keep a single space so inline layout holds
    removeComments: true,
    minifyCSS: true,
    minifyJS: false,              // protect importmap JSON + inline module/boot logic
    keepClosingSlash: true,
    caseSensitive: true,
  });
}

async function run() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const files = await walk(ROOT);
  for (const abs of files) {
    const rel = path.relative(ROOT, abs);
    const dest = path.join(OUT, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });

    const ext = path.extname(abs).toLowerCase();
    const raw = await fs.readFile(abs);

    // Only transform text assets; everything else (images, glb, mp4, fonts…)
    // is copied byte-for-byte.
    if (ext === '.js' || ext === '.css' || ext === '.html') {
      const src = raw.toString('utf8');
      try {
        let out;
        if (ext === '.js') { out = await minifyJs(src, rel); stats.js++; }
        else if (ext === '.css') {
          const r = cleanCss.minify(src);
          if (r.errors && r.errors.length) throw new Error(r.errors.join('; '));
          out = r.styles; stats.css++;
        } else { out = await minifyHtml(src); stats.html++; }
        await fs.writeFile(dest, out, 'utf8');
        stats.savedBytes += Buffer.byteLength(src) - Buffer.byteLength(out);
        continue;
      } catch (err) {
        stats.failed.push(`${rel}: ${err.message}`);
        // fall through to verbatim copy so the build never loses a file
      }
    }
    await fs.writeFile(dest, raw);
    stats.copied++;
  }

  console.log(`build → dist/`);
  console.log(`  html:${stats.html} css:${stats.css} js:${stats.js} copied:${stats.copied}`);
  console.log(`  saved ~${(stats.savedBytes / 1024 / 1024).toFixed(2)} MB across text assets`);
  if (stats.failed.length) {
    console.log(`  ${stats.failed.length} file(s) copied verbatim (minify skipped):`);
    stats.failed.forEach((f) => console.log(`    - ${f}`));
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
