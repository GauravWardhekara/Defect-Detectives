const fs = require('fs');
const Papa = require('papaparse');
const csv = fs.readFileSync('test.csv', 'utf8');
const results = Papa.parse(csv);
let valid = 0;
for (let i = 1; i < results.data.length; i++) {
  const row = results.data[i];
  if (!row[0] || !row[1]) continue;
  valid++;
}
console.log('Valid rows:', valid, 'Total rows:', results.data.length);
