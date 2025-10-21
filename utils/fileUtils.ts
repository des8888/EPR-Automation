import fs from 'fs';
import path from 'path';

export async function saveEPRToFile(eprNo: string) {
  const filePath = path.resolve(__dirname, '../data/eprData.json');

  // Read existing data (if file exists)
  let data: any = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  // Add or update EPR number
  data.latestEPR = eprNo;

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`EPR number ${eprNo} saved to eprData.json`);
}
