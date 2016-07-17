const Team = require('./team')

const lookup = new Map(
  [
    [Team.top, Team.bottom],
    [Team.bottom, Team.top]
  ]
)

/**
 * Gets the enemy {@link Team} player.
 * @function getEnemyTeam
 * @param {Symbol} team {@link Team}
 * @returns {Symbol}
 */
module.exports = Map.prototype.get.bind(lookup)
