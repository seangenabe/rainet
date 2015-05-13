
var Enum = require('symbol-enum')

/**
 * Distinguishes between players.
 * @type {Enum}
 * @memberof RaiNet
 * @property {Symbol} top
 * @property {Symbol} bottom
 */
var Team = new Enum('top', 'bottom')

module.exports = Team
