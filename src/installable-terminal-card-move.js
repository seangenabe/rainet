
var TerminalCardMove = require('./terminal-card-move')

/**
 * Represents a Terminal Card move using an installable Terminal Card.
 * @class
 * @memberof RaiNet
 * @param {Object} opts
 * @param {boolean} opts.uninstall
 */
class InstallableTerminalCardMove extends TerminalCardMove {

  constructor(opts) {
    super(opts)

    this._uninstall = !!opts.uninstall
  }

  /** Whether to uninstall the terminal card instead of installing it.
   * @returns {boolean}
   */
  get uninstall() {
    return this._uninstall
  }

}

module.exports = InstallableTerminalCardMove
