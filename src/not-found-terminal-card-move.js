'use strict'

const TerminalCardMove = require('./terminal-card-move')
const TerminalCardType = require('./terminal-card-type')

/**
 * Initializes a new instance of `NotFoundTerminalCardMove`
 * @classdesc Represents a move using a 404 Not Found card.
 * @class NotFoundTerminalCardMove
 * @param {Object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @param {Square} opts.square Passed to {@link SqaureMove|SquareMove constructor}
 * @param {Symbol} opts.cardType Passed to {@link TerminalCardMove|TerminalCardMove constructor}
 * @param {Square} opts.other The other square.
 * @param {boolean} [opts.swap] Whether to swap the cards.
 */
module.exports = class NotFoundTerminalCardMove extends TerminalCardMove {

  constructor(opts) {
    if (typeof opts !== 'object') {
      throw new TypeError("opts must be an object")
    }
    opts.cardType = TerminalCardType.notFound
    super(opts)

    let { other, swap } = opts

    if (!(other instanceof Square)) {
      throw new TypeError("other must be Square")
    }

    this._other = other
    this._swap = !!swap
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
