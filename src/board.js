
var assert = require('assert')
var Grid = require('./grid')
var Square = require('./square')
var Location = require('./location')
var Team = require('./team')
var Direction = require('./direction')
var values = require('./util/values')

const teams = values(Team)
const directions = values(Direction)

/**
 * The game board
 * @class
 * @memberof RaiNet
 */
class Board {

  /**
   * The grid.
   * @returns {Grid}
   */
  get grid() {
    return this._grid
  }

  /**
   * Server squares, keyed by team.
   * @returns {Object.<Symbol, Square>}
   */
  get server() {
    return this._server
  }

  /**
   * Stack areas, keyed by team.
   * @returns {Object.<Symbol, StackedOnlineCard[]>}
   */
  get stackArea() {
    return this._stackArea
  }

  /**
   * Starting squares, keyed by team.
   * @returns {Object.<Symbol, Square[]>}
   */
  get startingSquares() {
    return this._grid.startingSquares
  }

  constructor() {

    // Initialize grid.
    this._grid = new Grid()

    // Initialize server.
    this._server = {}
    for (let team of teams) {
      var serverSquare = new Square(Location.null)
      this._server[team] = serverSquare
    }

    // Initialize stack area.
    this._stackArea = {}
    for (let team of teams) {
      this._stackArea[team] = []
    }

    // Initialize lookup for grid.
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (let colIndex = 0; colIndex < 8; colIndex++) {
        ((rowIndex, colIndex) => {
          let location = new Location(rowIndex, colIndex)
          var sq = this._grid.lookup(location)

          for (let direction of directions) {
            sq.adjacentSquares[direction] = this._grid.lookup(Location.shift(location, direction))
          }
        })(rowIndex, colIndex)
      }
    }

    // Connect grid to server squares.
    for (let args of [
      [0, 3, Direction.up, Team.top],
      [0, 4, Direction.up, Team.top],
      [7, 3, Direction.down, Team.bottom],
      [7, 4, Direction.down, Team.bottom]
    ]) {
      this._setServerAdjacent.apply(this, args)
    }

    // Lock squares.
    for (let square of this._grid.squares) {
      square.endInitialize()
    }
    for (let team of teams) {
      this._server[team].endInitialize()
    }
  }

  /**
   * Convenience method to create connections between grid squares and server squares.
   * @param {number} row
   * @param {number} col
   * @param {Symbol} direction Direction
   * @param {Symbol} team Team
   * @private
   */
  _setServerAdjacent(row, col, direction, team) {

    assert(typeof(row) === 'number')
    assert(typeof(col) === 'number')
    assert(typeof(Direction[direction]) === 'string')
    assert(typeof(Team[team]) === 'string')

    this._grid.columns[col][row].adjacentSquares[direction] = this._server[team]
  }

}

module.exports = Board
