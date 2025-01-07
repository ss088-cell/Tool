function generateReport() {
  // Step 1: Call your existing API function to fetch the data
  const apiData = getReport(); // Your working API function

  // Step 2: Validate and process the fetched data
  if (!apiData) {
    Logger.log("Error: API data is undefined or null.");
    return;
  }

  // Check if the data is an array; if not, attempt to extract the inner array (e.g., if wrapped in `data`)
  let dataArray = Array.isArray(apiData) ? apiData : apiData.data;

  if (!Array.isArray(dataArray)) {
    Logger.log("Error: Processed data is not an array. Exiting.");
    return;
  }

  if (dataArray.length === 0) {
    Logger.log("Error: Data array is empty. Exiting.");
    return;
  }

  // Log the size of the data for debugging
  Logger.log(`Number of records fetched: ${dataArray.length}`);

  // Step 3: Extract unique keys for column headers
  const allKeys = extractUniqueKeys(dataArray);

  if (allKeys.length === 0) {
    Logger.log("Error: No unique keys found in the data.");
    return;
  }

  // Step 4: Create a new Google Spreadsheet
  const spreadsheet = SpreadsheetApp.create("API Report");
  const sheet = spreadsheet.getActiveSheet();

  // Write headers
  sheet.getRange(1, 1, 1, allKeys.length).setValues([allKeys]);

  // Step 5: Write data in chunks
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