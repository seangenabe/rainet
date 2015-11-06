'use strict'

/**
 * The main namespace.
 * @namespace {object} RaiNet
 */
module.exports = {
  Board: require('./board'),
  Card: require('./card'),
  Direction: require('./direction'),
  Game: require('./game'),
  GameState: require('./game-state'),
  getEnemyTeam: require('./get-enemy-team'),
  Grid: require('./grid'),
  InstallableTerminalCardMove: require('./installable-terminal-card-move'),
  InvalidMoveError: require('./invalid-move-error'),
  Location: require('./location'),
  Move: require('./move'),
  NotFoundTerminalCardMove: require('./not-found-terminal-card-move'),
  OnlineCardMove: require('./online-card-move'),
  OnlineCardType: require('./online-card-type'),
  Square: require('./square'),
  StackCause: require('./stack-cause'),
  StackedOnlineCard: require('./stacked-online-card'),
  Team: require('./team'),
  TerminalCardMove: require('./terminal-card-move'),
  TerminalCardType: require('./terminal-card-type')
}
