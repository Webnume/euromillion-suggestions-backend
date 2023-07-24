const express = require("express");
const app = express();
const getEuromillionList = require("./euroMillionList");
const cors = require("cors");
const path = require("path");

// const allowedOrigins = ["https://curious-palmier-d08c6b.netlify.app/"];

const corsOptions = {
  origin: "*",
  // (origin, callback) => {
  //   if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// app.get("/", async (req, res) => {
//   const getEuromillionLister = await getEuromillionList();
//   res.status(200).json(getEuromillionLister);
// });

app.get("/ScrapedDataSave.json", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "ScrapedDataSave.json"));
});

module.exports = app;
