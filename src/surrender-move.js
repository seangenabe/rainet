const Move = require('./move')

/**
 * Initializes a new instance of `SurrenderMove`.
 * @classdesc A move indicating the surrender of a team.
 * @class SurrenderMove
 * @param {object} opts
 * @param {Symbol} opts.team Passed to {@link Move|Move constructor}
 * @extends Move
 */
module.exports = class SurrenderMove extends Move {}
