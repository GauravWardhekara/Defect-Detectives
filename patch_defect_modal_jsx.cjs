const fs = require('fs');
let code = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf8');

code = code.replace(
`      )}
    </div>
  );
};`,
`      )}
      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </div>
  );
};`
);

fs.writeFileSync('src/components/DefectFormModal.tsx', code);
