
var assert = require('assert')
var Move = require('./move')
var Direction = require('./direction')
var values = require('./util/values')

const directions = values(Direction)

/**
 * A move involving an online card.
 * @class
 * @memberof RaiNet
 * @param {Object} opts
 * @param {Symbol} opts.direction Direction
 * @param {Symbol} [opts.direction2] Direction
 * @param {boolean} [opts.revealCard] Whether to reveal the card, if a server move. Defaults to `false`.
 */
class OnlineCardMove extends Move {

  constructor(opts) {
    super(opts)

    var direction = opts.direction, direction2 = opts.direction2, revealCard = opts.revealCard

    assert(typeof Direction[direction] === 'string', "Invalid argument: opts.direction")
    assert(direction2 == null || typeof Direction[direction2] === 'string', "Invalid argument: opts.direction2")
    revealCard = revealCard || false
    assert(typeof revealCard === 'boolean', "Invalid argument: opts.revealCard")

    this._direction = direction
    this._direction2 = direction2
    this._revealCard = revealCard
  }

  /**
   * The direction of this move.
   * @returns {Symbol} Direction
   */
  get direction() {
    return this._direction
  }

  /**
   * The direction of the second move, as allowed by a Line Boost terminal card.
   * @returns {?Symbol} Direction
   */
  get direction2() {
    return this._direction2
  }

  /**
   * Whether to reveal the card, if a server move.
   * @returns {boolean}
   */
  get revealCard() {
    return this._revealCard
  }

}

module.exports = OnlineCardMove
