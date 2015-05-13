
var Enum = require('symbol-enum')

/**
 * Reasons why a card is stacked in the stack area.
 * @type {Enum}
 * @property {Symbol} infiltrated
 * @property {Symbol} captured
 * @memberof RaiNet
 */
var StackCause = new Enum('infiltrated', 'captured')

module.exports = StackCause
