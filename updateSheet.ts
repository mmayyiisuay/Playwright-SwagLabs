import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1Pjl3tV0VWmOk17KvUE7KzYOKZXlSU1SXFB-jiqsdizM';

interface TestResult {
  id: string;
  status: string;
  sheetName: string;
}

export async function updateStatus(results: TestResult[]): Promise<void> {
  try {
    const resultsBySheet = results.reduce((acc, result) => {
      if (!acc[result.sheetName]) {
        acc[result.sheetName] = [];
      }
      acc[result.sheetName].push(result);
      return acc;
    }, {} as Record<string, TestResult[]>);

    await Promise.all(
      Object.entries(resultsBySheet).map(async ([sheetName, sheetResults]) => {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!B9:K`,
        });

        const rows = response.data.values || [];
        let updated = false;

        const idToRowIndex = new Map(
          rows.map((row, index) => [row[1], index])
        );

        sheetResults.forEach(({ id, status }) => {
          const rowIndex = idToRowIndex.get(id);
          if (rowIndex !== undefined) {
            rows[rowIndex][8] = status;
            updated = true;
          }
        });

        if (updated) {
          return sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!B9:K`,
            valueInputOption: 'RAW',
            requestBody: { values: rows },
          });
        }
      })
    );

    console.log('Updated successfully');
  } catch (err) {
    console.error('Update failed:', err);
    throw err; 
  }
}