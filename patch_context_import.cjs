const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

if (!code.includes('Platform')) {
  code = code.replace(
    'AppState, Defect, AuditEvent, User, AIConfig, Project',
    'AppState, Defect, AuditEvent, User, AIConfig, Project, Platform'
  );
  if (!code.includes('Platform')) {
      code = code.replace(
          'AppState, Defect, AuditEvent, User, AIConfig',
          'AppState, Defect, AuditEvent, User, AIConfig, Project, Platform'
      );
  }
  fs.writeFileSync('src/context/AppContext.tsx', code);
}
