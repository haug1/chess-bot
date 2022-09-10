import { log } from "../src/logger.js";
import * as tests from "./tests/index.js";

// iterates all tests as exported by index.js
// runs all the functions of each test class
async function main() {
  const suiteTestStart = new Date();

  for (const testName of Object.keys(tests)) {
    log("Running test class " + testName);

    const classTestStart = new Date();
    const testPrototype = tests[testName].prototype;
    const testFunctions = Object.getOwnPropertyNames(testPrototype).filter(
      (s) => !["before", "constructor"].includes(s)
    );

    typeof testPrototype.before === "function" &&
      (await testPrototype.before());

    for (const funcName of testFunctions) {
      log(`Running test function '${testName}.${funcName}'`);

      const functionTestStart = new Date();
      const testResult = await testPrototype[funcName]();

      if (testResult.expectedResult === testResult.result) {
        log(
          `test '${testName}.${funcName}' completed in ${
            new Date() - functionTestStart
          } ms`
        );
      } else {
        throw new Error(
          `ERROR: ${testName}.${funcName} test assertion failed. ${testResult.expectedResult} is not equal to ${testResult.result}`
        );
      }
    }

    log(`class '${testName}' completed in ${new Date() - classTestStart} ms`);
  }

  log(`test suite completed in ${new Date() - suiteTestStart} ms`);
  process.exit(0);
}

main();
