const stream = require("stream");

streamToGoogleQuery(process.stdin, 5, 50);

function streamToGoogleQuery(inputStream, sentences, minimumLength) {
  process.stdout.on("error", () => {});
  return inputStream
    .pipe(tokenizeSentences())
    .pipe(filterRandomly(sentences, minimumLength))
    .pipe(process.stdout);
}

function tokenizeSentences() {
  return new stream.Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      chunk.toString(encoding).split(/[:.!?\n]/).forEach(sentence => {
        const maybeSentence = sentence.replace(/[^a-zäöüß\- ]/ig, "").trim();
        if (maybeSentence !== "") {
          this.push(`open https://www.google.de/search?q=${encodeURIComponent(maybeSentence)}\n`);
        }
      });
      cb();
    }
  });
}

function filterRandomly(amountOfSentences, minimumLength) {
  let counter = 0;
  return new stream.Transform({
    transform(chunk, encoding, cb) {
      if (++counter % amountOfSentences === 0 && chunk.length > minimumLength) {
        this.push(chunk);
      }
      cb();
    }
  });
}

