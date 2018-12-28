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
  await runAllTests();
}

async function runAllTests() {
  await test("five-sentences-text");
  await test("short-text");
  await test("text-with-filtered-sentences");
}

async function test(name) {
  const readFile = promisify(fs.readFile);
  const unlink = promisify(fs.unlink);
  const expectedOutput = await readFile(`__test__/${name}.output.txt`, 'utf8');
  const tempTestOutputFile = `test-output-${name}.tmp.txt`;
  await new Promise((resolve, reject) => {
    const stream = streamToGoogleQuery({
      inputStream: fs.createReadStream(`__test__/${name}.txt`),
      outputStream: fs.createWriteStream(tempTestOutputFile)
    });
    stream.on("error", reject);
    stream.on("close", resolve);
  });
  const testOutput = await readFile(tempTestOutputFile, 'utf8');

  assert(testOutput === expectedOutput, `output does not match expectation in test ${name}:\n${testOutput}\n!==\n${expectedOutput}`);
  await unlink(tempTestOutputFile);
}
