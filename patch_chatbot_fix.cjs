const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

const targetStr = `        <MessageSquare className="w-6 h-6" />
      </button>
    );`;
const replacementStr = `        <MessageSquare className="w-6 h-6" />
      </button>
      </>
    );`;

code = code.replace(targetStr, replacementStr);

const bottomTarget = `      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
    </div>
  );
};
}
`;
const replaceEnd = `  return (
    <>
      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <div className="fixed bottom-28 right-16 w-96 h-[500px] bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-ink-faint flex flex-col z-50 overflow-hidden">`;

const currentEnd = `  return (
    <div className="fixed bottom-28 right-16 w-96 h-[500px] bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-ink-faint flex flex-col z-50 overflow-hidden">`;

code = code.replace(currentEnd, replaceEnd);

const finalTarget = `      </div>
    </div>
  );
};`;
const finalReplace = `      </div>
    </div>
    </>
  );
};`;

code = code.replace(finalTarget, finalReplace);

fs.writeFileSync('src/components/Chatbot.tsx', code);
