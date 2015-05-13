
var Enum = require('symbol-enum')

/**
 * Distinguishes among Terminal Cards.
 * @type {Enum}
 * @memberof RaiNet
 * @property {Symbol} lineBoost
 * @property {Symbol} firewall
 * @property {Symbol} notFound
 * @property {Symbol} virusCheck
 */
var TerminalCardType = new Enum('lineBoost', 'firewall', 'notFound', 'virusCheck')

module.exports = TerminalCardType
