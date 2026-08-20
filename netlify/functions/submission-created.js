const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  const data = payload.data || {};

  console.log("Form submitted:", data);

  try {
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      Name: data.name || '',
      Email: data.email || '',
      'Contact Preference': data['contact-preference'] || '',
      Budget: data.budget || '',
      'Submitted At': new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to write to Google Sheet:", err);
  }

  return {
    statusCode: 200,
    body: "ok"
  };
};
