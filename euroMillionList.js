const puppeteer = require("puppeteer");

const getEuromillionList = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million/statistiques"
  );
  await page.setViewport({ width: 1080, height: 1024 });

  const scrapeTableData = async () =>
    await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("#slot1-slice-palmares-1 tbody tr")
      );
      return rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return Array.from(cells).map((cell) => cell.innerText);
      });
    });

  const allScrapedData = [];

  const arrayToObject = (array) => {
    return array.map((element) => {
      const [numero, nombreDeSorties, pourcentageDeSorties, dateDeSorties] =
        element;

      return {
        numero,
        nombreDeSorties,
        pourcentageDeSorties,
        dateDeSorties,
      };
    });
  };

  // Scrape numbers data
  const numbersDataArray = await scrapeTableData();
  const dataNumbers = arrayToObject(numbersDataArray);
  allScrapedData.push(dataNumbers);

  // Click on the button to get the stars data
  await page.locator("button ::-p-text(Palmarès étoiles)").click();

  // Scrape stars data
  const starsDataArray = await scrapeTableData();
  const dataStars = arrayToObject(starsDataArray);
  allScrapedData.push(dataStars);

  await browser.close();

  console.log(allScrapedData);

  return allScrapedData;
};

module.exports = getEuromillionList;

// const puppeteer = require("puppeteer");

// const getEuromillionList = async () => {
//   // Launch the browser and open a new blank page
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // Navigate the page to a URL
//   await page.goto(
//     "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million/statistiques"
//   );

//   // Set screen size
//   await page.setViewport({ width: 1080, height: 1024 });

//   // Function to clean the data
//   const cleanData = (data) => {
//     if (!Array.isArray(data)) {
//       throw new TypeError("Expected an array");
//     }
//     return data.map((item) => item.replace(/\n\t\n/g, ", "));
//   };

//   // extracting the table data
//   const scrapedDataStars = [];

//   // numero, nombreDeSorties, %deSorties, dateDeSorties
//   const scrapedData = async () =>
//     await page.evaluate(() => {
//       const tds = Array.from(
//         document.querySelectorAll("#slot1-slice-palmares-1 tbody tr")
//       );
//       return tds.map((td) => td.innerText);
//     });

//   const scrapedDataNumbersTest = [];

//   const arrayToObject = (array) => {
//     array.forEach((element) => {
//       const numero = element[0].innerText;
//       const nombreDeSorties = element[1].innerText;
//       const pourcentageDeSorties = element[2].innerText;
//       const dateDeSorties = element[3].innerText;

//       const tableRow = {
//         numero,
//         nombreDeSorties,
//         pourcentageDeSorties,
//         dateDeSorties,
//       };
//       scrapedDataNumbersTest.push(tableRow);
//     });
//   };

//   scrapedDataNumbersTest.push(arrayToObject(await scrapedData()));

//   console.log(scrapedDataNumbersTest);

//   // Get the numbers data and clean it
//   const scrapedRawDataNumbers = await scrapedData();
//   const dataNumbers = cleanData(scrapedRawDataNumbers);

//   // Click on the button to get the stars data
//   await page.locator("button ::-p-text(Palmarès étoiles)").click();

//   // Get the stars data and clean it
//   const scrapedRawDataStars = await scrapedData();
//   const dataStars = cleanData(scrapedRawDataStars);

//   await browser.close();

//   const allScrapedData = [dataNumbers, dataStars];

//   console.log(allScrapedData);

//   return allScrapedData;
// };
// getEuromillionList();
// module.exports = getEuromillionList;
