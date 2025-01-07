function writeDataToSheet() {
  // Use your existing API function to fetch data
  const apiData = getReport(); // This is your working function

  // Log the fetched data for debugging
  Logger.log("Fetched Data: " + JSON.stringify(apiData));

  // Ensure the data is valid
  if (!apiData || apiData.length === 0) {
    Logger.log("No data available to process.");
    return;
  }

  // Extract unique keys from the JSON data (for headers)
  const allKeys = extractUniqueKeys(apiData);

  // Log the keys for debugging
  Logger.log("Extracted Keys: " + JSON.stringify(allKeys));

  // If no keys are found, log an error and exit
  if (allKeys.length === 0) {
    Logger.log("Error: No unique keys found in the data.");
    return;
  }

  // Format rows for the spreadsheet
  const rows = apiData.map(item => allKeys.map(key => item[key] || ""));

  // Add headers as the first row
  const sheetData = [allKeys, ...rows];

  // Log the final data to write for debugging
  Logger.log("Final Data to Write: " + JSON.stringify(sheetData));

  // Create a new Google Spreadsheet
  const spreadsheet = SpreadsheetApp.create("API Data Report");
  const sheet = spreadsheet.getActiveSheet();

  // Write the data to the sheet
  sheet.getRange(1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);

  // Log the URL of the newly created spreadsheet
  Logger.log(`Spreadsheet created: ${spreadsheet.getUrl()}`);
}

// Function to extract all unique keys from an array of JSON objects
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