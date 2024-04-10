const XLSX = require('xlsx');

function extractUniqueQuestions(inputFilePath, outputFilePath) {
    // Read the Excel file
    const workbook = XLSX.readFile(inputFilePath);
    
    // Assume the data is in the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON format
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Create a map to store unique questions with their corresponding answers and scores
    const uniqueQuestions = new Map();

    // Iterate through the data and populate the map
    data.forEach(row => {
        const question = row['Question'];
        const answer = row['Answer'];
        const score = row['Score'];

        if (!uniqueQuestions.has(question)) {
            uniqueQuestions.set(question, { answer, score });
        }
    });

    // Convert the map to an array of objects
    const uniqueQuestionsArray = Array.from(uniqueQuestions, ([question, { answer, score }]) => ({ Question: question, Answer: answer, Score: score }));

    // Create a new workbook
    const newWorkbook = XLSX.utils.book_new();

    // Add a new worksheet to the workbook
    const newWorksheet = XLSX.utils.json_to_sheet(uniqueQuestionsArray);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Unique Questions');

    // Write the workbook to a file
    XLSX.writeFile(newWorkbook, outputFilePath);

    console.log('Extraction complete!');
}

// Example usage:
const inputFilePath = 'data.xlsx'; // Path to your Excel file
const outputFilePath = 'output.xlsx'; // Path to where you want to save the output Excel file
extractUniqueQuestions(inputFilePath, outputFilePath);
