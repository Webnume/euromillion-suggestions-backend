const express = require("express");
const getEuromillionList = require("./euroMillionList");

const app = express();

app.get("/", async (req, res) => {
  const getEuromillionLister = await getEuromillionList();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.status(200).json(getEuromillionLister);
});

module.exports = app;
