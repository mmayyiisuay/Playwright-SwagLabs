import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // ไฟล์ Credential JSON
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ข้อมูล Google Sheets
const spreadsheetId = '1Pjl3tV0VWmOk17KvUE7KzYOKZXlSU1SXFB-jiqsdizM'; // ใส่ ID ของ Google Sheets
const sheetName = 'Login Page'; // ชื่อ Sheet

/**
 * ฟังก์ชันอัปเดต Status ใน Google Sheets
 * @param results - ข้อมูลผลการทดสอบ
 */
export async function updateStatus(results: Array<{ id: string; status: string }>): Promise<void> {
    try {
        // ดึงข้อมูลปัจจุบันใน Google Sheets
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!B9:K`,
        });

        const rows = res.data.values || []; 

        rows.forEach((row) => {
            const result = results.find((r) => r.id === row[1]); 
            if (result) {
                row[8] = result.status;
            }
        });

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!B9:K`,
            valueInputOption: 'RAW',
            requestBody: {
                values: rows,
            },
        });

        console.log('done');
    } catch (err) {
        console.error('error :', err);
    }
}
