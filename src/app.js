// MarkLink Office — App Controller
import { createEditor, onChange, getContent, setContent, wrapSelection } from './editor/editor.js';
import { initPreview, updatePreview, updatePreviewImmediate } from './preview/preview.js';
import { registerAllPlugins } from './preview/plugins.js';
import { getRenderer } from './preview/renderer.js';
import { initSplitPane } from './ui/split-pane.js';
import { initTheme, toggleTheme, isDark } from './ui/theme-toggle.js';
import { initToolbar } from './ui/toolbar.js';
import { initSidebar, showSidebar } from './ui/sidebar.js';
import { initShortcuts } from './ui/shortcuts.js';
import { openFile, saveFile, quickSave, getCurrentFileName, setFileName } from './file/file-manager.js';
import { initDragDrop } from './file/drag-drop.js';
import { renderRecentFiles } from './file/recent-files.js';
import { openFolder } from './file/folder-tree.js';
import { printDocument } from './export/print.js';
import { exportHTML } from './export/html.js';
import { exportPDF } from './export/pdf.js';
import { t, getLang, setLang } from './core/i18n.js';

// Default welcome content
const WELCOME_MD = `# Welcome to MarkLink Office

A free **office suite** that runs in your browser. Your files never leave your computer.

## Features

- **Split View** — Edit markdown on the left, see rendered preview on the right
- **Syntax Highlighting** — Code blocks with language detection
- **Dark Mode** — Toggle with the theme button
- **File Management** — Open, save, and drag-and-drop files
- **Folder Browser** — Browse directories (Chrome/Edge)
- **Search** — Press \`Cmd+F\` to search within the editor
- **Export** — Print, PDF, or standalone HTML

## Quick Start

1. **Open a file**: Click the folder icon or press \`⌘O\`
2. **Save**: Press \`⌘S\`
3. **Toggle theme**: Click the moon/sun icon
4. **Search**: Press \`⌘F\`

## Code Block

\`\`\`javascript
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}
\`\`\`

## Table

| Feature | Status |
|---------|--------|
| Markdown Editor | Available |
| Document Editor | Coming Soon |
| Spreadsheet | Coming Soon |
| Presentation | Coming Soon |
| PDF Tools | Coming Soon |

## Math (KaTeX)

Inline: $E = mc^2$

Block:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

## Diagram (Mermaid)

\`\`\`mermaid
graph LR
    A[Open File] --> B[Edit]
    B --> C[Preview]
    C --> D{Done?}
    D -->|Yes| E[Export]
    D -->|No| B
\`\`\`

---

*Start editing to see live preview!*
`;

/**
 * Initialize the landing page
 */
function initLanding() {
  const landing = document.getElementById('landing');
  const appWrapper = document.getElementById('app-wrapper');
  const ctaBtn = document.getElementById('landing-cta');

  // Check if user has visited before — skip landing
  if (localStorage.getItem('marklink-visited')) {
    landing.classList.add('hidden');
    appWrapper.classList.remove('hidden');
    return false; // landing skipped
  }

  // Language buttons on landing
  const langEn = document.getElementById('btn-lang-en');
  const langKo = document.getElementById('btn-lang-ko');

  function updateLandingLang() {
    document.getElementById('landing-title').textContent = t('landingTitle');
    document.getElementById('landing-subtitle').textContent = t('landingSubtitle');
    ctaBtn.textContent = t('landingCta');
    document.getElementById('feat1-title').textContent = t('landingFeature1Title');
    document.getElementById('feat1-desc').textContent = t('landingFeature1Desc');
    document.getElementById('feat2-title').textContent = t('landingFeature2Title');
    document.getElementById('feat2-desc').textContent = t('landingFeature2Desc');
    document.getElementById('feat3-title').textContent = t('landingFeature3Title');
    document.getElementById('feat3-desc').textContent = t('landingFeature3Desc');
    document.getElementById('feat4-title').textContent = t('landingFeature4Title');
    document.getElementById('feat4-desc').textContent = t('landingFeature4Desc');
    document.getElementById('landing-md-label').textContent = t('landingMarkdown');
    document.getElementById('landing-md-desc').textContent = t('landingMarkdownDesc');
    document.getElementById('landing-more').textContent = t('landingMoreComing');

    langEn.classList.toggle('active', getLang() === 'en');
    langKo.classList.toggle('active', getLang() === 'ko');
  }

  langEn?.addEventListener('click', () => { setLang('en'); updateLandingLang(); });
  langKo?.addEventListener('click', () => { setLang('ko'); updateLandingLang(); });

  updateLandingLang();

  // CTA button
  ctaBtn?.addEventListener('click', () => {
    localStorage.setItem('marklink-visited', '1');
    landing.classList.add('hidden');
    appWrapper.classList.remove('hidden');
    initEditor();
  });

  return true; // landing shown
}

