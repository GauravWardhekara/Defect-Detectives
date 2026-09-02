import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf-8');

const headFonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Inter:wght@300;400;500;600&family=Space+Mono&display=swap" rel="stylesheet">`;

if (!content.includes('Cormorant+Garamond')) {
  content = content.replace('</head>', `  ${headFonts}\n  </head>`);
}

fs.writeFileSync('index.html', content);
