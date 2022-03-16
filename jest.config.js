module.exports = {
  roots: ["<rootDir>/src/", "<rootDir>/test/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFiles: ["<rootDir>/test/.jest/setEnvVars.ts"],
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.[tj]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
};
