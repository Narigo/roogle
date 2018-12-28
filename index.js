#!/usr/bin/env node
const streamToGoogleQuery = require("./lib.js");

const maximumNumberOfSentences = process.argv[2] || 5;
const searchPrefix = process.argv[3] || "https://www.google.com/search?q=";

streamToGoogleQuery({
  inputStream: process.stdin,
  maximumNumberOfSentences,
  minimumLengthOfSentence: 50,
  searchPrefix
});
