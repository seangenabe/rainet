
var Enum = require('symbol-enum')

/**
 *  Distinguishes between directions.
 *  @type {Enum}
 *  @memberof RaiNet
 *  @property {Symbol} up
 *  @property {Symbol} down
 *  @property {Symbol} left
 *  @property {Symbol} right
 */
var Direction = new Enum('up', 'down', 'left', 'right')

module.exports = Direction
