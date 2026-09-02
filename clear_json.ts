import fs from 'fs';
if (fs.existsSync('server-config.json')) {
  let config = JSON.parse(fs.readFileSync('server-config.json', 'utf-8'));
  config.projects = [];
  fs.writeFileSync('server-config.json', JSON.stringify(config, null, 2));
}
