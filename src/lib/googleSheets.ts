import { Defect, Priority, Severity, Status } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

declare const google: any;
declare const gapi: any;

const CLIENT_ID = firebaseConfig.oAuthClientId;
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';

export const initGoogleAuth = (
  onSuccess: (token: string) => void,
  onError: () => void
) => {
  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: any) => {
      if (response.error !== undefined) {
        onError();
        return;
      }
      onSuccess(response.access_token);
    },
  });
  return tokenClient;
};

// ... Wait, let's just make API calls directly with fetch to avoid needing gapi loaded perfectly.
export const fetchSheetData = async (token: string, spreadsheetId: string, range: string) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch sheet data: ${errorText}`);
  }
  return response.json();
};

export const ensureDefectsSheetExists = async (token: string, spreadsheetId: string) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    let errorDetail = 'Check permissions or if the ID is valid.';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || errorDetail;
    } catch (e) {
      // ignore
    }
    throw new Error(`Failed to access spreadsheet: ${errorDetail}`);
  }
  const sheetData = await response.json();
  
  const hasDefectsSheet = sheetData.sheets.some((s: any) => s.properties.title === 'Defects');
  
  if (!hasDefectsSheet) {
    const createResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: 'Defects',
                gridProperties: { frozenRowCount: 1 }
              }
            }
          }
        ]
      })
    });
    if (!createResponse.ok) {
      throw new Error('Failed to create the Defects sheet in the provided spreadsheet.');
    }
  }
};

export const createSpreadsheet = async (token: string, title: string) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title
      },
      sheets: [
        {
          properties: {
            title: 'Defects',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        },
        {
          properties: {
            title: 'Audit Trail',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    })
  });
  if (!response.ok) throw new Error('Failed to create spreadsheet');
  return response.json();
};

export const updateSheetValues = async (token: string, spreadsheetId: string, range: string, values: any[][]) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range,
      majorDimension: 'ROWS',
      values
    })
  });
  if (!response.ok) throw new Error('Failed to update sheet values');
  return response.json();
};

export const appendSheetValues = async (token: string, spreadsheetId: string, range: string, values: any[][]) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range,
      majorDimension: 'ROWS',
      values
    })
  });
  if (!response.ok) throw new Error('Failed to append sheet values');
  return response.json();
};

export const loadGooglePicker = (token: string, onSelect: (spreadsheetId: string) => void, onCancel: () => void) => {
  if (typeof gapi === 'undefined') {
    alert('Google API not loaded yet. Please try again in a moment.');
    onCancel();
    return;
  }
  gapi.load('picker', { callback: () => {
    const view = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS);
    view.setMimeTypes('application/vnd.google-apps.spreadsheet');
    const picker = new google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(token)
      .setDeveloperKey(firebaseConfig.apiKey)
      .setCallback((data: any) => {
        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
          const doc = data[google.picker.Response.DOCUMENTS][0];
          onSelect(doc[google.picker.Document.ID]);
        } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
          onCancel();
        }
      })
      .build();
    picker.setVisible(true);
  }});
};

// Mappers
export const defectsToRows = (defects: Defect[]): any[][] => {
  const headers = [
    'ID', 'Title', 'Description', 'Project', 'Module', 'Priority', 'Severity', 'Status',
    'Assignee', 'Reporter', 'Reported Version', 'Target Fix Version',
    'Reproduction Steps', 'Expected Behavior', 'Actual Behavior',
    'Root Cause Analysis', 'Resolution Notes', 'Comments', 'Image URL', 'Created At', 'Updated At'
  ];
  const rows = defects.map(d => [
    d.id, d.title, d.description, d.project, d.module || '', d.priority, d.severity, d.status,
    d.assignee, d.reporter, d.reportedVersion, d.targetFixVersion,
    d.reproductionSteps, d.expectedBehavior, d.actualBehavior,
    d.rootCauseAnalysis || '', d.resolutionNotes || '', d.comments || '', d.imageUrl || '', d.createdAt, d.updatedAt
  ]);
  
  // Pad with empty rows to overwrite any deleted rows in the sheet
  const emptyRow = Array(21).fill('');
  const paddedRows = [...rows];
  for (let i = 0; i < 50; i++) paddedRows.push(emptyRow);

  return [headers, ...paddedRows];
};

export const rowsToDefects = (rows: any[][]): Defect[] => {
  if (!rows || rows.length <= 1) return [];
  return rows.slice(1).filter(r => r[0]).map(r => ({
    id: r[0] || '',
    title: r[1] || '',
    description: r[2] || '',
    project: r[3] || '',
    module: r[4] || '',
    priority: (r[5] as Priority) || Priority.LOW,
    severity: (r[6] as Severity) || Severity.MINOR,
    status: (r[7] as Status) || Status.OPEN,
    assignee: r[8] || '',
    reporter: r[9] || '',
    reportedVersion: r[10] || '',
    targetFixVersion: r[11] || '',
    reproductionSteps: r[12] || '',
    expectedBehavior: r[13] || '',
    actualBehavior: r[14] || '',
    rootCauseAnalysis: r[15] || '',
    resolutionNotes: r[16] || '',
    comments: r[17] || '',
    imageUrl: r[18] || '',
    createdAt: r[19] || '',
    updatedAt: r[20] || ''
  }));
};
