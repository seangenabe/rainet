
var assert = require('assert')

module.exports = function values(obj) {
  assert(typeof obj === 'object')
  return Object.keys(obj).map((key) => obj[key])
}
