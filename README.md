# roogle

Take random sentences out of a text and check if a search engine finds sites containing it.

Example:

```
$ pdftotext -enc UTF-8 some-text.pdf | npx roogle | sh
```

```
Usage: roogle [options]

Options:
  -v, --version          output the version number
  -l, --length [chars]   Minimum amount of characters in a selected sentence (default: 50)
  -n, --sentences [num]  Amount of sentences to randomly select (default: 5)
  -r, --raw              Write raw sentences without url-encode and with punctuation.
  -p, --prefix [prefix]  Add a prefix to the sentences (default: "open \"https://www.google.com/search?q=")
  -s, --suffix [suffix]  Add a suffix to the sentences (default: "\"")
  -P, --disable-prefix   Removes the prefix
  -S, --disable-suffix   Removes the suffix
  -h, --help             output usage information
```