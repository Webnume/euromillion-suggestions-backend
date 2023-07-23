//Scrapper of Euromillion stats page
const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const cron = require("node-cron");

// start of the program
const getEuromillionList = async () => {
  // function to get the raw data
  const getRawData = (URL) => {
    return fetch(URL)
      .then((response) => response.text())
      .then((data) => {
        return data;
      });
  };

  // URL for data
  const URL =
    "https://www.fdj.fr/jeux-de-tirage/euromillions-my-million/statistiques";
  const euromillionRawData = await getRawData(URL);

  // parsing the data
  const parsedEuromillionData = cheerio.load(euromillionRawData);

  // extracting the table data
  const scrapedDataNumbers = [];
  const scrapedDataStars = [];

  //parsedEuromillion Numbers Data
  parsedEuromillionData(
    "#page-chart > section.bk-palmares.bk-expand.bk-expand-0ee5d473-1ec6-4254-b5d0-f1477fedfe83.euromillion > div > div > div.tab-content_wrapper > div.tab-content.is-active > table > tbody > tr "
  ).each((index, element) => {
    const tds = parsedEuromillionData(element).find("td");
    const numero = parsedEuromillionData(tds[0]).text();
    const nombreDeSorties = parsedEuromillionData(tds[1]).text();
    const pourcentageDeSorties = parsedEuromillionData(tds[2]).text();
    const dateDeSorties = parsedEuromillionData(tds[3]).text();

    const tableRow = {
      numero,
      nombreDeSorties,
      pourcentageDeSorties,
      dateDeSorties,
    };

    scrapedDataNumbers.push(tableRow);
  });

  //parsedEuromillion Stars Data
  parsedEuromillionData(
    "#page-chart > section.bk-palmares.bk-expand.bk-expand-0ee5d473-1ec6-4254-b5d0-f1477fedfe83.euromillion > div > div > div.tab-content_wrapper > div:nth-child(2) > table > tbody > tr"
  ).each((index, element) => {
    const tdsStars = parsedEuromillionData(element).find("td");
    const numeroStars = parsedEuromillionData(tdsStars[0]).text();
    const nombreDeSortiesStars = parsedEuromillionData(tdsStars[1]).text();
    const pourcentageDeSortiesStars = parsedEuromillionData(tdsStars[2]).text();
    const dateDeSortiesStars = parsedEuromillionData(tdsStars[3]).text();

    const tableRowStars = {
      numeroStars,
      nombreDeSortiesStars,
      pourcentageDeSortiesStars,
      dateDeSortiesStars,
    };

    scrapedDataStars.push(tableRowStars);
  });
  const allScrapedData = [scrapedDataNumbers, scrapedDataStars];

  // stringify JSON Object
  var jsonContent = JSON.stringify(allScrapedData);

  cron.schedule("* * * * 0", () => {
    // console.log('running a task every minute');
    fs.writeFile("ScrapedDataSave.json", jsonContent, "utf8", function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    });
  });

  return allScrapedData;
};

// invoking the main function
getEuromillionList();
module.exports = getEuromillionList;
