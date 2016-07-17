const Team = require('./team')
const typecheck = require('./typecheck')
const a1 = typecheck().object
const a2 = typecheck().enum(Team, 'Team')

/**
 * @class Move
 * @classdesc Represents a game move. Move objects should be considered immutable.
 * @param {object} opts
 * @param {Symbol} opts.team {@link Team} The team who made this move.
 */
module.exports = class Move {

  constructor(opts) {
    a1.assert(opts, 'opts')
    let { team } = opts
    a2.assert(team, 'opts.team')

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
