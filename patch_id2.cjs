const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `            importedDefects.push({
              id: row[0],
              title: row[1],`;

const replacementStr = `            importedDefects.push({
              id: id,
              title: row[1],`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
