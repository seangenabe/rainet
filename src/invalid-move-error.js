
var makeError = require('make-error')

/**
 * Thrown when an invalid move is submitted.
 * @class
 * @memberof RaiNet
 * @param {string} [message]
 * @extends Error
 */
var InvalidMoveError = makeError('InvalidMoveError')

module.exports = InvalidMoveError
