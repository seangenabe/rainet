
var Enum = require('symbol-enum')

/**
 * The types of an online card.
 * @memberof RaiNet
 * @type {Enum}
 * @property {Symbol} link
 * @property {Symbol} virus
 */
const OnlineCardType = new Enum('link', 'virus')

module.exports = OnlineCardType
