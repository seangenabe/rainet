
const makeError = require('make-error')

/**
 * @classdesc Thrown when an invalid move is submitted.
 * @class InvalidMoveError
 * @extends Error
 * @param {string} [message]
 */
module.exports = makeError('InvalidMoveError')
