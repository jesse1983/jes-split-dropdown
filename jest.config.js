module.exports = {
  preset: 'ts-jest',
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\.(js)$": "babel-jest",
  },
  "setupFiles": [
    "<rootDir>/tests/setupTests.js"
   ],
  // testEnvironment: 'jsdom',
}
