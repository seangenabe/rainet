const Enum = require('symbol-enum')

/**
 * Distinguishes between directions.
 * @var {external:SymbolEnum} Direction
 * @kind constant
 * @property {Symbol} up Up
 * @property {Symbol} down Down
 * @property {Symbol} left Left
 * @property {Symbol} right Right
 */
module.exports = new Enum('up', 'down', 'left', 'right')
