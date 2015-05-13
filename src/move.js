
var assert = require('assert')
var Square = require('./square')
var Team = require('./team')
var values = require('./util/values')

const teams = values(Team)

// Move objects are immutable.
/**
 * Represents a game move.
 * @class
 * @memberof RaiNet
 * @param {Object} opts
 * @param {Symbol} opts.player
 * @param {Square} opts.source
 */
class Move {

  constructor(opts) {

    assert(typeof(opts) === 'object', "Invalid argument: opts")
    var team = opts.team, source = opts.source
    assert(typeof(Team[team]) === 'string', "Invalid argument: opts.team")
    assert(source instanceof Square, "Invalid argument: opts.source")

    this._source = source
    this._team = team

    Object.freeze(this)
  }

  /**
   * The team who made this move.
   * @returns {Symbol} Player
   */
  get team() {
    return this._team
  }

  /**
   * The square on which this move is operated upon.
   * For online cards, this is the source square.
   * @returns {Square}
   */
  get source() {
    return this._source
  }

}

module.exports = Move
