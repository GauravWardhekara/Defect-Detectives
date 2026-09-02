const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target1 = `if (!response.ok) throw new Error(await response.text());`;
const replace1 = `if (!response.ok) {
        const text = await response.text();
        let errMsg = text;
        try {
          const json = JSON.parse(text);
          if (json.error && json.error.message) errMsg = json.error.message;
        } catch(e){}
        throw new Error(errMsg);
      }`;

code = code.split(target1).join(replace1);
fs.writeFileSync('server.ts', code);
