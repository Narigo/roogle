# roogle

Take random sentences out of a text and check if a search engine finds sites containing it.

Example:

```
$ pdftotext -enc UTF-8 some-text.pdf | npx roogle | sh
```

## Options

`npx roogle 10` results in 10 "open google search for this sentence" commands to be piped into `sh`.

