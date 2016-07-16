'use strict'

const tap = require('tap')
const {
  SurrenderMove,
  OnlineCardMove,
  Team
} = require('..')

tap.test('Move', t => {

  t.test('constructor', t => {
    let tests = [
      [[], "first argument required"],
      [[NaN], "first argument must be object"],
      [[{ team: NaN }], "team must be Team"]
    ]
    for (let [args, errorMessage] of tests) {
      //t.throws(() => new SurrenderMove(args[0]), errorMessage)
    }
    new SurrenderMove({ team: Team.top })
    t.end()
  })

  let move = new SurrenderMove({ team: Team.bottom })
  t.ok(move.team === Team.bottom)
  t.end()
})
