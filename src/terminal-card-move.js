'use strict'

const Move = require('./move')
const TerminalCardType = require('./terminal-card-type')

/**
 * Initializes a new instance of TerminalCardMove.
 * @classdesc The base class for moves using a terminal card.
 * @class TerminalCardMove
 * @param {object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @param {Square} [opts.square] Passed to {@link Move|Move constructor}
 */
module.exports = class TerminalCardMove extends Move {

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
