import merge from 'merge'

const ts_preset = await import('./node_modules/ts-jest/jest-preset.js')

const puppeteer_preset = {
  "globalSetup": "jest-environment-puppeteer/setup",
  "globalTeardown": "jest-environment-puppeteer/teardown",
  "testEnvironment": "jest-environment-puppeteer",
  "setupFilesAfterEnv": ["expect-puppeteer"]
}

//use multiple jest presets by merging and exporting them as a single object
export default merge.recursive(ts_preset, puppeteer_preset, {
    globals: {
      'ts-jest': {
        tsConfig: 'tsconfig.test.json'
      }
    },
    testEnvironment: 'jest-environment-node'
  }
)
