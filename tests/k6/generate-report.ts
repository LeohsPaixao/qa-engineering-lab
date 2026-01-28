const { generateSummaryReport } = require('k6-html-reporter');

try {
  const options = {
    jsonFile: './reports/performance-result.json',
    output: './reports',
  };

  generateSummaryReport(options);

} catch (error: any) {
  throw new Error('Error generating report: ' + error.message);
}
