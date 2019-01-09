#!/usr/bin/env node
const program = require("commander");
const streamToGoogleQuery = require("./lib.js");

program
  .version("2.0.0", "-v, --version")
  .option("-l, --length [chars]", "Minimum amount of characters in a selected sentence", 50)
  .option("-n, --sentences [num]", "Amount of sentences to randomly select", 5)
  .option("-r, --raw", "Write raw sentences without url-encode and with punctuation.")
  .option("-p, --prefix [prefix]", "Add a prefix to the sentences", 'open "https://www.google.com/search?q=')
  .option("-s, --suffix [suffix]", "Add a suffix to the sentences", '"')
  .option("-P, --disable-prefix", "Removes the prefix")
  .option("-S, --disable-suffix", "Removes the suffix")
  .parse(process.argv);

const { disablePrefix, disableSuffix, length, prefix, raw, sentences, suffix } = program;

streamToGoogleQuery({
  inputStream: process.stdin,
  maximumNumberOfSentences: sentences,
  minimumLengthOfSentence: length,
  prefix: disablePrefix ? "" : prefix,
  raw,
  suffix: disableSuffix ? "" : suffix
});
