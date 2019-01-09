const stream = require("stream");

module.exports = streamToGoogleQuery;

function streamToGoogleQuery({
  inputStream = process.stdin,
  maximumNumberOfSentences = 5,
  minimumLengthOfSentence = 50,
  outputStream = process.stdout,
  prefix = 'open "https://www.google.com/search?q=',
  raw = false,
  suffix = '"'
}) {
  process.stdout.on("error", () => {});
  return inputStream
    .pipe(tokenizeSentences())
    .pipe(mergeAllSentences())
    .pipe(filterByMinimumLength(minimumLengthOfSentence))
    .pipe(splitArrayIntoParts(maximumNumberOfSentences))
    .pipe(selectOneRandomly())
    .pipe(toCommands({ prefix, raw, suffix }))
    .pipe(outputStream);
}

function tokenizeSentences() {
  return new stream.Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      const possibleSentences = [];
      chunk
        .toString(encoding)
        .split(/[:.!?\n]/)
        .forEach(sentence => {
          const maybeSentence = sentence.replace(/[^a-zäöüß\- ]/gi, "").trim();
          if (maybeSentence !== "") {
            possibleSentences.push(maybeSentence);
          }
        });
      this.push(possibleSentences);
      cb();
    }
  });
}

function mergeAllSentences() {
  let chunks = [];
  return new stream.Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      chunks = chunks.concat(chunk);
      cb();
    },
    flush(cb) {
      this.push(chunks);
      cb();
    }
  });
}

function filterByMinimumLength(length) {
  return new stream.Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      this.push(chunk.filter(str => length <= str.length));
      cb();
    }
  });
}

function splitArrayIntoParts(amountOfChunks) {
  return new stream.Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      const splitEvery = Math.max(chunk.length / amountOfChunks, 1);
      for (let i = 0; i * splitEvery < chunk.length; i++) {
        const from = Math.floor(i * splitEvery);
        const to = Math.floor((i + 1) * splitEvery);
        this.push(chunk.slice(from, to));
      }
      cb();
    }
  });
}

function selectOneRandomly() {
  return new stream.Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      this.push(chunk[Math.floor(Math.random() * chunk.length)]);
      cb();
    }
  });
}

function toCommands({ prefix, raw, suffix }) {
  return new stream.Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      this.push(`${prefix}${raw ? chunk : encodeURIComponent(chunk)}${suffix}\n`);
      cb();
    }
  });
}
