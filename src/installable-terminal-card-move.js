const TerminalCardMove = require('./terminal-card-move')

/**
 * @classdesc Represents a Terminal Card move using an installable Terminal Card.
 * @class InstallableTerminalCardMove
 * @extends TerminalCardMove
 * @param {Object} opts
 * @param {Symbol} [opts.team] Passed to {@link SquareMove|SquareMove constructor}
 * @param {Square} [opts.source] Passed to {@link SquareMove|SquareMove constructor}
 * @param {Symbol} opts.cardType Passed to {@link TerminalCardMove|TerminalCardMove constructor}
 * @param {boolean} opts.uninstall Whether to uninstall the terminal card
     instead of installing it.
 */
module.exports = class InstallableTerminalCardMove extends TerminalCardMove {

  constructor(opts) {
    super(opts)

    this._uninstall = Boolean(opts.uninstall)
  }

  _preAssert(opts) {
    super._preAssert(opts)
    this._asserts.insertAfter(
      'opts.source',
      Symbol(),
      () => {
        if (!opts.team && opts.source.card) {
          opts.team = opts.source.card.owner
        }
      }
    )
  }

  /**
   * Whether to uninstall the terminal card instead of installing it.
   * @var {boolean} uninstall
   * @memberof InstallableTerminalCardMove.prototype
   * @readonly
   */
  get uninstall() {
    return this._uninstall
  }

}
