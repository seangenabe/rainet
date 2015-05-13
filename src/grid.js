
var assert = require('assert')
var Location = require('./location')
var Square = require('./square')
var Team = require('./team')

/**
 * The game main board, composed of 8 columns and 8 rows.
 * @class
 * @memberof RaiNet
 */
class Grid {

  constructor() {
    var squares = []
    var rows = []
    var columns = []
    this._squares = squares
    this._rows = rows
    this._columns = columns

    for (var i = 0; i < 8; i++) {
      rows.push(new Array(8))
      columns.push(new Array(8))
    }

    for (var rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (var colIndex = 0; colIndex < 8; colIndex++) {
        var location = new Location(colIndex, rowIndex)
        var square = new Square(location)
        this._rows[rowIndex][colIndex] = square
        this._columns[colIndex][rowIndex] = square
        this._squares.push(square)
      }
    }

    var startingSquares = {}
    this._startingSquares = startingSquares
    startingSquares[Team.top] = [
      rows[0][0],
      rows[0][1],
      rows[0][2],
      rows[1][3],
      rows[1][4],
      rows[0][5],
      rows[0][6],
      rows[0][7]
    ]
    startingSquares[Team.bottom] = [
      rows[7][0],
      rows[7][1],
      rows[7][2],
      rows[6][3],
      rows[6][4],
      rows[7][5],
      rows[7][6],
      rows[7][7]
    ]
    Object.freeze(startingSquares)
  }

  /**
   * The rows of the board.
   * @returns {Square[][]}
   */
  get rows() {
    return this._rows
  }

  /**
   * The columns of the board.
   * @returns {Square[][]}
   */
  get columns() {
    return this._columns
  }

  /**
   * An array containing all squares.
   * @returns {Square[]}
   */
  get squares() {
    return this._squares
  }

  /**
   * Looks up a location
   * @param {Location} location
   * @returns {?Square} The square if found, otherwise null.
   */
  lookup(location) {
    assert(location instanceof Location)
    return (this.rows[location.row] || [])[location.column]
  }

  /**
   * Returns the starting squares for each player.
   * @returns {Object.<Symbol, Square[]>} Team => Square[]
   */
  get startingSquares() {
    return this._startingSquares
  }

  // DEBUG
  toStringDebug() {
    var Team = require('./team')
    var OnlineCardType = require('./online-card-type')
    var buffer = '\n'
    var teamChar = {
      [Team.top]: '^',
      [Team.bottom]: '%'
    }
    var typeChar = {
      [OnlineCardType.link]: 'L',
      [OnlineCardType.virus]: 'V'
    }
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (let colIndex = 0; colIndex < 8; colIndex++) {
        var square = this.rows[rowIndex][colIndex]
        var card = square.card
        if (card) {
          buffer += teamChar[card.owner]
          buffer += typeChar[card.type]
          buffer += card.lineBoosted ? '+' : ''
        }
        else {
          buffer += '__'
        }
        if (square.firewall) {
          buffer += '/' + teamChar[square.firewall]
        }
        else {
          buffer += '  '
        }
        buffer += ' '
      }
      buffer += '\n'
    }
    return buffer
  }

}

module.exports = Grid
