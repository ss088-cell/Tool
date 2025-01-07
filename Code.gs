function createVulnerabilityReport() {
  // Fetch data from the mock API
  const apiData = fetchDataFromAPI(); // Replace with your actual API fetching logic if needed

  // Extract all unique keys from the JSON data
  const allKeys = extractUniqueKeys(apiData);

  // Create data rows with empty strings for missing fields
  const rows = apiData.map(item => {
    return allKeys.map(key => item[key] || ""); // Fill missing keys with empty strings
  });

  // Add the header row to the data
  const reportData = [allKeys, ...rows];

  // Create a new spreadsheet
  const spreadsheet = SpreadsheetApp.create("Vulnerability Report");
  const sheet = spreadsheet.getActiveSheet(); // Get the default sheet

  // Write the data to the sheet
  sheet.getRange(1, 1, reportData.length, reportData[0].length).setValues(reportData);

  // Log the URL of the new spreadsheet
  Logger.log(`New spreadsheet created: ${spreadsheet.getUrl()}`);
}

// Function to extract all unique keys from an array of objects
function extractUniqueKeys(data) {
  const allKeys = [];
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!allKeys.includes(key)) {
        allKeys.push(key);
      }
    });
  });
  return allKeys;
}

// Mock function to simulate fetching varied API data
function fetchDataFromAPI() {
  return [
    {
      ID: "VULN-001",
      Desc: "SQL Injection",
      Severity: "High",
      Date: "2025-01-01",
      ExploitAvailable: "Yes",
      CVSS: 9.8,
      AffectedSystems: "Database Server",
      Remediation: "Sanitize inputs"
    },
    {
      ID: "VULN-002",
      Desc: "Cross-Site Scripting",
      Severity: "Medium",
      CVSS: 6.5,
      AffectedSystems: "Web Application",
      Remediation: "Validate user inputs"
    },
    {
      ID: "VULN-003",
      Severity: "Low",
      Date: "2025-01-05",
      CVSS: 4.3,
      ExploitAvailable: "No"
      // Missing "Desc" and "AffectedSystems"
    },
    {
      ID: "VULN-004",
      Desc: "Broken Authentication",
      CVSS: 8.0,
      AffectedSystems: "Authentication Server",
      // Missing "Severity" and "Date"
      Notes: "Ensure proper session management"
    },
    {
      ID: "VULN-005",
      Desc: "Insecure Deserialization",
      Severity: "Critical",
      Date: "2025-01-10",
      ExploitAvailable: "Yes",
      CVSS: 10.0,
      Remediation: "Implement strong input validation",
      Impact: "Remote Code Execution"
    }
  ];
}
      