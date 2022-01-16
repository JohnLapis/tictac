module.exports = {
  testMatch: ["**/tests/Unit/**/*.spec.[jt]s?(x)"],
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  }
}