/**
 * Update all i18n text in the app UI
 */
function updateAppLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  const langToggle = document.getElementById('btn-lang-toggle');
  if (langToggle) langToggle.textContent = getLang().toUpperCase();
}

/**
 * Initialize the main editor
 */
let editorInitialized = false;

async function initEditor() {
  if (editorInitialized) return;
  editorInitialized = true;

  // 1. Register markdown-it plugins
  const md = getRenderer();
  await registerAllPlugins(md);

  // 2. Theme
  const savedTheme = localStorage.getItem('marklink-theme');
  const prefersDark = savedTheme === 'light' ? false : true;

  // 3. Create editor
  const editorContainer = document.getElementById('editor-container');
  createEditor(editorContainer, WELCOME_MD, prefersDark);

  // 4. Preview
  const previewContent = document.getElementById('preview-content');
  initPreview(previewContent);
  updatePreviewImmediate(WELCOME_MD);

  // 5. Editor → preview
  onChange((content) => {
    updatePreview(content);
  });

  // 6. Split pane
  const divider = document.getElementById('divider');
  const editorPane = document.getElementById('editor-pane');
  const previewPane = document.getElementById('preview-pane');
  initSplitPane(divider, editorPane, previewPane);

  // 7. Theme toggle
  initTheme();
  const themeBtn = document.getElementById('btn-theme');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // 8. Toolbar
  initToolbar();

  // 9. Sidebar
  initSidebar();

  // 10. File operations
  const fileNameEl = document.getElementById('file-name');

  function updateFileName(name) {
    setFileName(name);
    if (fileNameEl) fileNameEl.textContent = name;
    document.title = `${name} — MarkLink Office`;
  }

  function loadFile({ name, content }) {
    updateFileName(name);
    setContent(content);
    updatePreviewImmediate(content);
    renderRecentFiles(document.getElementById('recent-files'), (n) => {
      console.log('Recent file clicked:', n);
    });
  }

  const openBtn = document.getElementById('btn-open');
  if (openBtn) {
    openBtn.addEventListener('click', async () => {
      try {
        const result = await openFile();
        if (result) loadFile(result);
      } catch (e) {
        if (e.name !== 'AbortError') console.error('Open file error:', e);
      }
    });
  }

  const saveBtn = document.getElementById('btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      try {
        const result = await saveFile(getContent());
        if (result) updateFileName(result.name);
      } catch (e) {
        console.error('Save file error:', e);
      }
    });
  }

  const openFolderBtn = document.getElementById('btn-open-folder');
  if (openFolderBtn) {
    openFolderBtn.addEventListener('click', async () => {
      const tree = await openFolder(loadFile);
      if (tree) {
        const treeContainer = document.getElementById('folder-tree');
        if (treeContainer) {
          treeContainer.innerHTML = '';
          treeContainer.appendChild(tree);
        }
        showSidebar();
      }
    });
  }

  // 11. Drag and drop
  initDragDrop(loadFile);

  // 12. Export
  const exportBtn = document.getElementById('btn-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => showExportMenu(exportBtn));
  }

  // 13. Shortcuts
  initShortcuts({
    open: async () => {
      try {
        const result = await openFile();
        if (result) loadFile(result);
      } catch (e) {
        if (e.name !== 'AbortError') console.error(e);
      }
    },
    save: async () => {
      try {
        const result = await quickSave(getContent());
        if (result) updateFileName(result.name);
      } catch (e) {
        console.error(e);
      }
    },
    bold: () => wrapSelection('**'),
    italic: () => wrapSelection('*'),
    print: () => printDocument(getContent(), getCurrentFileName()),
  });

  // 14. Recent files
  renderRecentFiles(document.getElementById('recent-files'), (name) => {
    console.log('Recent file clicked:', name);
  });

  // 15. Scroll sync
  initScrollSync(editorContainer, document.getElementById('preview-container'));

  // 16. i18n for app
  updateAppLang();
}

