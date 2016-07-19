const Direction = require('./direction')
const SquareMove = require('./square-move')
const typeCheck = require('./typecheck')

const a1 = typeCheck().enum(Direction, 'Direction')
const a2 = typeCheck().nullable.enum(Direction, 'Direction')
/**
 * Initializes a new instance of `OnlineCardMove`.
 * @class OnlineCardMove
 * @classdesc A move involving an online card.
 * @param {Object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @param {Square} opts.source Passed to
 * {@link SquareMove|SquareMove constructor}
 * @param {Symbol} opts.direction Direction
 * @param {Symbol} [opts.direction2] Direction
 * @param {boolean} [opts.revealCard] Whether to reveal the card,
 * if a server move. Defaults to `false`.
 */
module.exports = class OnlineCardMove extends SquareMove {

  constructor(opts) {
    super(opts)

    let { direction, direction2, revealCard } = opts
    revealCard = Boolean(revealCard)

    this._direction = direction
    this._direction2 = direction2
    this._revealCard = revealCard
  }

  _preAssert(opts) {
    super._preAssert(opts)
    this._asserts.push(
      'opts.direction',
      () => a1.assert(opts.direction, 'opts.direction')
    )
    this._asserts.push(
      'opts.direction2',
      () => a2.assert(opts.direction2, 'opts.direction2')
    )
    this._asserts.insertAfter(
      'opts.source',
      Symbol(),
      () => {
        if (!opts.team) {
          if (!opts.source.card) {
            throw new Error(
              "Cannot auto-initialize opts.team; card not found on square."
            )
          }
          opts.team = opts.source.card.owner
        }
      }
    )
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
