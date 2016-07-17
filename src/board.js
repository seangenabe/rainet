const Direction = require('./direction')
const Grid = require('./grid')
const Location = require('./location')
const Square = require('./square')
const Team = require('./team')

/**
 * @classdesc The game board
 * @class Board
 */
module.exports = class Board {

  /**
   * The grid.
   * @var {Grid} grid
   * @readonly
   * @memberof Board.prototype
   */
  get grid() {
    return this._grid
  }

  /**
   * Server squares, keyed by team.
   * @var {Map.<Symbol, Square>} server
   * @readonly
   * @memberof Board.prototype
   */
  get server() {
    return this._server
  }

  /**
   * Stack areas, keyed by team.
   * @var {Map.<Symbol, StackedOnlineCard[]>} stackArea
   * @readonly
   * @memberof Board.prototype
   */
  get stackArea() {
    return this._stackArea
  }

  /**
   * Starting squares, keyed by team.
   * @var {Map.<Symbol, Square[]>} startingSquares
   * @readonly
   * @memberof Board.prototype
   */
  get startingSquares() {
    return this._grid.startingSquares
  }

  constructor() {

    // Initialize grid.
    this._grid = new Grid()

    // Initialize server.
    this._server = new Map()
    for (let team of Team.values()) {
      let serverSquare = new Square(Location.null)
      this._server.set(team, serverSquare)
    }

    // Initialize stack area.
    this._stackArea = new Map()
    for (let team of Team.values()) {
      this._stackArea.set(team, [])
    }

    // Initialize lookup for grid.
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (let colIndex = 0; colIndex < 8; colIndex++) {
        ((rowIndex, colIndex) => {
          let location = new Location(rowIndex, colIndex)
          let sq = this._grid.lookup(location)

          for (let direction of Direction.values()) {
            sq.adjacentSquares.set(
              direction,
              this._grid.lookup(Location.shift(location, direction))
            )
          }
        })(rowIndex, colIndex)
      }
    }

    // Connect grid to server squares.
    this._setServerAdjacent(0, 3, Direction.up, Team.top)
    this._setServerAdjacent(0, 4, Direction.up, Team.top)
    this._setServerAdjacent(7, 3, Direction.up, Team.bottom)
    this._setServerAdjacent(7, 4, Direction.up, Team.bottom)
  }

  /**
   * Convenience method to create connections between grid squares and server squares.
   * @ignore
   * @param {number} row
   * @param {number} col
   * @param {Symbol} direction Direction
   * @param {Symbol} team Team
   */
  _setServerAdjacent(row, col, direction, team) {
    this._grid.columns[col][row]
      .adjacentSquares[direction] = this._server[team]
  }

}
