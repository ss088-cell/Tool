function handleLargeAPIData() {
  const apiData = getReport(); // Replace with your actual API function

  if (!apiData || apiData.length === 0) {
    Logger.log("No data available to process.");
    return;
  }

  if (apiData.length > 100000) { // Example threshold
    Logger.log("Data too large for Google Sheets. Saving to a file.");
    saveLargeDataToFile(apiData);
  } else {
    Logger.log("Data size manageable. Writing to Google Sheets in chunks.");
    writeDataInChunks(apiData);
  }
}

function writeDataInChunks(apiData) {
  const allKeys = extractUniqueKeys(apiData);
  const sheetData = apiData.map(item => allKeys.map(key => item[key] || ""));

  const spreadsheet = SpreadsheetApp.create("Large API Data Report");
  const sheet = spreadsheet.getActiveSheet();

  // Write headers
  sheet.getRange(1, 1, 1, allKeys.length).setValues([allKeys]);

  // Write data in chunks
  const chunkSize = 500;
  for (let i = 0; i < sheetData.length; i += chunkSize) {
    const chunk = sheetData.slice(i, i + chunkSize);
    sheet.getRange(i + 2, 1, chunk.length, allKeys.length).setValues(chunk);
    Logger.log(`Written rows ${i + 1} to ${i + chunk.length}`);
  }

  Logger.log(`Spreadsheet created: ${spreadsheet.getUrl()}`);
}

function saveLargeDataToFile(apiData) {
  const jsonString = JSON.stringify(apiData);
  const file = DriveApp.createFile("Large_API_Data.json", jsonString, MimeType.PLAIN_TEXT);
  Logger.log(`Large data saved to file: ${file.getUrl()}`);
}

function extractUniqueKeys(dataArray) {
  const allKeys = [];
  dataArray.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!allKeys.includes(key)) {
        allKeys.push(key);
      }
    });
  });
  return allKeys;
}