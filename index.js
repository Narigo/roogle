const stream = require("stream");

streamToGoogleQuery(process.stdin, 5);

function streamToGoogleQuery(inputStream, sentences) {
  return inputStream
    .pipe(tokenizeSentences())
    .pipe(filterRandomly(sentences))
    .pipe(process.stdout);
}

function tokenizeSentences() {
  return new stream.Transform({
    objectMode: true,
    transform(chunk, encoding, cb) {
      chunk.toString(encoding).split(/[:.!?\n]/).forEach(sentence => {
        const maybeSentence = sentence.replace(/[^a-zäöüß\- ]/ig, "").trim();
        if (maybeSentence !== "") {
          this.push(maybeSentence);
          this.push("\n");
        }
      });
      cb();
    }
  });
}

function filterRandomly(amountOfSentences) {
  let counter = 0;
  return new stream.Transform({
    transform(chunk, encoding, cb) {
      if (counter++ % amountOfSentences === 0) {
        this.push(chunk);
      }
      cb();
    }
  });
}

