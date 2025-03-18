module.exports = {
  testEnvironment: "jsdom", // Simulates a browser-like environment for React
  roots: ["<rootDir>/tests"], // Ensures Jest only looks for tests inside /tests
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transpile TypeScript
    "^.+\\.(js|jsx)$": "babel-jest", // Transpile JavaScript
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/tests/jestSetup.ts"], // Adds better matchers for React Testing Library
  clearMocks: true, // Automatically resets mocks between tests
  coverageDirectory: "coverage", // Store test coverage reports in /coverage
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"], // Collects coverage from source files
};
