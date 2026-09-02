const fs = require('fs');
let code = fs.readFileSync('src/components/TableView.tsx', 'utf8');

const targetStr = `                <td className="px-10 py-6 text-[0.95rem]">
                  <span className="px-2 py-0.5 bg-bg-base text-ink rounded text-[10px] font-bold uppercase truncate max-w-[120px] inline-block">{defect.project}</span>
                  {defect.module && (
                    <div className="text-[10px] text-ink-muted mt-1 font-medium">{defect.module}</div>
                  )}
                </td>`;

const replacementStr = `                <td className="px-10 py-6 text-[0.95rem]">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="px-2 py-0.5 bg-bg-base text-ink rounded text-[10px] font-bold uppercase truncate max-w-[120px] inline-block">{defect.project}</span>
                    {defect.module && (
                      <div className="text-[10px] text-ink-muted font-medium">{defect.module}</div>
                    )}
                    {defect.platforms && defect.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {defect.platforms.map(p => (
                          <span key={p} className="px-1.5 py-0.5 bg-black/5 border border-ink-faint text-ink-muted rounded-full text-[9px] uppercase tracking-wider">{p}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/TableView.tsx', code);
