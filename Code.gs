function writeDataToSheet() {
  // Fetch data from the mock API
  const apiData = getReport();

  // Ensure the data is valid
  if (!apiData || apiData.length === 0) {
    Logger.log("No data available from the API.");
    return;
  }

  // Extract unique keys from the JSON data
  const allKeys = extractUniqueKeys(apiData);

  // Format the data into rows with empty strings for missing fields
  const rows = apiData.map(item => {
    return allKeys.map(key => item[key] || ""); // Use empty string for missing keys
  });

  // Add headers as the first row
  const sheetData = [allKeys, ...rows];

  // Create a new spreadsheet
  const spreadsheet = SpreadsheetApp.create("Vulnerability Report");
  const sheet = spreadsheet.getActiveSheet();

  // Write the data to the spreadsheet
  sheet.getRange(1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);

  // Log the spreadsheet URL
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

// Mock function simulating an API call with varied JSON data
function getReport() {
  return [
    {
      ID: "VULN-001",
      Desc: "SQL Injection",
      Severity: "High",
      Exploit: "Available",
      CVSS: 9.8,
      Date: "2025-01-07",
      Impact: "Data Breach",
      AffectedSystems: "Database Server",
      Remediation: "Sanitize user inputs",
      Status: "Open"
    },
    {
      ID: "VULN-002",
      Desc: "Cross-Site Scripting",
      Severity: "Medium",
      Exploit: "Unavailable",
      CVSS: 6.5,
      AffectedSystems: "Web Application",
      Impact: "Session Hijacking",
      Notes: "Validate all user inputs"
      // Missing "Date", "Remediation", and "Status"
    },
    {
      ID: "VULN-003",
      Severity: "Low",
      CVSS: 4.3,
      Date: "2025-01-10",
      Impact: "Minimal",
      Exploit: "Available",
      Status: "Closed"
      // Missing "Desc", "AffectedSystems", and "Remediation"
    },
    {
      ID: "VULN-004",
      Desc: "Broken Authentication",
      Severity: "Critical",
      CVSS: 10.0,
      Exploit: "Available",
      Date: "2025-01-15",
      AffectedSystems: "Authentication Server",
      Remediation: "Implement MFA",
      Status: "Open",
      Notes: "Ensure strong password policies"
    },
    {
      ID: "VULN-005",
      Desc: "Insecure Deserialization",
      Severity: "Critical",
      CVSS: 9.9,
      Exploit: "Available",
      AffectedSystems: "Application Server",
      Remediation: "Use secure serialization libraries",
      Impact: "Remote Code Execution",
      Status: "Open"
      // Missing "Date" and "Notes"
    }
  ];
}