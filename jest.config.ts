/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		".+\\.ts": "ts-jest",
	},
	transformIgnorePatterns: [],
  setupFilesAfterEnv: ["<rootDir>/test/mocks/mock-env.ts"],
};
