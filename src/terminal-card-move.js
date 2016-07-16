'use strict'

const SquareMove = require('./square-move')
const TerminalCardType = require('./terminal-card-type')

/**
 * Initializes a new instance of TerminalCardMove.
 * @classdesc The base class for moves using a terminal card.
 * @class TerminalCardMove
 * @param {object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @param {Square} opts.source Passed to {@link SquareMove|SquareMove constructor}
 */
module.exports = class TerminalCardMove extends SquareMove {

  constructor(opts) {
    super(opts)

    let { cardType } = opts

    if (!TerminalCardType.hasValue(cardType)) {
      throw new TypeError("cardType must be a member of TerminalCardType")
    }

    this._cardType = cardType
  }

  /**
   * Returns the type of the terminal card.
   * @var {TerminalCardType} cardType
   * @memberof TerminalCardMove.prototype
   * @readonly
   */
  get cardType() {
    return this._cardType
  }

}
