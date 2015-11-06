'use strict'

const TerminalCardMove = require('./terminal-card-move')

/**
 * @classdesc Represents a Terminal Card move using an installable Terminal Card.
 * @class InstallableTerminalCardMove
 * @extends TerminalCardMove
 * @param {Object} opts
 * @param {Square} [opts.square] Passed to {@link Move|Move constructor}
 * @param {Symbol} opts.cardType Passed to {@link TerminalCardMove|TerminalCardMove constructor}
 * @param {boolean} opts.uninstall Whether to uninstall the terminal card
     instead of installing it.
 */
module.exports = class InstallableTerminalCardMove extends TerminalCardMove {

  constructor(opts) {
    super(opts)

    this._uninstall = !!opts.uninstall
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
