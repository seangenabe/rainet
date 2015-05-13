
var assert = require('assert')

module.exports = function merge(...objs) {
  if (objs.length <= 1) return objs[0]
  var ret = objs[0]
  assert.strictEqual(typeof ret, 'object')
  for (var obj of objs.splice(1).reverse()) {
    assert.strictEqual(typeof obj, 'object')
    for (var key of Object.keys(obj)) {
      ret[key] = obj[key]
    }
  }
  return ret
}
