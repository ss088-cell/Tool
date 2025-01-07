function getReport() {
  // Simulated API call returning a query response
  const queryData = [
    { ID: "1", Name: "Alice", Age: 25, Location: "New York" },
    { ID: "2", Name: "Bob", Age: 30, Department: "Finance" },
    { ID: "3", Name: "Charlie", Age: 28, Location: "San Francisco" },
    { ID: "4", Name: "Diana", Age: 35 }
  ];
  
  // Log the data for reference
  Logger.log("Data: " + JSON.stringify(queryData));

  // Return the data for further processing
  return queryData;
}

function writeDataToSheet() {
  // Call getReport to fetch data
  const apiData = getReport();

  // Ensure the data is an array
  const dataArray = Array.isArray(apiData) ? apiData : [apiData];

  // Extract unique keys from the data
  const allKeys = extractUniqueKeys(dataArray);

  // Format the data: create rows with empty strings for missing keys
  const rows = dataArray.map(item => {
    return allKeys.map(key => item[key] || ""); // Fill missing values with empty strings
  });

  // Add headers as the first row
  const sheetData = [allKeys, ...rows];

  // Create a new spreadsheet
  const spreadsheet = SpreadsheetApp.create("API Report");
  const sheet = spreadsheet.getActiveSheet();

  // Write the data to the spreadsheet
  sheet.getRange(1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);

  // Log the URL of the new spreadsheet
  Logger.log(`Spreadsheet created: ${spreadsheet.getUrl()}`);
}

// Function to extract unique keys from an array of objects
function extractUniqueKeys(dataArray) {
  const allKeys = [];
  for (const item of dataArray) {
    for (const key in item) {
      if (!allKeys.includes(key)) {
        allKeys.push(key);
      }
    }
  }
  return allKeys;
}