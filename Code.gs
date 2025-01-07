function generateReport() {
  // Step 1: Fetch data using your existing API function
  const apiData = getReport(); // Call your existing working API function

  // Step 2: Log the raw data for debugging
  Logger.log("Raw API Data: " + JSON.stringify(apiData));

  // Step 3: Validate and process the data
  let dataArray;
  if (!apiData) {
    Logger.log("Error: API data is undefined or null.");
    return;
  } else if (Array.isArray(apiData)) {
    dataArray = apiData; // Directly use if it's already an array
  } else if (apiData.data && Array.isArray(apiData.data)) {
    dataArray = apiData.data; // Extract the array if it's wrapped in an object
  } else {
    Logger.log("Error: API data is not in a recognizable format.");
    return;
  }

  // Step 4: Check if the data array is empty
  if (dataArray.length === 0) {
    Logger.log("Error: Data array is empty.");
    return;
  }

  // Log the number of records for debugging
  Logger.log(`Number of records fetched: ${dataArray.length}`);

  // Step 5: Extract unique keys for column headers
  const allKeys = extractUniqueKeys(dataArray);

  if (allKeys.length === 0) {
    Logger.log("Error: No unique keys found in the data.");
    return;
  }

  // Step 6: Create a new Google Spreadsheet
  const spreadsheet = SpreadsheetApp.create("API Report");
  const sheet = spreadsheet.getActiveSheet();

  // Write headers
  sheet.getRange(1, 1, 1, allKeys.length).setValues([allKeys]);

  // Step 7: Write data in chunks (to handle large datasets)
  const chunkSize = 500; // Number of rows per chunk
  for (let i = 0; i < dataArray.length; i += chunkSize) {
    const chunk = dataArray.slice(i, i + chunkSize).map(item =>
      allKeys.map(key => item[key] || "") // Fill missing keys with empty strings
    );
    sheet.getRange(i + 2, 1, chunk.length, allKeys.length).setValues(chunk);
    Logger.log(`Written rows ${i + 1} to ${i + chunk.length}`);
  }

  Logger.log(`Spreadsheet created: ${spreadsheet.getUrl()}`);
}

// Function to extract unique keys from an array of JSON objects
function extractUniqueKeys(dataArray) {
  const allKeys = [];
  dataArray.forEach(item => {
    if (item && typeof item === "object") { // Ensure each item is a valid object
      Object.keys(item).forEach(key => {
        if (!allKeys.includes(key)) {
          allKeys.push(key); // Add unique keys
        }
      });
    }
  });
  return allKeys;
}