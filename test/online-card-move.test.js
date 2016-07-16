'use strict'

const tap = require('tap')
const {
  OnlineCardMove,
  Team,
  Location,
  Square,
  Direction
} = require('..')

tap.test('constructor', t => {

  t.test('should be constructed ok without direction2', t => {
    let sq = new Square(new Location(6, 3))
    let move = new OnlineCardMove({
      source: sq,
      team: Team.bottom,
      direction: Direction.up
    })
    t.ok(move instanceof OnlineCardMove)
    t.end()
  })

  t.end()
})
