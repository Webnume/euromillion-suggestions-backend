const puppeteer = require("puppeteer");

const getEuromillionList = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage(); // extracting the table data

  // Navigate the page to a URL
  await page.goto(
    "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million/statistiques"
  );

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Function to clean the data
  const cleanData = (data) => {
    if (!Array.isArray(data)) {
      throw new TypeError("Expected an array");
    }
    return data.map((item) => item.replace(/\n\t\n/g, ", "));
  };

  // numero, nombreDeSorties, %deSorties, dateDeSorties
  const scrapedData = async () =>
    await page.evaluate(() => {
      const tds = Array.from(
        document.querySelectorAll("#slot1-slice-palmares-1 tbody tr")
      );
      return tds.map((td) => td.innerText);
    });

  // Get the numbers data and clean it
  const scrapedRawDataNumbers = await scrapedData();
  const dataNumbers = cleanData(scrapedRawDataNumbers);

  // Click on the button to get the stars data
  await page.locator("button ::-p-text(Palmarès étoiles)").click();

  // Get the stars data and clean it
  const scrapedRawDataStars = await scrapedData();
  const dataStars = cleanData(scrapedRawDataStars);

  await browser.close();

  

  const allScrapedData = [dataNumbers, dataStars];

  console.log(allScrapedData);

  return allScrapedData;
};
// getEuromillionList()
module.exports = getEuromillionList;
