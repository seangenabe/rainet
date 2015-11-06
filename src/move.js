'use strict'

const Team = require('./team')

/**
 * Initializes a new instance of Move.
 * @class Move
 * @classdesc Represents a game move. Move objects should be considered immutable.
 * @param {object} opts
 * @param {Symbol} opts.team {@link Team} The team who made this move.
 * @param {Square} [opts.square] The square on which this move is operated upon.
 */
module.exports = class Move {

  constructor(opts) {

    if (typeof opts !== 'object') {
      throw new TypeError("opts must be an object")
    }
    let { team, source } = opts
    if (typeof Team[team] !== 'string') {
      throw new TypeError("opts.team must be a member of Team")
    }

    this._source = source
    this._team = team
  }

  /**
   * The team who executed this move.
   * @member {Symbol} team
   * @readonly
   * @memberof {Move}
   */
  get team() {
    return this._team
  }

  /**
   * The square on which this move is operated upon.
   * For online cards, this is the source square.
   * @memberof Move
   * @readonly
   * @returns {Square}
   */
  get source() {
    return this._source
  }

}
