module.exports = {
  globals: {
    __DEV__: true
  },
	setupTestFrameworkScriptFile: '<rootDir>/__tests__/jest.setup.js',
	noStackTrace: true,
	bail: true,
	cache: false,
	verbose: true,
  testURL: 'http://localhost/',
  collectCoverage: false,
  coverageDirectory: '<rootDir>/__tests__/coverage',
  collectCoverageFrom: [
    '<rootDir>/lib/*.js',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  testMatch: [
    '<rootDir>/**/__tests__/**/*.spec.js'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^quasar$': '<rootDir>/quasar.common.js',
    '^~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '.*\\.vue$': '<rootDir>/node_modules/vue-jest',
    '.*\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue'
  ]
}