/**
 * Initialize the app
 */
export async function initApp() {
  // Landing page
  const landingShown = initLanding();

  // Tab bar — language toggle
  const langToggle = document.getElementById('btn-lang-toggle');
  if (langToggle) {
    langToggle.textContent = getLang().toUpperCase();
    langToggle.addEventListener('click', () => {
      const next = getLang() === 'en' ? 'ko' : 'en';
      setLang(next);
      langToggle.textContent = next.toUpperCase();
      updateAppLang();
    });
  }

  // Feedback button
  const feedbackBtn = document.getElementById('btn-feedback');
  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', () => {
      window.open('https://github.com/jyc0289y-art/marklink-office/issues', '_blank');
    });
  }

  // If landing was skipped, init editor immediately
  if (!landingShown) {
    await initEditor();
  }
}

/**
 * Show export dropdown menu
 */
function showExportMenu(anchorBtn) {
  const existing = document.querySelector('.export-menu');
  if (existing) {
    existing.remove();
    return;
  }

  const menu = document.createElement('div');
  menu.className = 'export-menu';
  menu.style.cssText = `
    position: absolute;
    right: 12px;
    top: 84px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 4px;
    z-index: 100;
    min-width: 160px;
  `;

  const items = [
    { label: `🖨️ ${t('print')}`, action: () => printDocument(getContent(), getCurrentFileName()) },
    { label: `📄 ${t('exportPdf')}`, action: () => exportPDF(getContent(), getCurrentFileName()) },
    { label: `🌐 ${t('exportHtml')}`, action: () => exportHTML(getContent(), getCurrentFileName()) },
  ];

  items.forEach(({ label, action }) => {
    const item = document.createElement('button');
    item.textContent = label;
    item.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      border-radius: 4px;
    `;
    item.addEventListener('mouseenter', () => item.style.background = 'var(--hover-bg)');
    item.addEventListener('mouseleave', () => item.style.background = 'transparent');
    item.addEventListener('click', () => {
      menu.remove();
      action();
    });
    menu.appendChild(item);
  });

  document.body.appendChild(menu);

  setTimeout(() => {
    const closeHandler = (e) => {
      if (!menu.contains(e.target) && e.target !== anchorBtn) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    document.addEventListener('click', closeHandler);
  }, 0);
}

/**
 * Simple proportional scroll sync
 */
function initScrollSync(editorContainer, previewContainer) {
  if (!previewContainer) return;

  let syncing = false;

  const editorScroller = editorContainer?.querySelector('.cm-scroller');
  if (editorScroller) {
    editorScroller.addEventListener('scroll', () => {
      if (syncing) return;
      syncing = true;
      const ratio = editorScroller.scrollTop / (editorScroller.scrollHeight - editorScroller.clientHeight || 1);
      previewContainer.scrollTop = ratio * (previewContainer.scrollHeight - previewContainer.clientHeight);
      requestAnimationFrame(() => { syncing = false; });
    });
  }
}
