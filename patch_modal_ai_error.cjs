const fs = require('fs');
let code = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf8');

const targetStr = `      if (!response.ok) {
        throw new Error('Failed to analyze defect');
      }`;

const replacementStr = `      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to analyze defect');
      }`;

code = code.replace(targetStr, replacementStr);

const catchTarget = `    } catch (e) {
      console.error("Gemini API Error", e);
      setAlertMessage("Failed to analyze defect. Please check your connection and try again.");
    } finally {`;

const catchReplacement = `    } catch (e: any) {
      console.error("Gemini API Error", e);
      const errMsg = e.message || "";
      if (errMsg.includes("API Key") || errMsg.includes("Model") || errMsg.includes("Invalid") || errMsg.includes("Missing")) {
        setAlertMessage(\`\${errMsg}. Please update your settings in the AI Configuration.\`);
      } else {
        setAlertMessage("Failed to analyze defect. Please check your connection and try again.");
      }
    } finally {`;

code = code.replace(catchTarget, catchReplacement);

fs.writeFileSync('src/components/DefectFormModal.tsx', code);
