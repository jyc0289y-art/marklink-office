// MarkLink Office — Internationalization
const translations = {
  en: {
    // Toolbar
    brand: 'MarkLink Office',
    openFile: 'Open File',
    saveFile: 'Save File',
    bold: 'Bold',
    italic: 'Italic',
    heading: 'Heading',
    codeBlock: 'Code Block',
    list: 'List',
    link: 'Link',
    table: 'Table',
    toggleSidebar: 'Toggle Sidebar',
    export: 'Export',
    toggleTheme: 'Toggle Theme',
    feedback: 'Send Feedback',

    // Tabs
    tabMarkdown: 'Markdown',
    tabDocument: 'Document',
    tabSheet: 'Sheet',
    tabSlide: 'Slide',
    tabPdf: 'PDF',
    comingSoon: 'Coming Soon',

    // Pane headers
    editor: 'Editor',
    preview: 'Preview',

    // Sidebar
    files: 'Files',
    openFolder: 'Open Folder',
    recent: 'Recent',

    // Export menu
    print: 'Print',
    exportPdf: 'Export as PDF',
    exportHtml: 'Export as HTML',

    // Drop zone
    dropFile: 'Drop file here',

    // Landing
    landingTitle: 'Your Free Office in the Browser',
    landingSubtitle: 'No installation. No account. Your files stay on your computer.',
    landingCta: 'Start Writing',
    landingFeature1Title: 'Zero Installation',
    landingFeature1Desc: 'Works instantly in your browser. No download needed.',
    landingFeature2Title: 'Complete Privacy',
    landingFeature2Desc: 'Files never leave your device. No cloud upload.',
    landingFeature3Title: 'Always Free',
    landingFeature3Desc: 'No subscription, no hidden fees. Free forever.',
    landingFeature4Title: 'Works Offline',
    landingFeature4Desc: 'Install as an app. Use it without internet.',
    landingMarkdown: 'Markdown Editor',
    landingMarkdownDesc: 'Live preview, math (KaTeX), diagrams (Mermaid), code highlighting, PDF/HTML export.',
    landingMoreComing: 'Document, Spreadsheet, Presentation, and PDF tools are coming next.',

    // Browser compat
    browserWarning: 'Some features (folder browser) require Chrome or Edge.',

    // Language
    language: 'Language',
  },
  ko: {
    brand: 'MarkLink Office',
    openFile: '파일 열기',
    saveFile: '파일 저장',
    bold: '굵게',
    italic: '기울임',
    heading: '제목',
    codeBlock: '코드 블록',
    list: '목록',
    link: '링크',
    table: '표',
    toggleSidebar: '사이드바 전환',
    export: '내보내기',
    toggleTheme: '테마 전환',
    feedback: '피드백 보내기',

    tabMarkdown: '마크다운',
    tabDocument: '문서',
    tabSheet: '스프레드시트',
    tabSlide: '프레젠테이션',
    tabPdf: 'PDF',
    comingSoon: '준비 중',

    editor: '편집기',
    preview: '미리보기',

    files: '파일',
    openFolder: '폴더 열기',
    recent: '최근 파일',

    print: '인쇄',
    exportPdf: 'PDF로 내보내기',
    exportHtml: 'HTML로 내보내기',

    dropFile: '파일을 여기에 놓으세요',

    landingTitle: '브라우저에서 바로 쓰는 무료 오피스',
    landingSubtitle: '설치 없이. 계정 없이. 파일은 내 컴퓨터에만 저장됩니다.',
    landingCta: '바로 시작하기',
    landingFeature1Title: '설치 불필요',
    landingFeature1Desc: '브라우저만 있으면 즉시 사용. 다운로드 필요 없음.',
    landingFeature2Title: '완벽한 프라이버시',
    landingFeature2Desc: '파일이 서버에 올라가지 않습니다. 완전 로컬.',
    landingFeature3Title: '영원히 무료',
    landingFeature3Desc: '구독 없음, 숨겨진 비용 없음. 영원히 무료.',
    landingFeature4Title: '오프라인 사용',
    landingFeature4Desc: '앱으로 설치하면 인터넷 없이도 사용 가능.',
    landingMarkdown: '마크다운 편집기',
    landingMarkdownDesc: '실시간 프리뷰, 수식(KaTeX), 다이어그램(Mermaid), 코드 하이라이팅, PDF/HTML 내보내기.',
    landingMoreComing: '문서, 스프레드시트, 프레젠테이션, PDF 도구가 곧 추가됩니다.',

    browserWarning: '일부 기능(폴더 브라우저)은 Chrome 또는 Edge가 필요합니다.',

    language: '언어',
  },
};

let currentLang = localStorage.getItem('marklink-lang') || 'en';

export function t(key) {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('marklink-lang', lang);
  }
}

export function getAvailableLangs() {
  return Object.keys(translations);
}
