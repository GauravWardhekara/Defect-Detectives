import fs from 'fs';
let content = fs.readFileSync('src/index.css', 'utf-8');

const themeDef = `
@theme {
  --color-bg-base: #f8f7f4;
  --color-ink: #1a1a1c;
  --color-ink-faint: rgba(26, 26, 28, 0.08);
  --color-ink-muted: rgba(26, 26, 28, 0.5);
  --color-card-bg: #ffffff;
  --font-serif: 'Cormorant Garamond', serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Space Mono', monospace;
}

body {
  background-color: var(--color-bg-base);
  color: var(--color-ink);
  font-family: var(--font-sans);
}
`;

if (!content.includes('--color-ink')) {
  content = content + themeDef;
}

fs.writeFileSync('src/index.css', content);
