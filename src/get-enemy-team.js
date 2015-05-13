
var Team = require('./team')

const lookup = Object.freeze({
  [Team.top]: Team.bottom,
  [Team.bottom]: Team.top
})

/**
 * Gets the enemy team.
 * @memberof RaiNet
 * @param {Symbol} Team
 * @returns {Symbol}
 */
module.exports = function getEnemyTeam(team) {
  return lookup[team]
}
