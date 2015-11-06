'use strict'

const Enum = require('symbol-enum')

/**
 * Distinguishes between players.
 * @var {external:SymbolEnum} Team
 * @kind constant
 * @property {Symbol} top Player Top (yellow)
 * @property {Symbol} bottom Player Bottom (blue)
 */
module.exports = new Enum('top', 'bottom')
