const Move = require('./move')
const Square = require('./square')
const typecheck = require('./typecheck')
const a1 = typecheck().nullable.instanceof(Square)

/**
 * @class SquareMove
 * @classdesc Represents a move involving a board square.
 * @param {object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @param {Square} [opts.source] The square on which this move is operated upon.
 */
module.exports = class SquareMove extends Move {

  constructor(opts) {
    super(opts)
    this._source = opts.source
  }

  _preAssert(opts) {
    super._preAssert(opts)
    // Order opts.source before opts.team so we can do automatic assigning of
    // opts.team using the source.
    this._asserts.unshift('opts.source', () => a1.assert(opts.source))
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
