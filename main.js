const puppeteer = require("puppeteer");
const fs = require("fs");

// Define your keywords here
const keywords = ["خرید کفش", "خرید کفش مردانه"];

// Function to extract information from search results
async function extractInformation(keyword) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the Google search page
  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
    { timeout: 60000 }
  );

  // Extract the information from the search results
  const results = await page.$$eval("div.g", (elements) =>
    elements.map((el) => {
      const titleElement = el.querySelector("h3");
      const urlElement = el.querySelector("a");

      const title = titleElement ? titleElement.textContent : "";
      const url = urlElement ? urlElement.getAttribute("href") : "";

      return { title, url };
    })
  );

  // Save the keyword's information to a separate JSON file
  const fileName = `${keyword}_information.json`;
  fs.writeFileSync(fileName, JSON.stringify(results, null, 2));

  await browser.close();

  return results;
}

// Function to save all information to a single file
function saveAllInformation(allInformation) {
  const fileName = "all_information.json";
  fs.writeFileSync(fileName, JSON.stringify(allInformation, null, 2));
}

// Main function to extract information for all keywords
async function extractInformationForAllKeywords() {
  const allInformation = {};

  for (const keyword of keywords) {
    const information = await extractInformation(keyword);
    allInformation[keyword] = information;
  }

  saveAllInformation(allInformation);
}

function countOccurrences(arr) {
  const occurrencesMap = new Map();

  arr.forEach((obj) => {
    const key = JSON.stringify(obj);
    occurrencesMap.set(key, (occurrencesMap.get(key) || 0) + 1);
  });

  return occurrencesMap;
}

const extractCommon = () => {
  const duplicatedData = [];
  // Read the JSON file
  fs.readFile("all_information.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    // Parse the JSON data
    const jsonData = JSON.parse(data);
    countOccurrences([
      ...jsonData[keywords[0]],
      ...jsonData[keywords[1]],
    ]).forEach((value, key) => {
      if (value >= 2) {
        duplicatedData.push(JSON.parse(key));
      }
    });
    console.log(duplicatedData);
    fs.writeFileSync("duplicated.json", JSON.stringify(duplicatedData));
  });
};

const main = async () => {
  await extractInformationForAllKeywords();
  extractCommon();
};

main();
