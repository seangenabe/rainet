'use strict'

const Direction = require('./direction')
const Move = require('./move')

/**
 * Initializes a new instance of `OnlineCardMove`.
 * @class OnlineCardMove
 * @classdesc A move involving an online card.
 * @param {Object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @param {Square} [opts.square] Passed to {@link Move|Move constructor}
 * @param {Symbol} opts.direction Direction
 * @param {Symbol} [opts.direction2] Direction
 * @param {boolean} [opts.revealCard] Whether to reveal the card, if a server move. Defaults to `false`.
 */
module.exports = class OnlineCardMove extends Move {

  constructor(opts) {
    super(opts)

    let { direction, direction2, revealCard } = opts

    if (!Direction.hasValue(direction)) {
      throw new TypeError("opts.direction must be a member of Direction")
    }
    if (!(direction2 == null || Direction.hasValue(direction2))) {
      throw new TypeError(
        "opts.direction2 must be a nullable member of Direction"
      )
    }
    revealCard = !!revealCard

    this._direction = direction
    this._direction2 = direction2
    this._revealCard = revealCard
  }

  /**
   * {@link Direction} The direction of this move.
   * @var {Symbol} direction
   * @memberof OnlineCardMove.prototype
   * @readonly
   */
  get direction() {
    return this._direction
  }

  /**
   * The direction of the second move, as allowed by a Line Boost terminal card.
   * @var {?Symbol} direction2
   * @memberof OnlineCardMove.prototype
   * @readonly
   */
  get direction2() {
    return this._direction2
  }

  /**
   * Whether to reveal the card, if a server move.
   * @var {boolean} revealCard
   * @memberof OnlineCardMove.prototype
   * @readonly
   */
  get revealCard() {
    return this._revealCard
  }

}
