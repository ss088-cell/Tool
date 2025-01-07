function generateReport() {
  // Fetch the JSON data using your existing API function
  const apiData = getReport(); // Replace this with your working API function

  // Validate the fetched data
  if (!apiData || !Array.isArray(apiData)) {
    Logger.log("Error: API data is undefined or not an array.");
    return;
  }

  if (apiData.length === 0) {
    Logger.log("No data available to process.");
    return;
  }

  // Log the number of records fetched
  Logger.log(`Number of records fetched: ${apiData.length}`);

  // Extract unique keys from JSON data (column headers)
  const allKeys = extractUniqueKeys(apiData);

  if (!allKeys || allKeys.length === 0) {
    Logger.log("Error: No unique keys found in the data.");
    return;
  }

  // Create a new Google Spreadsheet
  const spreadsheet = SpreadsheetApp.create("API Report");
  const sheet = spreadsheet.getActiveSheet();

  // Write headers
  sheet.getRange(1, 1, 1, allKeys.length).setValues([allKeys]);

  // Write data in chunks (to handle large datasets)
  const chunkSize = 500; // Number of rows per chunk
  for (let i = 0; i < apiData.length; i += chunkSize) {
    const chunk = apiData.slice(i, i + chunkSize).map(item =>
      allKeys.map(key => item[key] || "") // Fill missing keys with empty strings
    );
    sheet.getRange(i + 2, 1, chunk.length, allKeys.length).setValues(chunk);
    Logger.log(`Written rows ${i + 1} to ${i + chunk.length}`);
  }

  Logger.log(`Spreadsheet created: ${spreadsheet.getUrl()}`);
}

// Function to extract unique keys from an array of JSON objects
function extractUniqueKeys(dataArray) {
  // Validate the input to ensure it's an array
  if (!Array.isArray(dataArray)) {
    Logger.log("Error: Input data is not an array.");
    return []; // Return an empty array if the input is invalid
  }

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

  return allKeys; // Return the list of unique keys
}

// Example API fetching function
function getReport() {
  const url = "https://example.com/api/vulnerabilities"; // Replace with your API URL

  const options = {
    method: "get",
    headers: {
      "Authorization": "Bearer your-api-token", // Replace with your API token
      "Content-Type": "application/json"
    }
  };

  try {
    // Fetch data from the API
    const response = UrlFetchApp.fetch(url, options);
    const jsonData = JSON.parse(response.getContentText());

    // Ensure the returned data is an array
    if (!Array.isArray(jsonData)) {
      Logger.log("Error: API did not return an array.");
      return [];
    }

    // Log the number of records fetched
    Logger.log(`Fetched ${jsonData.length} records.`);
    return jsonData;
  } catch (error) {
    Logger.log("Error fetching API data: " + error.message);
    return [];
  }
}