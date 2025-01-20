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