# roogle

Take random sentences out of a text and check if a search engine finds sites containing it.

Example:

```
$ cat my-text.txt | npx roogle | sh
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

## Example usage with PDFs

To get `roogle` running with PDFs, we need to do these steps:

1. [Install](#install-xpdf) [xpdf](https://www.xpdfreader.com/), as it includes the `pdftotext` command
2. Use `pdftotext` to stream the text into `roogle`
3. Open the resulting URLs

### Install xpdf

```
$ brew install xpdf
```

### Stream PDF content into roogle

```
$ pdftotext -enc UTF-8 my-pdf.pdf - | npx roogle
```

### Open the resulting URLs

If you're using MacOS, you can pipe the output into `sh` to let the OS open the URLs directly.

```
$ pdftotext -enc UTF-8 my-pdf.pdf - | npx roogle | sh
```

If you're using Linux, you might want to use `xdg-open` instead of the regular `open` to be able to pipe it into a shell.

```
$ pdftotext -enc UTF-8 my-pdf.pdf - | npx roogle --prefix 'xdg-open "https://www.google.com/search?q=' | sh
```
