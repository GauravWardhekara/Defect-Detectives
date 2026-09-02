const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const fetchTarget = `      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }`;
const fetchReplace = `      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to generate insights');
      }`;
code = code.replace(fetchTarget, fetchReplace);

const catchTarget = `    } catch (error) {
      console.error(error);
      setInsights("Failed to generate insights. Please check your connection and try again.");
    }`;
const catchReplace = `    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || "";
      if (errMsg.includes("API Key") || errMsg.includes("Model") || errMsg.includes("Invalid") || errMsg.includes("Missing")) {
        setAlertMessage(\`\${errMsg}. Please update your settings in the AI Configuration.\`);
        setInsights("Failed due to AI configuration error.");
      } else {
        setInsights("Failed to generate insights. Please check your connection and try again.");
      }
    }`;
code = code.replace(catchTarget, catchReplace);

fs.writeFileSync('src/components/DashboardView.tsx', code);
