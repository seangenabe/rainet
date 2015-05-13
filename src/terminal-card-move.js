
var assert = require('assert')
var Move = require('./move')
var Location = require('./location')
var TerminalCardType = require('./terminal-card-type')

/**
 * Represents a move using a terminal card.
 * @class
 * @memberof RaiNet
 * @param {Object} [opts]
 * @param {Symbol} opts.cardType TerminalCardType
 */
class TerminalCardMove extends Move {

  constructor(opts) {

    var {cardType} = opts

    assert(typeof(TerminalCardType[cardType]) === 'string', "Invalid argument: opts.cardType")

    this._cardType = cardType

    super(opts)
  }

  /**
   * The type of the terminal card.
   * @returns {Symbol} TerminalCardType
   */
  get cardType() {
    return this._cardType
  }

}

module.exports = TerminalCardMove
