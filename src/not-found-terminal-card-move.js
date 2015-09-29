
var assert = require('assert')
var TerminalCardMove = require('./terminal-card-move')
var Square = require('./square')

/**
 * Represents a move using a 404 Not Found card.
 * @class
 * @memberof RaiNet
 * @param {Object} opts
 * @param {Square} opts.other
 * @param {boolean} opts.swap
 */
class NotFoundTerminalCardMove extends TerminalCardMove {

  constructor(opts) {
    super(args)

    var {other, swap} = opts

    assert(other instanceof Square, "Invalid argument: opts.other")

    this._other = other
    this._swap = !!swap
  }

  /**
   * The other square.
   * @returns {Square}
   */
  get other() {
    return this._other
  }

  /**
   * Whether to swap the cards.
   * @returns {boolean}
   */
  get swap() {
    return this._swap
  }

}

module.exports = NotFoundTerminalCardMove
