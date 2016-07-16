const tap = require('tape')
const { Location } = require('..')

tap.test('constructor', t => {

  t.test('should accept null arguments', t => {
    let a = new Location()
    let b = new Location(null, 0)
    let c = new Location(0, null)
    t.ok(a.column === undefined)
    t.ok(a.row === undefined)
    t.ok(b.column === null)
    t.ok(c.row === null)
    t.end()
  })

  t.test('should construct successfully', t => {
    let loc = new Location(1, 2)
    t.ok(loc.column === 1)
    t.ok(loc.row === 2)
    t.end()
  })

  t.test('should only accept finite numbers', t => {
    t.throws(() => new Location(0, -Infinity), TypeError)
    t.throws(() => new Location(NaN, 0), TypeError)
    t.throws(() => new Location('bar', 'foo'), TypeError)
    t.end()
  })

  t.end()
})

const x = new Location(3, 4)

tap.test('column', t => {

  t.equals(x.column, 3)

  t.test('should be read-only', t => {
    x.column = 6
    t.equals(x.column, 3)
    t.end()
  })

  t.end()

})

tap.test('row', t => {

  t.equals(x.row, 4)

  t.test('should be read-only', t => {
    x.column = 5
    t.equals(x.row, 4)
    t.end()
  })

  t.end()

})
