'use strict'

const Move = require('./move')
const Square = require('./square')

/**
 * @class SquareMove
 * @classdesc Represents a move involving a board square.
 * @param {object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @param {Square} [opts.square] The square on which this move is operated upon.
 */
module.exports = class SquareMove extends Move {

  constructor(opts) {
    super(opts)
    let { source } = opts
    if (!(source == null || source instanceof Square)) {
      throw new TypeError("opts.source must be a Square")
    }
    this._source = source
  }

  /**
   * The square on which this move is operated upon.
   * For online cards, this is the source square.
   * @memberof SquareMove
   * @readonly
   * @returns {Square}
   */
  get source() {
    return this._source
  }

}
