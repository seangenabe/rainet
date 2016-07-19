const Team = require('./team')
const KeyedList = require('./keyed-list')
const typecheck = require('./typecheck')
const a1 = typecheck().object
const a2 = typecheck().enum(Team, 'Team')

/**
 * @class Move
 * @classdesc Represents a game move. Move objects should be considered
 * immutable.
 * @param {object} opts
 * @param {Symbol} opts.team {@link Team} The team who made this move.
 */
module.exports = class Move {

  constructor(opts) {
    // Create assert list
    this._asserts = new KeyedList()
    this._asserts.push('opts', () => a1.assert(opts, 'opts'))
    this._asserts.push('opts.team', () => a2.assert(opts.team, 'opts.team'))

    // Give a chance for derived classes to insert their own assertations.
    this._preAssert(opts)

    // Evaluate all assertations.
    for (let assert of this._asserts) {
      assert()
    }

    this._team = opts.team
  }

  _preAssert(/* opts */) {}

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
