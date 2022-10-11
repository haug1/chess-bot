import { expect } from "chai";
import { error, log } from "../src/logger.js";
import * as tests from "./tests/index.js";

// iterates all tests as exported by index.js
// runs all the functions of each test class
// following hook functions exist:
//  - before, runs before each class
//  - beforeEach, runs before each test function
//  - after, runs before each class
//  - afterEach, runs after each test function
async function main() {
  const suiteTestStart = new Date();

  const testClassNames = Object.keys(tests);
  for (const testClassName of testClassNames) {
    log("Running test class " + testClassName);

    const classTestStart = new Date();
    const testPrototype = tests[testClassName].prototype;
    const testFunctions = Object.getOwnPropertyNames(testPrototype).filter(
      (s) =>
        !["before", "beforeEach", "after", "afterEach", "constructor"].includes(
          s
        )
    );

    typeof testPrototype.before === "function" &&
      (await testPrototype.before());

    for (const funcName of testFunctions) {
      log(`Running test function '${testClassName}.${funcName}'`);

      typeof testPrototype.beforeEach === "function" &&
        (await testPrototype.beforeEach());

      const functionTestStart = new Date();
      const testResult = await testPrototype[funcName]();
      try {
        expect(testResult.expectedResult).eql(testResult.result);
        log(
          `test '${testClassName}.${funcName}' completed in ${
            new Date() - functionTestStart
          } ms`
        );
      } catch (e) {
        if (e.name === "AssertionError") {
          error(
            `ERROR: ${testClassName}.${funcName} test assertion failed. ${testResult.expectedResult} is not equal to ${testResult.result}`
          );
          error({
            expected: e.actual,
            actual: e.expected,
          });
          process.exit(1);
        } else {
          throw e;
        }
      }

      typeof testPrototype.afterEach === "function" &&
        (await testPrototype.afterEach());
    }

    typeof testPrototype.after === "function" && (await testPrototype.after());

    log(
      `class '${testClassName}' completed in ${new Date() - classTestStart} ms`
    );
  }

  log(`test suite completed in ${new Date() - suiteTestStart} ms`);
  process.exit(0);
}

main();
