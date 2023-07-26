import { Config } from "jest"

const config = async (): Promise<Config> => ({
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {},
  moduleDirectories: ["node_modules", "<rootDir>"],
  rootDir: ".",
  extensionsToTreatAsEsm: [".ts"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
})

export default config
