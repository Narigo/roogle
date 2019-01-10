const assert = require("assert");
const fs = require("fs");
const { promisify } = require("util");
const streamToGoogleQuery = require("./lib.js");

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function run() {
  const readFile = promisify(fs.readFile);
  const unlink = promisify(fs.unlink);

  return runAllTests();

  async function runAllTests() {
    await test("five-sentences-text", {});
    await test("short-text", {});
    await test("text-with-filtered-sentences", {});
    await test("text-with-filtered-sentences", {});
    await test("twelve-sentences-text", { maximumNumberOfSentences: 12 });
    await test("filter-by-chars", { minimumLengthOfSentence: 53 });
    await test("raw-text-with-filtered-sentences", { prefix: "", raw: true, suffix: "" });
    await testIncludedButNotAll("twelve-sentences-text", {});
  }

  async function testIncludedButNotAll(name, options) {
    return assertAgainstOutput(name, options, (expectedOutput, testOutput) => {
      const possibilities = expectedOutput.split(/\n/).filter(line => line !== "");
      const results = testOutput.split(/\n/).filter(line => line !== "");
      for (let line of results) {
        const countedTimes = results.reduce((count, possibility) => (line === possibility ? count + 1 : count), 0);
        assert(countedTimes === 1, `counted the same line twice in the results`);
        assert(possibilities.includes(line), `line is not in possibilities!\n${line}`);
      }
      assert(
        results.length < possibilities.length,
        `results should be less than possibliities!\n${results.length} >= ${possibilities.length}`
      );
    });
  }

  async function test(name, options) {
    return assertAgainstOutput(name, options, (expectedOutput, testOutput) =>
      assert(
        testOutput === expectedOutput,
        `output does not match expectation in test ${name}:\n${testOutput}\n!==\n${expectedOutput}`
      )
    );
  }

  async function assertAgainstOutput(name, options, assertions) {
    const expectedOutput = await readFile(`__test__/${name}.expected.txt`, "utf8");
    const tempTestOutputFile = `test-output-${name}.tmp.txt`;
    await new Promise((resolve, reject) => {
      const stream = streamToGoogleQuery({
        inputStream: fs.createReadStream(`__test__/${name}.txt`),
        outputStream: fs.createWriteStream(tempTestOutputFile),
        ...options
      });
      stream.on("error", reject);
      stream.on("close", resolve);
    });
    const testOutput = await readFile(tempTestOutputFile, "utf8");

    await assertions(expectedOutput, testOutput);

    await unlink(tempTestOutputFile);
  }
}
