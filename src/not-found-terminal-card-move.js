const Square = require('./square')
const TerminalCardMove = require('./terminal-card-move')
const TerminalCardType = require('./terminal-card-type')
const typecheck = require('./typecheck')
const a1 = typecheck().instanceof(Square)

/**
 * Initializes a new instance of `NotFoundTerminalCardMove`
 * @classdesc Represents a move using a 404 Not Found card.
 * @class NotFoundTerminalCardMove
 * @param {Object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @param {Square} opts.square Passed to
 *        {@link SqaureMove|SquareMove constructor}
 * @param {Symbol} opts.cardType Passed to
*         {@link TerminalCardMove|TerminalCardMove constructor}
 * @param {Square} opts.other The other square.
 * @param {boolean} [opts.swap] Whether to swap the cards.
 */
module.exports = class NotFoundTerminalCardMove extends TerminalCardMove {

  constructor(opts) {
    super(opts)
    this._other = opts.other
    this._swap = Boolean(opts.swap)
  }

  _preAssert(opts) {
    super._preAssert(opts)
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
    this._asserts.insertBefore(
      'opts.cardType',
      Symbol(),
      () => {
        opts.cardType = TerminalCardType.notFound
      }
    )
    this._asserts.push(Symbol(), () => a1.assert(opts.other, 'opts.other'))
  }

  /**
   * The other square.
   * @var {Square} other
   * @memberof NotFoundTerminalCardMove.prototype
   * @readonly
   */
  get other() {
    return this._other
  }

  /**
   * Whether to swap the cards.
   * @var {boolean} swap
   * @memberof NotFoundTerminalCardMove.prototype
   * @readonly
   */
  get swap() {
    return this._swap
  }

}
