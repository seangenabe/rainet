'use strict'

const Team = require('./team')

/**
 * @class Move
 * @classdesc Represents a game move. Move objects should be considered immutable.
 * @param {object} opts
 * @param {Symbol} opts.team {@link Team} The team who made this move.

 */
module.exports = class Move {

  constructor(opts) {

    if (typeof opts !== 'object') {
      throw new TypeError("opts must be an object")
    }
    let { team } = opts
    if (typeof Team[team] !== 'string') {
      throw new TypeError("opts.team must be a member of Team")
    }

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

}
