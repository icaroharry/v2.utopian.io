module.exports = {
  globals: {
    __DEV__: true
  },
  setupTestFrameworkScriptFile: '<rootDir>/test/jest/jest.setup.js',
  noStackTrace: true,
  bail: true,
  cache: false,
  verbose: true,
  testURL: 'http://localhost:8080/',
  collectCoverage: false,
  coverageDirectory: '<rootDir>/test/jest/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/*.js',
    '<rootDir>/src/*.vue'
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
    '<rootDir>/test/jest/__tests__/**/*.spec.js',
    '<rootDir>/test/jest/__tests__/**/*.test.js'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^quasar$': '<rootDir>/node_modules/quasar-framework/dist/umd/quasar.mat.umd.min.js',
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
