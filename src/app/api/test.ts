import { testValidations } from "./actions";

// Run the tests
testValidations()
  .then(() => {
    console.log("\nAll tests completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nTest execution failed:", error);
    process.exit(1);
  });
