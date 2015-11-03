
const Move = require('./move')

/**
 * A move indicating the surrender of a team.
 */
module.exports = class SurrenderMove extends Move {

  constructor(opts) {
    super(opts)
  }

}
