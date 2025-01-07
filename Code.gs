function generateReport() {
  // Step 1: Fetch data using your existing API function
  const apiData = getReport(); // Replace this with your existing working API function

  // Step 2: Validate fetched data
  if (!apiData || apiData.length === 0) {
    Logger.log("No data available to process.");
    return;
  }

  // Log the size of the data
  Logger.log(`Number of records fetched: ${apiData.length}`);

  // Step 3: Extract unique keys from JSON data (for column headers)
  const allKeys = extractUniqueKeys(apiData);

  if (allKeys.length === 0) {
    Logger.log("Error: No unique keys found in the data.");
    return;
  }

  // Step 4: Create a new Google Spreadsheet
  const spreadsheet = SpreadsheetApp.create("API Report");
  const sheet = spreadsheet.getActiveSheet();

  // Write headers
  sheet.getRange(1, 1, 1, allKeys.length).setValues([allKeys]);

  // Step 5: Write data in chunks (to handle large datasets)
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

// Your existing API fetching function (example)
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

    // Parse JSON response
    const jsonData = JSON.parse(response.getContentText());

    // Return the parsed data
    return jsonData;
  } catch (error) {
    Logger.log("Error fetching API data: " + error.message);
    return [];
  }
}