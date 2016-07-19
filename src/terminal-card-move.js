const SquareMove = require('./square-move')
const TerminalCardType = require('./terminal-card-type')
const getEnemyTeam = require('./get-enemy-team')
const typecheck = require('./typecheck')
const a1 = typecheck().enum(TerminalCardType, 'TerminalCardType')

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
    this._cardType = opts.cardType
  }

  _preAssert(opts) {
    super._preAssert(opts)
    this._asserts.insertAfter(
      'opts.source',
      'opts.cardType',
      () => a1.assert(opts.cardType, 'opts.cardType')
    )
    this._asserts.insertAfter(
      'opts.cardType',
      Symbol(),
      () => {
        if (!opts.team && opts.cardType === TerminalCardType.virusCheck) {
          if (!opts.source.card) {
            throw new Error(
              "Cannot auto-initialize opts.team; card not found on square."
            )
          }
          opts.team = getEnemyTeam(opts.source.card.owner)
        }
      }
    )
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
